import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router";

function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const SERVER = import.meta.env.VITE_SERVER;
  const handleSubmit = async (e) => {
    try {
      dispatch(loginStart());
      e.preventDefault();
      const response = await fetch(`${SERVER}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();

      if (data.success === false) {
        dispatch(loginFailure());
        return alert(data.message);
      }
      dispatch(loginSuccess(data.others));
      navigate("/to-do");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="bg-black flex justify-center items-center h-screen w-screen">
        <div className="border-1 border-white h-[50%] lg:w-[50%] w-[80%] rounded-3xl p-3 flex flex-col justify-center items-center   ">
          <h1 className="text-white font-semibold text-4xl">Login</h1>
          <div className="flex flex-col gap-3 w-full justify-center items-center mt-10">
            <input
              type="email"
              placeholder="Enter your email"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="bg-gray-900 text-white p-3 rounded-lg w-[80%] lg:w-[50%] "
            />
            <input
              type="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="bg-gray-900 text-white p-3 rounded-lg w-[80%] lg:w-[50%]"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-500 border-1 m-3 w-[50%] cursor-pointer border-white rounded-lg p-3 text-white"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

export default SignIn;
