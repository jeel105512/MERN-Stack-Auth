import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../../redux/user/userSlice.js';

export default function Signin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(signInStart());
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch(signInFailure(errorData.errorMessage || 'Sign in failed'));
        return;
      }

      const data = await response.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={handleChange}
          type="email"
          placeholder='Email'
          id='email'
          name='email'
          value={formData.email}
          className='bg-slate-100 p-3 rounded-lg'
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder='Password'
          id='password'
          name='password'
          value={formData.password}
          className='bg-slate-100 p-3 rounded-lg'
        />
        <button
          disabled={loading}
          type="submit"
          className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}>
          <span className='text-blue-500'>Sign Up</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}