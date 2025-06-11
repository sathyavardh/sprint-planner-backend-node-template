const taskCheckListService = require('../services/taskCheckListService');

const createChecklist = async (req, res) => {
  try {
    const result = await taskCheckListService.createChecklist(req.body, req.user._id);
    res.status(201).json({ message: "Checklist created", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getChecklist = async (req, res) => {
  try {
    const result = await taskCheckListService.getChecklistById(req.params.id);
    if (!result) return res.status(404).json({ message: "Checklist not found" });
    res.json({ message: "Checklist fetched", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getChecklists = async (req, res) => {
  try {
    const result = await taskCheckListService.getAllChecklists(req.query.taskId);
    res.json({ message: "Checklists fetched", data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateChecklist = async (req, res) => {
  try {
    const result = await taskCheckListService.updateChecklist(req.params.id, req.body, req.user._id);
    res.json({ message: "Checklist updated", data: result });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteChecklist = async (req, res) => {
  try {
    await taskCheckListService.deleteChecklist(req.params.id);
    res.json({ message: "Checklist deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  createChecklist,
  getChecklist,
  getChecklists,
  updateChecklist,
  deleteChecklist
};
