import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
    setError(''); // Clear error message on input change
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.errorMessage || 'Something went wrong!');
        return;
      }
    } catch (error) {
      setLoading(false);
      setError('Something went wrong!');
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={handleChange}
          type="text"
          placeholder='Name'
          id='name'
          name='name'
          value={formData.name}
          className='bg-slate-100 p-3 rounded-lg'
        />
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className='text-blue-500'>Sign in</span>
        </Link>
      </div>
      {error && <p className='text-red-700 mt-5'>{error}</p>}
    </div>
  )
}