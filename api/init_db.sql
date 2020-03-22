CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "username" varchar,
  "password" varchar
);

CREATE TABLE "roles" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
--   "project_id" int
);

CREATE TABLE "roles_to_users" (
  "user_id" int,
  "role_id" int,
  PRIMARY KEY ("user_id", "role_id")
);

-- CREATE TABLE "permissions" (
--   "id" SERIAL PRIMARY KEY,
--   "name" varchar
-- );

-- CREATE TABLE "permissions_to_roles" (
--   "permission_id" int,
--   "role_id" int,
--   PRIMARY KEY ("permission_id", "role_id")
-- );

CREATE TABLE "projects" (
  "id" SERIAL PRIMARY KEY,
  "name" varchar
--   "code" varchar[4]
);

CREATE TABLE "tasks" (
  "id" SERIAL PRIMARY KEY,
--   "numeric_code" varchar UNIQUE NOT NULL,
  "project_id" int,
  "description" varchar,
  "status" varchar
);

-- ALTER TABLE "roles" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

ALTER TABLE "roles_to_users" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");

ALTER TABLE "roles_to_users" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

-- ALTER TABLE "permissions_to_roles" ADD FOREIGN KEY ("permission_id") REFERENCES "permissions" ("id");

-- ALTER TABLE "permissions_to_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id");

ALTER TABLE "tasks" ADD FOREIGN KEY ("project_id") REFERENCES "projects" ("id");

-- for task codes
-- https://stackoverflow.com/questions/6821871/postgresql-sequence-based-on-another-column

INSERT INTO roles(name) VALUES('admin');
INSERT INTO roles(name) VALUES('user');
