const taskCommentService = require("../services/taskCommentService");

const createComment = async (req, res) => {
  try {
    const comment = await taskCommentService.createTaskComment(req.body, req.user._id);
    res.status(201).json({ message: "Comment created", data: comment });
  } catch (err) {
    res.status(500).json({ message: "Failed to create comment", error: err.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await taskCommentService.getAllComments(req.params.taskId);
    res.json({ message: "Comments retrieved", data: comments });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve comments", error: err.message });
  }
};

const getComment = async (req, res) => {
  try {
    const comment = await taskCommentService.getCommentById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    res.json({ message: "Comment retrieved", data: comment });
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve comment", error: err.message });
  }
};

const updateComment = async (req, res) => {
  try {
    const updated = await taskCommentService.updateComment(req.params.id, req.body, req.user._id);
    res.json({ message: "Comment updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update comment", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    await taskCommentService.deleteComment(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete comment", error: err.message });
  }
};

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
};