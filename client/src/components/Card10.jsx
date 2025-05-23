import React from "react";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClearIcon from "@mui/icons-material/Clear";
import { useSelector } from "react-redux";

function Card10({ data }) {
  const { currentUser } = useSelector((state) => state.user);
  const [edit, setEdit] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: data.title,
    description: data.description,
    email: currentUser.email,
    Id: data._id,
  });
  const [status, setStatus] = React.useState(data.status);
  const color = data.status ? "text-green-500" : "text-red-500";

  const handleDelete = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(`${SERVER}/api/todo/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
          Id: data._id,
        }),
        credentials: "include",
      });
      const data2 = await response.json();
      console.log(data2);
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(`${SERVER}/api/todo/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include",
      });
      const data2 = await response.json();
      console.log(data2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async () => {
    const SERVER = import.meta.env.VITE_SERVER;
    try {
      const response = await fetch(`${SERVER}/api/todo/update-status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: currentUser.email,
          Id: data._id,
          status: status,
        }),
        credentials: "include",
      });
      const data2 = await response.json();
      alert("Status updated successfully");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full flex flex-col border-b-1 text-white p-3 gap-3 border-white">
      <div className="flex justify-between">
        <DoneIcon
          onClick={() => {
            setStatus(true);
            handleStatus();
          }}
          className="cursor-pointer"
        />
        <DeleteOutlineIcon onClick={handleDelete} className="cursor-pointer" />
        {edit === false ? (
          <EditIcon className="cursor-pointer" onClick={() => setEdit(true)} />
        ) : (
          <ClearIcon
            className="cursor-pointer"
            onClick={() => setEdit(false)}
          />
        )}
      </div>
      <input
        type="text"
        placeholder="Title"
        readOnly={!edit}
        onChange={(e) => {
          setFormData({ ...formData, title: e.target.value });
        }}
        defaultValue={data.title}
        className={`p-3 focus:outline-none ${color}`}
      />

      <textarea
        placeholder="Description"
        readOnly={!edit}
        onChange={(e) => {
          setFormData({ ...formData, description: e.target.value });
        }}
        defaultValue={data.description}
        className="p-3 focus:outline-none"
      ></textarea>
      <button
        onClick={handleUpdate}
        hidden={!edit}
        className="p-3 text-white border-1 cursor-pointer border-white"
      >
        Done
      </button>
    </div>
  );
}

export default Card10;
