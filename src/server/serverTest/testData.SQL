# Insure the correct database is selected
# ${db} will be overridden with actual name
USE ${db};

# ----------------------------------------
# ------------- Auth & Login -------------
# ----------------------------------------
INSERT INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('authexpired@example.com','Auth','Expired',1); # Id 2

INSERT INTO AUTH
(email,authKey,authKeyEndDate,userId,password)
VALUES
    ('authexpired@example.com','2481f36dfc515ca76451aaadf1399026942a01ee50c6d0a61988b43cef039bc2','2000-01-1',2,'78675cc176081372c43abab3ea9fb70c74381eb02dc6e93fb6d44d161da6eeb3');

# ----------------------------------------
# ---------------- Group -----------------
# ----------------------------------------

# %%%%%%%%%%%%%%%%% Get %%%%%%%%%%%%%%%%%%
INSERT INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('groupgetmanager@example.com','Group','Manager', 1); # Id 3

INSERT INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 3);

INSERT INTO GROUPS_CONNECTOR
(managerId)
values
    (3);

INSERT INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('groupget1@example.com','Group','User1',2), # Id 4
    ('groupget2@example.com','Group','User2',2); # Id 5

# %%%%%%%%%%%%%%%%% Post %%%%%%%%%%%%%%%%%%

INSERT INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('grouppostmanager@example.com','Group','Manager', 1); # Id 6

INSERT INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 6);

# %%%%%%%%%%%%%%%%% Post %%%%%%%%%%%%%%%%%%

INSERT INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('groupputmanager@example.com','Group','Manager', 1); # Id 7

INSERT INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 7);

INSERT INTO GROUPS_CONNECTOR
(managerId)
values
    (7);

# ----------------------------------------
# --------------- Project ----------------
# ----------------------------------------

# %%%%%%%%%%%%%%%%% Get %%%%%%%%%%%%%%%%%%
INSERT IGNORE INTO PROJECTS
(superProjectId, name, startDate, endDate)
VALUES
    (0,'Project Get Test','2023-03-20','2023-04-22');   # Id 1

# %%%%%%%%%%%%%%%%% Put %%%%%%%%%%%%%%%%%%
INSERT IGNORE INTO PROJECTS
(superProjectId, name, startDate, endDate)
VALUES
    (0,'Project Put Test','2023-03-20','2023-04-22');   # Id 2

# %%%%%%%%%%%%%%%% Info %%%%%%%%%%%%%%%%%%
INSERT IGNORE INTO PROJECTS
(superProjectId, name, startDate, endDate)
VALUES
    (0,'Project Info Test','2023-03-20','2023-04-22');   # Id 3

INSERT IGNORE INTO TASKS
(name, startDate, endDate, timeType)
VALUES
    ('Project Info Task','2023-03-20','2023-04-26',1); # Id 1

INSERT IGNORE INTO USERS_TASKS_CONNECTOR
(userId,taskId)
VALUES
    (4,1), (5,1);

INSERT IGNORE INTO TASKS_PROJECTS_CONNECTOR
(taskId, projectId)
VALUES
    (1,3),
    (1,3);