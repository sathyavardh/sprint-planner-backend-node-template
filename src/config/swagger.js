const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const swaggerUi = require('swagger-ui-express');

const loadYamlFile = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(raw);
};

const mainDoc = loadYamlFile(path.join(__dirname, './docs/swagger.yaml'));

// Load all modular YAML files
const permissionPaths = loadYamlFile(path.join(__dirname, './docs/paths/permission.yaml'));
const userPaths = loadYamlFile(path.join(__dirname, './docs/paths/user.yaml'));
const userDesignationPaths = loadYamlFile(path.join(__dirname, './docs/paths/userDesignation.yaml'));
const sprintPaths = loadYamlFile(path.join(__dirname, './docs/paths/sprint.yaml'));
const taskPaths = loadYamlFile(path.join(__dirname, './docs/paths/task.yaml'));
const checklistPaths = loadYamlFile(path.join(__dirname, './docs/paths/taskCheckList.yaml'));
const taskCommentPaths = loadYamlFile(path.join(__dirname, './docs/paths/taskComment.yaml'));
// You can add task.yaml, sprint.yaml, etc.

mainDoc.paths = {
  ...mainDoc.paths,
  ...userPaths.paths,
  ...permissionPaths.paths,
  ...userDesignationPaths.paths,
  ...sprintPaths.paths,
  ...taskPaths.paths,
  ...checklistPaths.paths,
  ...taskCommentPaths.paths
};

module.exports = {
  swaggerUi,
  specs: mainDoc,
};
