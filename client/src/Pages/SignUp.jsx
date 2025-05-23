import React from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { loginStart, loginFailure, loginFinish } from "../redux/userSlice";

function SignUp() {
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });
  const SERVER = import.meta.env.VITE_SERVER;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(loginStart());

      const res = await fetch(`${SERVER}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(loginFailure(data.message));
        return alert(data.message);
      } else {
        dispatch(loginFinish());
        alert("User Created Successfully");
        navigate("/signin");
      }
    } catch (error) {}
  };
  return (
    <>
      <div className="bg-black flex justify-center items-center h-screen w-screen">
        <div className="border-1 border-white h-[50%] lg:w-[50%] w-[80%] rounded-3xl p-3 flex flex-col justify-center items-center   ">
          <h1 className="text-white font-semibold text-4xl">SignUp</h1>
          <div className="flex flex-col gap-3 w-full justify-center items-center mt-10">
            <input
              type="text"
              placeholder="Enter your name"
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-gray-900 text-white p-3 rounded-lg w-[80%] lg:w-[50%] "
            />
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
            className="bg-green-500 border-1 m-3 w-[50%] cursor-pointer border-white rounded-lg p-3 text-white"
          >
            {loading ? "Loading..." : "SignUp"}
          </button>
        </div>
      </div>
    </>
  );
}

export default SignUp;
