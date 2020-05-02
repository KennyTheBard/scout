CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar UNIQUE NOT NULL,
  password varchar NOT NULL
);

CREATE TYPE permission AS ENUM
('VIEW_PROJECT', 'GRANT_VIEW_PROJECT',
'UPDATE_PROJECT_NAME', 'GRANT_UPDATE_PROJECT_NAME',
'UPDATE_PROJECT_CODE', 'GRANT_UPDATE_PROJECT_CODE',
'DELETE_PROJECT', 'GRANT_DELETE_PROJECT',

'CREATE_TASK', 'GRANT_CREATE_TASK',
'VIEW_TASK', 'GRANT_VIEW_TASK',
'UPDATE_TASK_DESCRIPTION', 'GRANT_UPDATE_TASK_DESCRIPTION',
'UPDATE_TASK_STATUS', 'GRANT_UPDATE_TASK_STATUS',
'DELETE_TASK', 'GRANT_DELETE_TASK');

CREATE TABLE permissions_to_users (
  permission permission,
  user_id int,
  project_id int,
  PRIMARY KEY (user_id, project_id, permission)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name varchar UNIQUE NOT NULL,
  code varchar[4]
);

CREATE TYPE task_status AS ENUM
('TODO',
'SELECTED FOR DEVELOPMENT',
'IN PROGRESS',
'READY FOR CODE REVIEW',
'READY FOR TESTING',
'DONE');

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  project_id int,
  code int NOT NULL,
  description varchar,
  status task_status
);

ALTER TABLE permissions_to_users ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE permissions_to_users ADD FOREIGN KEY (project_id) REFERENCES projects (id);

ALTER TABLE tasks ADD FOREIGN KEY (project_id) REFERENCES projects (id);