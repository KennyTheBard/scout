CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username varchar UNIQUE NOT NULL,
  email varchar UNIQUE NOT NULL,
  full_name varchar NOT NULL,
  password varchar NOT NULL,
  activated boolean NOT NULL
);

CREATE TYPE permission AS ENUM
('VIEW_PROJECT',
'UPDATE_PROJECT', 
'DELETE_PROJECT',

'CREATE_TASK',
'VIEW_TASK',
'UPDATE_TASK',
'DELETE_TASK',

'GRANT_PERMISSION');

CREATE TABLE permissions_to_users (
  permission permission,
  user_id int,
  project_id int,
  PRIMARY KEY (user_id, project_id, permission)
);

CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name varchar UNIQUE NOT NULL
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
  description varchar,
  status task_status
);

ALTER TABLE permissions_to_users ADD FOREIGN KEY (user_id) REFERENCES users (id);

ALTER TABLE permissions_to_users ADD FOREIGN KEY (project_id) REFERENCES projects (id);

ALTER TABLE tasks ADD FOREIGN KEY (project_id) REFERENCES projects (id);