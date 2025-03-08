import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface SignUpFormState {
  name: string;
  username: string;
  email: string;
  photoUrl: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formState, setFormState] = useState<SignUpFormState>({
    name: "",
    username: "",
    email: "",
    photoUrl: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string>("");

  const navigate = useNavigate()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

const handleFileChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0] || null;

  setLoading(true)
  const image = new FormData()
  if (!file) return;

  image.append('file', file)
  image.append('upload_preset', 'your-upload-preset')

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUDNAME}/image/upload`, {
      method: "POST",
      body: image
    });
  
    const data = await response.json();
  
    if(!data.secure_url){
      toast.error("image upload failed")
      setLoading(false)
      return;
    }
    setLoading(false)
    const url = data.secure_url
  
    setFormState((prevState) => ({
      ...prevState,
      photoUrl: url,
    }));
  } catch (error) {
    toast.error("Failed to upload image")
    setLoading(false)
    console.log(error)
  }
};


  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API}/api/signup`,{
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      })
      const data = await response.json();

      if(data.token){
        localStorage.setItem('token', data.token)
        localStorage.setItem('uid', data.uid)
        navigate('/')
      }
      
      if(!response.ok){
        setError(data.message)
        return;
      }
    } catch (error) {
      console.log((error as Error).message)
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Sign Up</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formState.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="photo">
            Photo
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="photo"
              name="photo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby="photo-description"
            />
            {loading && <FontAwesomeIcon icon={faSpinner} spinPulse className="text-2xl ml-2" />}
          </div>
          <p id="photo-description" className="text-xs text-gray-500 mt-1">Upload a profile picture</p>
          {formState.photoUrl && !loading && (
            <div className="mt-4">
              <img src={formState.photoUrl} className="h-20 w-20 object-cover rounded-full mx-auto" alt="Uploaded profile" />
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
