const userModel = require("../models/userSchema");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const dotenv = require("dotenv");
dotenv.config();

const add = async (req, res) => {
  try {
    const { title, description } = req.body;
    const status = false;
    const user = await userModel.findOneAndUpdate(
      { email: req.body.email },
      {
        $push: {
          todo: { title: title, description: description, status: status },
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "Todo added successfully", user });
  } catch (error) {
    next(error);
  }
};

const gettodo = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const todos = user.todo; // check if your field is 'todos'
    if (!todos || todos.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No todos found" });
    }
    res.status(200).json({ message: "Todos fetched successfully", todos });
  } catch (error) {
    next(error);
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const { email, Id } = req.body;
    const user = await userModel.findOneAndUpdate(
      { email },
      { $pull: { todo: { _id: Id } } },
      { new: true }
    );
    return res.status(200).json({ message: "Todo deleted successfully", user });
  } catch (error) {
    next(error);
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const { email, Id, title, description } = req.body;
    const user = await userModel.findOneAndUpdate(
      { email, "todo._id": Id },
      {
        $set: {
          "todo.$.title": title,
          "todo.$.description": description,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: "Todo updated successfully", user });
  } catch (error) {
    next(error);
  }
};
const updateStatus = async (req, res, next) => {
  try {
    const { Id, email, status } = req.body;
    const user = await userModel.findOneAndUpdate(
      { email, "todo._id": Id },
      {
        $set: {
          "todo.$.status": status,
        },
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    return res.status(200).json({ message: "Todo updated successfully", user });
  } catch (error) {
    next(error);
  }
};
const summary = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const todos = user.todo;
    if (!todos || todos.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No todos found" });
    }
    const completedTodos = todos.filter((todo) => todo.status === true);
    const pendingTodos = todos.filter((todo) => todo.status === false);
    const text = pendingTodos.map((todo) => todo.description).join(" ");
    console.log(text);
    console.log(process.env.COHERE_KEY);
    const responce = await fetch("https://api.cohere.com/v1/summarize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.COHERE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: text,

        length: "short",
        format: "paragraph",
        model: "command-light",
        extractiveness: "auto",
      }),
    });
    const data = await responce.json();
    res.status(200).json({ summary: data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  add,
  gettodo,
  deleteTodo,
  updateTodo,
  updateStatus,
  summary,
};
