# MySQL
## Notes
Very secret, secret: CS-23-DAT-01

### Things changed compared to diagram
1. Fixed naming scheme to be persistent
2. All group entries is now called groupId as group is not valid in MySQL
3. Table GROUP is called GROUP_CONNECTOR, see reason above
4. Added userId as a primary key for AUTH to allow password reset
5. Added id to any index that indexes through an id, e.g. like project reference is now projectId
6. Added user_task_connector

# Setup Database
```
create database timemanagerdatabase;
```

```
CREATE TABLE PROJECTS (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    superProjectId INT UNSIGNED NOT NULL,
    name CHAR(50) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    PRIMARY KEY (id , superProjectId)
);

CREATE TABLE USERS (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    email CHAR(50) NOT NULL UNIQUE,
    firstName CHAR(20) NOT NULL,
    lastName CHAR(20) NOT NULL,
    groupId INT UNSIGNED NOT NULL,
    INDEX (groupId),
    PRIMARY KEY (id , email)
);

CREATE TABLE TIMETYPES (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name CHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE TASKS (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name CHAR(50) NOT NULL,
    startDate DATETIME NOT NULL,
    endDate DATETIME NOT NULL,
    timeType INT UNSIGNED NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (timeType)
        REFERENCES TIMETYPES (id)
);

CREATE TABLE ROLES (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE,
    name CHAR(20) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE USERS_TASKS_TIME_REGISTER (
    date DATE NOT NULL,
    taskId INT UNSIGNED NOT NULL,
    userId INT UNSIGNED NOT NULL,
    time INT UNSIGNED NOT NULL,
    approved BOOLEAN NOT NULL,
    managerLogged BOOLEAN NOT NULL,
    PRIMARY KEY (date , taskId , userId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id),
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id)
);

CREATE TABLE AUTH (
    email CHAR(50) NOT NULL UNIQUE,
    authKey CHAR(64) UNIQUE,
    authKeyEndDate DATETIME,
    userId INT UNSIGNED NOT NULL UNIQUE,
    password CHAR(64) NOT NULL,
    PRIMARY KEY (email , authKey , userId),
    FOREIGN KEY (email)
        REFERENCES USERS (email)  
            ON DELETE CASCADE
            ON UPDATE CASCADE,
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
);

CREATE TABLE USERS_ROLES_CONNECTOR (
    roleId INT UNSIGNED NOT NULL,
    userId INT UNSIGNED NOT NULL,
    FOREIGN KEY (roleId)
        REFERENCES ROLES (id),
    FOREIGN KEY (userId)
        REFERENCES USERS (id)
);
ALTER TABLE users_roles_connector ADD UNIQUE urc_row_unique(roleId, userId);

CREATE TABLE GROUPS_CONNECTOR (
    managerId INT UNSIGNED NOT NULL,
    groupId INT UNSIGNED NOT NULL,
    FOREIGN KEY (managerId)
        REFERENCES USERS (id),
	FOREIGN KEY (groupId)
        REFERENCES USERS (groupId)   
            ON DELETE CASCADE
            ON UPDATE CASCADE
);


CREATE TABLE TASKS_PROJECTS_CONNECTOR (
    taskId INT UNSIGNED NOT NULL,
    projectId INT UNSIGNED NOT NULL,
    PRIMARY KEY (taskId , projectId),
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id),
    FOREIGN KEY (projectId)
        REFERENCES PROJECTS (id)
);

CREATE TABLE PROJECTS_MANAGER_CONNECTOR (
    userId INT UNSIGNED NOT NULL,
    projectId INT UNSIGNED NOT NULL,
    PRIMARY KEY (userId , projectId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id),
    FOREIGN KEY (projectId)
        REFERENCES PROJECTS (id)
);

CREATE TABLE USERS_TASKS_CONNECTOR (
    userId INT UNSIGNED NOT NULL,
    taskId INT UNSIGNED NOT NULL,
    PRIMARY KEY (userId , taskId),
    FOREIGN KEY (userId)
        REFERENCES USERS (id),
    FOREIGN KEY (taskId)
        REFERENCES TASKS (id)
);
```