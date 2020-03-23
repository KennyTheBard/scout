CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL
);

CREATE TABLE "permissions" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "permissions_to_users" (
  "permission_id" int,
  "user_id" int,
  "project_id" int,
  PRIMARY KEY ("permission_id", "user_id", "project_id")
);

CREATE TABLE "projects" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "code" varchar[4]
);

CREATE TABLE "statuses" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL,
  "project_id" int,
);

CREATE TABLE "tasks" (
  "id" SERIAL PRIMARY KEY,
  "project_id" int,
  "code" int NOT NULL,
  "description" varchar,
  "status_id" int
);

ALTER TABLE "permissions_to_users" ADD FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id");

ALTER TABLE "permissions_to_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "permissions_to_users" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "statuses" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("status_id") REFERENCES "statuses" ("id");

INSERT INTO permissions(id, name) VALUES
(1, "CREATE_PROJECT"),
(2, "DELETE_PROJECT"),
(3, "UPDATE_PROJECT_NAME"),
(4, "UPDATE_PROJECT_CODE"),
(5, "CREATE_TASK"),
(6, "DELETE_TASK"),
(7, "UPDATE_TASK_DESCRIPTION"),
(8, "UPDATE_TASK_STATUS"),
(9, "CREATE_STATUS"),
(10, "DELETE_STATUS"),
(11, "UPDATE_STATUS_NAME");