const sprintService = require('../services/sprintService');

const getSprints = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  console.log('Fetching sprints - Page:', page, 'Limit:', limit);

  const result = await sprintService.getAllSprints(parseInt(page), parseInt(limit));

  console.log('Sprints fetched:', result.sprints.length);

  res.json({
    message: 'Sprints retrieved successfully',
    data: result.sprints,
    pagination: result.pagination
  });
};

const getSprint = async (req, res) => {
  const sprintId = req.params.id;
  console.log('Fetching sprint by ID:', sprintId);

  const sprint = await sprintService.getSprintById(sprintId);

  if (!sprint) {
    console.log('Sprint not found for ID:', sprintId);
    return res.status(404).json({ message: 'Sprint not found' });
  }

  console.log('Sprint found:', sprint);

  res.json({
    message: 'Sprint retrieved successfully',
    data: sprint
  });
};

const createSprint = async (req, res) => {
  try {
    req.previousData = null; // For audit

    console.log('Creating new sprint...');
    console.log('Request Body:', req.body);
    console.log('Created By User ID:', req.user._id);

    const sprint = await sprintService.createSprint(req.body, req.user._id);

    console.log('Sprint created:', sprint);

    res.status(201).json({
      message: 'Sprint created successfully',
      data: sprint
    });
  } catch (error) {
    console.error('Error creating sprint:', error);
    res.status(500).json({
      message: 'Failed to create sprint',
      error: error.message
    });
  }
};

const updateSprint = async (req, res) => {
  try {
    const sprintId = req.params.id;
    console.log('Updating sprint ID:', sprintId);
    console.log('Update Data:', req.body);
    console.log('Updated By User ID:', req.user._id);

    const previousSprint = await sprintService.getSprintById(sprintId);
    req.previousData = previousSprint?.toObject();
    console.log('Previous Sprint Data:', req.previousData);

    const sprint = await sprintService.updateSprint(sprintId, req.body, req.user._id);

    console.log('Sprint updated:', sprint);

    res.json({
      message: 'Sprint updated successfully',
      data: sprint
    });
  } catch (error) {
    console.error('Error updating sprint:', error);
    res.status(500).json({
      message: 'Failed to update sprint',
      error: error.message
    });
  }
};

const deleteSprint = async (req, res) => {
  try {
    const sprintId = req.params.id;
    console.log('Deleting sprint ID:', sprintId);
    console.log('Deleted By User ID:', req.user._id);

    await sprintService.deleteSprint(sprintId, req.user._id);

    console.log('Sprint deleted:', sprintId);

    res.json({
      message: 'Sprint deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting sprint:', error);
    res.status(500).json({
      message: 'Failed to delete sprint',
      error: error.message
    });
  }
};

module.exports = {
  getSprints,
  getSprint,
  createSprint,
  updateSprint,
  deleteSprint
};