import React, { useState } from "react";
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

  const image = new FormData()
  if (!file) return;

  // const image = {image: file}
  image.append('image', file)
  const response = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMAGE_SECRET}`, {
    method: "POST",
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
    body: image
  });

  const data = await response.json();

  console.log(data)
  if(!data.data.url){
    alert("Failed to upload image")
    return;
  }
  const url = data.data.url
  console.log(url)

  setFormState((prevState) => ({
    ...prevState,
    photoUrl: url,
  }));
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
        navigate('/')
      }
    } catch (error) {
      console.log(error)
    }

    console.log(formState); // Handle form submission logic here
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
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
          className="w-full px-3 py-2 border rounded-md"
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
          className="w-full px-3 py-2 border rounded-md"
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
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <div className="mb-4">
        {formState.photoUrl && <img src={formState.photoUrl} className="h-20" alt="image not uploaded" />}
        <label className="block text-sm font-medium mb-2" htmlFor="photo">
          Photo
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded-md"
        />
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
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Sign Up
      </button>
    </form>
    </div>
  );
};

export default Signup;
