module.exports = {
  DESIGNATIONS: {
    JUNIOR_DEV: 'jnrDev',
    SENIOR_DEV: 'seniorDev',
    MANAGER: 'manager',
    TESTING: 'testing'
  },

  TASK_TAGS: ['frontend', 'backend', 'ai', 'devops', 'testing'],
  TASK_LEVELS: ['immediate', 'intermediate'],
  TASK_STATUS: ['Not yet started', 'In progress', 'Completed'],

  AUDIT_ACTIONS: {
    CREATE: 'CREATE',
    UPDATE: 'UPDATE',
    DELETE: 'DELETE'
  },

  PERMISSIONS: {
    USER_READ: 'user:read',
    USER_CREATE: 'user:create',
    USER_UPDATE: 'user:update',
    USER_DELETE: 'user:delete',
    PERMISSION_READ: 'permission:read',
    PERMISSION_CREATE: 'permission:create',
    PERMISSION_UPDATE: 'permission:update',
    PERMISSION_DELETE: 'permission:delete',
    DESIGNATION_READ: 'designation:read',
    DESIGNATION_CREATE: 'designation:create',
    DESIGNATION_UPDATE: 'designation:update',
    DESIGNATION_DELETE: 'designation:delete',
    AUDIT_READ: 'audit:read',
    SPRINT_CREATE: 'sprint:create',
    SPRINT_READ: 'sprint:read',
    SPRINT_UPDATE: 'sprint:update',
    SPRINT_DELETE: 'sprint:delete',
    TASK_CREATE: 'task:create',
    TASK_READ: 'task:read',
    TASK_UPDATE: 'task:update',
    TASK_DELETE: 'task:delete',
    TASKCHECKLIST_CREATE: 'taskChecklist:create',
    TASKCHECKLIST_READ: 'taskChecklist:read',
    TASKCHECKLIST_UPDATE: 'taskChecklist:update',
    TASKCHECKLIST_DELETE: 'taskChecklist:delete',
    TASKCOMMENT_CREATE: 'taskComment:create',
    TASKCOMMENT_READ: 'taskComment:read',
    TASKCOMMENT_UPDATE: 'taskComment:update',
    TASKCOMMENT_DELETE: 'taskComment:delete'
  }
};