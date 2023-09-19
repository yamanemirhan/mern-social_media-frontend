import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../features/auth/authSlice";
import { toast } from "react-toastify";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, loading } = useSelector((state) => state.auth);
  const registerLoading = loading.register;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.passwordAgain) {
      return toast.error("Passwords do not match!");
    }

    const { passwordAgain, ...otherData } = formData;
    dispatch(register(otherData)).then((res) => {
      if (res.payload.success) {
        navigate("/login");
      }
    });
  };

  return (
    <div className="bg-black-main w-screen h-screen text-white-main">
      <div className="max-w-[600px] mx-auto pt-24">
        <h2 className="uppercase text-center text-2xl">Register</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2 mt-6">
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              required
              onChange={handleChange}
              className="p-1 rounded-md bg-black-navbar"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              onChange={handleChange}
              className="p-1 rounded-md bg-black-navbar"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              required
              onChange={handleChange}
              className="p-1 rounded-md bg-black-navbar"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="passwordAgain">Password Again</label>
            <input
              type="password"
              name="passwordAgain"
              value={formData.passwordAgain}
              required
              onChange={handleChange}
              className="p-1 rounded-md bg-black-navbar"
            />
          </div>
          <button
            type="submit"
            disabled={registerLoading}
            className="bg-black-navbar w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
          >
            {registerLoading ? "Submitting..." : "Register"}
          </button>
        </form>
        <div className="mt-6 p-1">
          Already have an account?
          <Link to={"/login"} className="font-bold ml-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
