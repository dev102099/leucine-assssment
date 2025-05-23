const express = require("express");
const { verify } = require("jsonwebtoken");
const {
  add,
  gettodo,
  deleteTodo,
  updateTodo,
  updateStatus,
  summary,
} = require("../controllers/todoController");

const router = express.Router();

router.post("/add", verify, add);
router.get("/:email/get", verify, gettodo);
router.delete("/delete", verify, deleteTodo);
router.post("/update", verify, updateTodo);
router.put("/update-status", verify, updateStatus);
router.get("/summary/:email", verify, summary);

module.exports = router;
