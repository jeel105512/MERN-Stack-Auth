import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

import { app } from "../../firebase.js";
import { updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure } from "../../redux/user/userSlice.js";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user.user);

  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imageUploadPercent, setImageUploadPercent] = useState(0);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageUploadPercent(Math.round(progress));
      },
      (error) => {
        setImageUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setFormData({ ...formData, photo: downloadUrl });
        });
      }
    );
  }

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      dispatch(updateUserStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!data.success) {
        dispatch(updateUserFailure(data.errorMessage));
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
    } catch (error) {
      console.error(error);
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/remove/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if(!data.success) {
        dispatch(deleteUserFailure(data.errorMessage));
        return;
      }
      dispatch(deleteUserSuccess(data.message));
    } catch (error) {
      console.error(error);
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" ref={fileRef} hidden accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        <img onClick={() => fileRef.current.click()} src={formData.photo || currentUser.photo} alt={currentUser.name} className='h-24 w-24 rounded-full self-center object-cover cursor-pointer mt-2' />
        <p className="text-sm self-center">
          {imageUploadError ? (
            <span className="text-red-700">Error uploading image! (File size must be less then 2Mbs)</span>
          ) : imageUploadPercent > 0 && imageUploadPercent < 100 ? (
            <span className="text-green-700">{`Uploading image... ${imageUploadPercent}%`}</span>
          ) : imageUploadPercent === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input onChange={handleChange} defaultValue={currentUser.name} type="text" id='name' placeholder='Name' className='bg-slate-100 rounded-lg p-3' />
        <input onChange={handleChange} defaultValue={currentUser.email} type="email" id='email' placeholder='Email' className='bg-slate-100 rounded-lg p-3' />
        <input onChange={handleChange} type="password" id='password' placeholder='Password' className='bg-slate-100 rounded-lg p-3' />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80" disabled={loading}>{loading ? "Loading..." : "Update"}</button>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteAccount} className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
      <p className="text-red-700 mt-5">{error && "Sometgin went wrong!"}</p>
      <p className="text-green-700 mt-5">{updateSuccess && "User updated successfully!"}</p>
    </div>
  )
}
