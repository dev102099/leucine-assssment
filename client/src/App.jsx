import "./App.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import Card10 from "./components/Card10";
import { signOut } from "./redux/userSlice";

function App() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  useEffect(() => {
    if (!currentUser) navigate("/signin");
  }, [currentUser]);

  if (!currentUser) return null;

  const dispatch = useDispatch();
  const [fetched, setFetched] = useState([""]);
  const [summary, setSummary] = useState("");

  const [show, setShow] = useState(true);
  const [signout, setSignout] = useState(true);
  const [todo, setTodo] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    email: currentUser.email,
  });

  const handleSignout = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(`${SERVER}/api/auth/logout`, {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success === false) {
        return alert(data.message);
      }
      dispatch(signOut());
      navigate("/signin");
    } catch (error) {
      console.log(error);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();

    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(`${SERVER}/api/todo/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTodos = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(
        `${SERVER}/api/todo/${currentUser.email}/get`
      );
      const data = await response.json();
      if (data.success === false) {
        return setFetched([]);
      }
      setFetched(data.todos);
    } catch (error) {
      console.log(error);
    }
  };

  const summarize = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(
        `${SERVER}/api/todo/summary/${currentUser.email}`
      );
      const data = await response.json();
      if (data.success === false) {
      }
      setSummary(data.summary);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="h-screen overflow-hidden w-screen flex flex-col bg-black">
        <div className="border-1 border-white h-[10%] gap-3 flex justify-end p-3 items-center">
          <span
            hidden={signout}
            onClick={handleSignout}
            className="text-white hover:underline cursor-pointer"
          >
            Sign Out
          </span>
          <div
            onClick={() => setSignout(!signout)}
            className=" text-white flex justify-center text-2xl cursor-pointer items-center border-1 border-white h-15 w-15 rounded-full"
          >
            D
          </div>
        </div>
        <div className="flex flex-col items-center mt-5  w-full h-full">
          <h1 className="custom-font  text-white font-semibold text-2xl">
            Welcome {`${currentUser.name}`}!
          </h1>
          <h1 className="text-white text-4xl mt-5 underline custom-font ">
            To-Do
          </h1>
          <div className="flex w-full h-full justify-center gap-40">
            <div className="flex flex-col justify-center cursor-pointer items-center">
              <AddIcon onClick={() => setTodo(!todo)} sx={{ color: "white" }} />
              <h1 className="text-white custom-font">Add an To-Do item</h1>
              <div
                hidden={todo}
                className="border-1 border-white flex flex-col gap-4 p-3"
              >
                <input
                  type="text"
                  placeholder="Title"
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="text-white p-3 border-1 border-white"
                />
                <textarea
                  placeholder="Description"
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="text-white p-3 border-1 border-white"
                />
                <button
                  onClick={addTodo}
                  className="p-3 text-white border-1 border-white cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center">
              <RemoveRedEyeIcon
                onClick={() => {
                  setShow(!show);
                  fetchTodos();
                }}
                sx={{ color: "white" }}
              />
              <h1 className="text-white custom-font">Show all items</h1>

              <div
                hidden={show}
                className="border-1 flex flex-col border-white overflow-scroll w-[150%] h-[50%]"
              >
                {fetched.length === 0 ? (
                  <span className="text-red-700">No Todos Found</span>
                ) : (
                  fetched.map((item) => {
                    return (
                      <div>
                        <Card10 data={item} />
                      </div>
                    );
                  })
                )}
                <div className="p-3 border-b-1 border-white text-white w-[150%]">
                  {`${summary.message}`}
                  {summary.summary != undefined || null
                    ? `${summary.summary}`
                    : null}
                </div>
                <button
                  onClick={summarize}
                  className="text-white p-3 custom-font border-1 border-white cursor-pointer"
                >
                  Summarize
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
