# |--------------- !! Beware !! ---------------|
# |Should only be used in conjunction with wipe|
# |    User with id 1 is the default admin     |
# | Information for admin will be altered last |
# |--------------- !! Beware !! ---------------|

USE ${db};

# ----------------------------------------------
# ----------------- Time Type ------------------
# ----------------------------------------------
INSERT IGNORE INTO TIMETYPES
(name)
VALUES
    ('billable'),
    ('non-billable'),
    ('sick'),
    ('vacation');

# ----------------------------------------------
# ----------------- Projects -------------------
# ----------------------------------------------
INSERT IGNORE INTO PROJECTS
(superProjectId, name, startDate, endDate)
VALUES
    (0,'Project Alpha','2023-03-20','2023-04-22'),
    (1,'Project Beta','2023-03-22','2023-05-23'),
    (2,'Project Gamma','2023-03-23','2023-04-23'),
    (2,'Project Delta','2023-03-25','2023-05-26'),
    (0,'Project Epsilon','2023-03-20','2023-04-26');

# ----------------------------------------------
# ------------------- Tasks --------------------
# ----------------------------------------------
INSERT IGNORE INTO TASKS
(name, startDate, endDate, timeType)
VALUES
    ('Task X','2023-03-20','2023-04-26',1),
    ('Task Y','2023-03-23','2023-05-26',1),
    ('Task Z','2023-03-20','2023-04-26',1),
    ('Task A','2023-03-20','2023-05-23',2),
    ('Task B','2023-03-23','2023-05-26',1),
    ('Task C','2023-03-25','2023-05-26',2),
    ('Task D','2023-03-23','2023-04-23',1),
    ('Task E','2023-03-20','2023-04-22',2),
    ('Task F','2023-03-23','2023-04-22',1),
    ('Task G','2023-03-20','2023-04-26',2);

# ----------------------------------------------
# ---------- Tasks/Projects connector ----------
# ----------------------------------------------
INSERT IGNORE INTO TASKS_PROJECTS_CONNECTOR
(taskId, projectId)
VALUES
    (1,1),(2,2),(3,3),(4,4),(5,5),(6,1),(7,2),(8,3),(9,4),(10,5);

# ----------------------------------------------
# ------------------- Users --------------------
# ----------------------------------------------

# ----------- Managers ----------
INSERT IGNORE INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('joe@example.com','Joe','Smith',1), # Joe Smith user 2
    ('jane@example.com','Jane','Doe',1); # Jane Doe  user 3


INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 2), # Joe Smith user 2
    (2, 3); # Jane Doe  user 3


INSERT IGNORE INTO GROUPS_CONNECTOR
(managerId, groupId)
values
    (2, 2), # Joe Smith user 2
    (3, 3); # Jane Doe  user 3

# Tom Jones user 4
INSERT IGNORE INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('tom@example.com', 'Tom', 'Jones', 2);

INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 4);

INSERT IGNORE INTO GROUPS_CONNECTOR
(managerId, groupId)
values
    (4, 1);

# ------------ Normal-users ------------
INSERT IGNORE INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('jill@example.com','Jill','Jones',3), # Jill Jones user 5
    ('john@example.com','John','Adams',3), # John Adams user 6
    ('dave@example.com','Dave','Brown',3); # Dave Brown user 7

INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (1,5), # Jill Jones user 5
    (1,6), # John Adams user 6
    (1,7); # Dave Brown user 7


# ----------- Project-leaders ----------
INSERT IGNORE INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('sam@example.com','Sam','Smith',1),     # Sam Smith    user 8
    ('sarah@example.com','Sarah','Doe',2),   # Sarah Doe    user 9
    ('alex@example.com','Alex','Johnson',3); # Alex Johnson user 10

INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (3,8),  # Sam Smith    user 8
    (3,9),  # Sarah Doe    user 9
    (3,10); # Alex Johnson user 10

INSERT IGNORE INTO PROJECTS_MANAGER_CONNECTOR
(userId, projectId)
VALUES
    (9,1),(9,2),(9,3),(10,4),(8,5);

# --------------- Admin ---------------
# Update the default admin to different values
UPDATE USERS
SET email='matt@example.com',firstName='Matt',lastName='Brown',groupId=2
WHERE id=1;

