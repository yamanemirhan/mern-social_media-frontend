import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, loading } = useSelector((state) => state.auth);
  const loginLoading = loading.login;

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(login(formData));
  };

  return (
    <div className="bg-black-main w-screen h-screen text-white-main">
      <div className="max-w-[600px] mx-auto pt-24">
        <h2 className="uppercase text-center text-2xl">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2 mt-6">
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

          <button
            type="submit"
            disabled={loginLoading}
            className="bg-black-navbar w-fit mx-auto py-2 px-6 mt-2 rounded-md text-xl hover:scale-105 duration-500"
          >
            {loginLoading ? "Submitting..." : "Login"}
          </button>
        </form>
        <div className="mt-6 p-1">
          Don't have an account?
          <Link to={"/register"} className="font-bold ml-4">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
