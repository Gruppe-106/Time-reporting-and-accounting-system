# ----------------------------------------------
# -------- Delete and recreate database --------
# ----------------------------------------------
DROP DATABASE IF EXISTS ${db};
CREATE DATABASE ${db};
# Use the newly created database as default for subsequent operations
USE ${db};

# ----------------------------------------------
# -------- Create all necessary tables ---------
# ----------------------------------------------
CREATE TABLE PROJECTS
(
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    superProjectId INT UNSIGNED NOT NULL,
    name           CHAR(50)     NOT NULL,
    startDate      DATETIME     NOT NULL,
    endDate        DATETIME     NOT NULL,
    PRIMARY KEY (id, superProjectId)
);

CREATE TABLE USERS
(
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    email     CHAR(50)     NOT NULL UNIQUE,
    firstName CHAR(20)     NOT NULL,
    lastName  CHAR(20)     NOT NULL,
    groupId   INT UNSIGNED NOT NULL,
    INDEX (groupId),
    PRIMARY KEY (id, email)
);

# Add a default admin user
INSERT IGNORE INTO USERS
(email,firstName,lastName ,groupId)
VALUES
    ('admin@admin.com','Admin','Default',1);

CREATE TABLE TIMETYPES
(
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name CHAR(20)     NOT NULL,
    PRIMARY KEY (id)
);

# Add all time-types
INSERT IGNORE INTO TIMETYPES
(name)
VALUES
    ('billable'),
    ('non-billable'),
    ('sick'),
    ('vacation');

CREATE TABLE TASKS
(
    id        INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name      CHAR(50)     NOT NULL,
    startDate DATETIME     NOT NULL,
    endDate   DATETIME     NOT NULL,
    timeType  INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (timeType)
        REFERENCES TIMETYPES (id)
);

CREATE TABLE ROLES
(
    id   INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name CHAR(20)     NOT NULL,
    PRIMARY KEY (id)
);

# Add default roles
INSERT IGNORE INTO ROLES
    (name)
    values
        ('normal'),('manager'),('project-leader'),('admin');

CREATE TABLE USERS_TASKS_TIME_REGISTER
(
    date          DATE         NOT NULL,
    taskId        INT UNSIGNED NOT NULL,
    userId        INT UNSIGNED NOT NULL,
    time          INT UNSIGNED NOT NULL,
    approved      BOOLEAN      NOT NULL,
    managerLogged BOOLEAN      NOT NULL,
    PRIMARY KEY (date, taskId, userId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
        ON DELETE CASCADE,
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id)
        ON DELETE RESTRICT
);
# Ensures the rows are unique so no duplicate date - taskId - userId exists
ALTER TABLE USERS_TASKS_TIME_REGISTER
    ADD UNIQUE uttr_row_unique (date, taskId, userId);

CREATE TABLE AUTH
(
    email          CHAR(50)     NOT NULL UNIQUE,
    authKey        CHAR(64) UNIQUE,
    authKeyEndDate DATETIME,
    userId         INT UNSIGNED NOT NULL UNIQUE,
    password       CHAR(64)     NOT NULL,
    PRIMARY KEY (email, authKey, userId),
    FOREIGN KEY (email)
        REFERENCES USERS (email)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
);

# Add a default admin user
INSERT IGNORE INTO AUTH
(email,authKey,authKeyEndDate,userId,password)
VALUES
    ('admin@admin.com',
     '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
     '2025-01-01', 1,
     '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');

CREATE TABLE USERS_ROLES_CONNECTOR
(
    roleId INT UNSIGNED NOT NULL,
    userId INT UNSIGNED NOT NULL,
    PRIMARY KEY (userId, roleId),
    FOREIGN KEY (roleId)
        REFERENCES ROLES (id),
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
        ON DELETE CASCADE
);

# Ensures the rows are unique so no duplicate roleId - userId exists
ALTER TABLE USERS_ROLES_CONNECTOR
    ADD UNIQUE urc_row_unique (roleId, userId);

# Add default role to admin
INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId, userId)
values
    (4, 1);

CREATE TABLE GROUPS_CONNECTOR
(
    managerId INT UNSIGNED NOT NULL,
    groupId   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (groupId),
    FOREIGN KEY (managerId)
        REFERENCES USERS (id)
        ON DELETE CASCADE
);
# Ensures the rows are unique so no duplicate managerId - groupId exists
ALTER TABLE GROUPS_CONNECTOR
    ADD UNIQUE gc_row_unique (managerId, groupId);

# Add a default admin user
INSERT IGNORE INTO GROUPS_CONNECTOR
    (managerId, groupId)
    VALUES (1, 1);

# Constraint between user and group has to be created after,
# as the constraint can be made to table that doesn't exist
ALTER TABLE USERS
    ADD CONSTRAINT USERS_GROUPS_CONNECTOR_ibfk_1
        FOREIGN KEY (groupId)
            REFERENCES GROUPS_CONNECTOR (groupId)
            ON DELETE RESTRICT
            ON UPDATE CASCADE;

CREATE TABLE TASKS_PROJECTS_CONNECTOR
(
    taskId    INT UNSIGNED NOT NULL UNIQUE,
    projectId INT UNSIGNED NOT NULL,
    PRIMARY KEY (taskId, projectId),
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id)
            ON DELETE CASCADE,
    FOREIGN KEY (projectId)
        REFERENCES PROJECTS (id)
);

CREATE TABLE PROJECTS_MANAGER_CONNECTOR
(
    userId    INT UNSIGNED NOT NULL,
    projectId INT UNSIGNED NOT NULL,
    PRIMARY KEY (projectId, userId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
        ON DELETE CASCADE,
    FOREIGN KEY (projectId)
        REFERENCES PROJECTS (id)
);

# Ensures the rows are unique so no duplicate userId - projectId exists
ALTER TABLE PROJECTS_MANAGER_CONNECTOR
    ADD UNIQUE pmc_row_unique (userId, projectId);

CREATE TABLE USERS_TASKS_CONNECTOR
(
    userId INT UNSIGNED NOT NULL,
    taskId INT UNSIGNED NOT NULL,
    PRIMARY KEY (userId, taskId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
        ON DELETE CASCADE,
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id)
        ON DELETE CASCADE
);