# --------------- Auth ---------------
INSERT IGNORE INTO  AUTH
(email, authKey, authKeyEndDate, userId, password)
VALUES
    ('matt@example.com','b1edd8d44599536a1687546bee7b5ef88ea342b3352302a6322e12ecca19fb86','2023-12-30',1,'4f31fa50e5bd5ff45684e560fc24aeee527a43739ab611c49c51098a33e2b469'), # Matt Brown user 1
    ('joe@example.com','2481f36dfc515ca76451aaadf1399026942a01ee50c6d0a61988b43cef039bc2','2023-12-30',2,'78675cc176081372c43abab3ea9fb70c74381eb02dc6e93fb6d44d161da6eeb3'), # Joe Smith user 2
    ('jane@example.com','8c87b489ce35cf2e2f39f80e282cb2e804932a56a213983eeeb428407d43b52d','2023-12-30',3,'81f8f6dde88365f3928796ec7aa53f72820b06db8664f5fe76a7eb13e24546a2'), # Jane Doe  user 3
    ('tom@example.com','72bb75a959e1785b79ffe7230eaeec25880707a91b4a4f98330fc1510bd40e03','2023-12-30',4,'e1608f75c5d7813f3d4031cb30bfb786507d98137538ff8e128a6ff74e84e643'), # Tom Jones user 4
    ('jill@example.com','127ba059404a7145b3d876abfe50a1298dd49deb60eacefc55deb9c9d8261da6','2023-12-30',5,'8cf37351b60f00084392043ce2e6256b96cea92949f90c7abce464cf164fbfa6'), # Jill Jones   user 5
    ('john@example.com','855f96e983f1f8e8be944692b6f719fd54329826cb62e98015efee8e2e071dd4','2023-12-30',6,'96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a'), # John Adams   user 6
    ('dave@example.com','7b34211350ff567970974e1e2b98d319a601969e74fd1a957bc889b8332d00eb','2023-12-30',7,'61ea0803f8853523b777d414ace3130cd4d3f92de2cd7ff8695c337d79c2eeee'), # Dave Brown   user 7
    ('sam@example.com','cd25a6171969f2a3c6e35c7667e3908ef1bd2424241db04411a0eec454ca6c16','2023-12-30',8,'e96e02d8e47f2a7c03be5117b3ed175c52aa30fb22028cf9c96f261563577605'), # Sam Smith    user 8
    ('sarah@example.com','1b0df3084513e398249e55cd6fe2b41dda58e0d835f78c6b8d33c08909c3df9e','2023-12-30',9,'d233633d9524e84c71d6fe45eb3836f8919148e4a5fc2234cc9e6494ec0f11c2'), # Sarah Doe    user 9
    ('alex@example.com','6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110','2023-12-30',10,'4135aa9dc1b842a653dea846903ddb95bfb8c5a10c504a7fa16e10bc31d1fdf0'); # Alex Johnson user 10


# ----------- User/tasks connection ----------
INSERT IGNORE INTO USERS_TASKS_CONNECTOR
    (userId,taskId)
    VALUES
        (1,10),(1,2),(1,3),
        (2,10),(2,2),(2,3),
        (3,9),(3,2),(3,3),
        (4,9),(4,2),(4,3),
        (5,1),(5,8),(5,3),
        (6,1),(6,8),(6,3),
        (7,1),(7,2),(7,7),
        (8,4),(8,5),(8,6),
        (9,4),(9,5),(9,6),
        (10,4),(10,5),(10,6);

INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
    (date,taskId,userId,time,approved,managerLogged)
    VALUES
        # Id 1 (1,10),(1,2),(1,3)
        ('20-03-2023',10,1,0.5,0,0),
        ('21-03-2023',10,1,2  ,0,0),
        ('25-03-2023',10,1,3  ,1,1),
        ('23-03-2023',2 ,1,1  ,0,0),
        ('24-03-2023',2 ,1,5  ,1,1),
        ('26-03-2023',2 ,1,10 ,0,1),
        ('22-03-2023',3 ,1,3  ,1,1),
        ('23-03-2023',3 ,1,1  ,1,1),
        ('24-03-2023',3 ,1,5  ,0,0),
        # Id 2 (2,10),(2,2),(2,3)
        ('20-03-2023',10,2,0.5,0,1),
        ('25-03-2023',2 ,2,1  ,0,1),
        ('26-03-2023',2 ,2,3  ,0,1),
        ('22-03-2023',3 ,2,1  ,0,1),
        ('21-03-2023',3 ,2,5  ,0,1),
        # Id 3 (3,9),(3,2),(3,3)
        ('29-03-2023',9 ,1,0.5,0,0),
        ('01-04-2023',9 ,1,0.5,0,0),
        ('02-04-2023',9 ,1,3  ,0,0),
        ('03-04-2023',2 ,1,5  ,0,0),
        ('04-04-2023',2 ,1,5  ,0,0),
        ('26-03-2023',2 ,1,0.5,0,0),
        ('22-03-2023',3 ,1,0.5,0,0),
        ('23-03-2023',3 ,1,1  ,1,1),
        ('24-03-2023',3 ,1,5  ,0,1),
        # Id 4 (4,9),(4,2),(4,3)
        ('20-03-2023',9 ,2,0.5,1,1),
        ('21-03-2023',9 ,2,2  ,1,1),
        ('25-03-2023',9 ,2,3  ,1,1),
        ('23-03-2023',2 ,2,1  ,1,1),
        ('02-04-2023',2 ,2,5  ,0,0),
        ('26-03-2023',3 ,2,1  ,0,0),
        ('22-03-2023',3 ,2,5  ,0,0),
        # Id 5 (5,1),(5,8),(5,3)
        ('04-04-2023',1 ,1,0.5,0,0),
        ('23-03-2023',8 ,1,1  ,0,1),
        ('24-03-2023',8 ,1,5  ,1,1),
        ('26-03-2023',8 ,1,10 ,1,1),
        ('04-04-2023',3 ,1,3  ,1,1),
        ('26-03-2023',3 ,1,1  ,1,1),
        ('22-03-2023',3 ,1,5  ,1,1),
        # Id 6 (6,1),(6,8),(6,3)
        ('20-03-2023',1 ,2,0.5,0,0),
        ('21-03-2023',1 ,2,2  ,0,0),
        ('25-03-2023',1 ,2,3  ,0,0),
        ('23-03-2023',8 ,2,1  ,0,0),
        ('24-03-2023',8 ,2,5  ,0,0),
        ('26-03-2023',8 ,2,10 ,0,1),
        ('22-03-2023',3 ,2,3  ,1,1),
        ('23-03-2023',3 ,2,1  ,1,1),
        ('24-03-2023',3 ,2,5  ,0,1),
        # Id 7 (7,1),(7,2),(7,7)
        ('21-03-2023',1 ,1,0.5,0,1),
        ('25-03-2023',1 ,1,2  ,0,1),
        ('23-03-2023',1 ,1,3  ,0,1),
        ('24-03-2023',2 ,1,1  ,0,1),
        ('26-03-2023',2 ,1,5  ,0,1),
        ('24-03-2023',7 ,1,5  ,0,1),
        # Id 8 (8,4),(8,5),(8,6)
        ('20-03-2023',4 ,2,0.5,1,1),
        ('21-03-2023',4 ,2,2  ,0,1),
        ('26-03-2023',5 ,2,10 ,0,0),
        ('22-03-2023',6 ,2,3  ,1,1),
        ('23-03-2023',6 ,2,1  ,0,1),
        # Id 9 (9,4),(9,5),(9,6)
        ('20-03-2023',4 ,1,0.5,0,0),
        ('23-03-2023',5 ,1,1  ,0,0),
        ('24-03-2023',5 ,1,5  ,0,0),
        ('26-03-2023',5 ,1,10 ,0,0),
        ('22-03-2023',6 ,1,3  ,0,0),
        # Id 10 (10,4),(10,5),(10,6)
        ('20-03-2023',4 ,2,0.5,0,0),
        ('24-03-2023',4 ,2,2  ,0,0),
        ('23-03-2023',5 ,2,1  ,0,0),
        ('24-03-2023',6 ,2,3  ,0,1),
        ('23-03-2023',6 ,2,1  ,1,1),
        ('24-03-2023',6 ,2,5  ,1,1);