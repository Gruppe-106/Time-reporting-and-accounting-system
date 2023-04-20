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
    (0,'Project Alpha','2023-03-20','2023-04-22'),   # 1
    (1,'Project Beta','2023-03-22','2023-05-23'),    # 2
    (2,'Project Gamma','2023-03-23','2023-04-23'),   # 3
    (2,'Project Delta','2023-03-25','2023-05-26'),   # 4
    (0,'Project Epsilon','2023-03-20','2023-04-26'), # 5
    (0,'Project Epsilon','2023-03-20','2023-04-26'); # 6

# ----------------------------------------------
# ------------------- Tasks --------------------
# ----------------------------------------------
INSERT IGNORE INTO TASKS
(name, startDate, endDate, timeType)
VALUES
    ('Task X','2023-03-20','2023-04-26',1), # 1
    ('Task Y','2023-03-23','2023-05-26',1), # 2
    ('Task Z','2023-03-20','2023-04-26',1), # 3
    ('Task A','2023-03-20','2023-05-23',2), # 4
    ('Task B','2023-03-23','2023-05-26',1), # 5
    ('Task C','2023-03-25','2023-05-26',2), # 6
    ('Task D','2023-03-23','2023-04-23',1), # 7
    ('Task E','2023-03-20','2023-04-22',2), # 8
    ('Task F','2023-03-23','2023-04-22',1), # 9
    ('Task G','2023-03-20','2023-04-26',2), # 10
    ('Task G','2023-03-20','2023-04-26',2), # 11
    ('Task G','2023-03-20','2023-04-26',2); # 12

# ----------------------------------------------
# ---------- Tasks/Projects connector ----------
# ----------------------------------------------
INSERT IGNORE INTO TASKS_PROJECTS_CONNECTOR
(taskId, projectId)
VALUES
    (1,1),
    (2,2),
    (3,3),
    (4,4),
    (5,6),
    (6,1),
    (7,2),
    (8,3),
    (9,4),
    (10,6),
    (11,6),
    (12,6);

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

UPDATE GROUPS_CONNECTOR
SET managerId=4
WHERE groupId=1;

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
    ('sarah@example.com','Sarah','Doe',2),   # Sarah Doe    user 8
    ('alex@example.com','Alex','Johnson',3); # Alex Johnson user 9

INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (3,9),  # Sarah Doe    user 8
    (3,10); # Alex Johnson user 9

INSERT IGNORE INTO PROJECTS_MANAGER_CONNECTOR
(userId, projectId)
VALUES
    (9,1),(9,2),(9,3),(10,4),(8,5),(8,6);

# --------------- Admin ---------------
# Update the default admin to different values
UPDATE USERS
SET email='matt@example.com',firstName='Matt',lastName='Brown',groupId=2
WHERE id=1;

# Tom Jones user 4
INSERT IGNORE INTO USERS
(email,firstName,lastName,groupId)
VALUES
    ('sam@example.com','Sam','Smith',2); # Sam Smith user 10

INSERT IGNORE INTO USERS_ROLES_CONNECTOR
(roleId,userID)
VALUES
    (2, 10);

INSERT IGNORE INTO GROUPS_CONNECTOR
(managerId, groupId)
values
    (10, 4); # Sam Smith user 10

# --------------- Auth ---------------
INSERT IGNORE INTO  AUTH
(email, authKey, authKeyEndDate, userId, password)
VALUES
    ('joe@example.com','2481f36dfc515ca76451aaadf1399026942a01ee50c6d0a61988b43cef039bc2','2023-12-30',2,'78675cc176081372c43abab3ea9fb70c74381eb02dc6e93fb6d44d161da6eeb3'), # Joe Smith user 2
    ('jane@example.com','8c87b489ce35cf2e2f39f80e282cb2e804932a56a213983eeeb428407d43b52d','2023-12-30',3,'81f8f6dde88365f3928796ec7aa53f72820b06db8664f5fe76a7eb13e24546a2'), # Jane Doe  user 3
    ('tom@example.com','72bb75a959e1785b79ffe7230eaeec25880707a91b4a4f98330fc1510bd40e03','2023-12-30',4,'e1608f75c5d7813f3d4031cb30bfb786507d98137538ff8e128a6ff74e84e643'), # Tom Jones user 4
    ('jill@example.com','127ba059404a7145b3d876abfe50a1298dd49deb60eacefc55deb9c9d8261da6','2023-12-30',5,'8cf37351b60f00084392043ce2e6256b96cea92949f90c7abce464cf164fbfa6'), # Jill Jones   user 5
    ('john@example.com','855f96e983f1f8e8be944692b6f719fd54329826cb62e98015efee8e2e071dd4','2023-12-30',6,'96d9632f363564cc3032521409cf22a852f2032eec099ed5967c0d000cec607a'), # John Adams   user 6
    ('dave@example.com','7b34211350ff567970974e1e2b98d319a601969e74fd1a957bc889b8332d00eb','2023-12-30',7,'61ea0803f8853523b777d414ace3130cd4d3f92de2cd7ff8695c337d79c2eeee'), # Dave Brown   user 7
    ('sam@example.com','cd25a6171969f2a3c6e35c7667e3908ef1bd2424241db04411a0eec454ca6c16','2023-12-30',8,'e96e02d8e47f2a7c03be5117b3ed175c52aa30fb22028cf9c96f261563577605'), # Sam Smith    user 8
    ('sarah@example.com','1b0df3084513e398249e55cd6fe2b41dda58e0d835f78c6b8d33c08909c3df9e','2023-12-30',9,'d233633d9524e84c71d6fe45eb3836f8919148e4a5fc2234cc9e6494ec0f11c2'), # Sarah Doe    user 9
    ('alex@example.com','6db61e6dcbcf2390e4a46af426f26a133a3bee45021422fc7ae86e9136f14110','2023-12-30',10,'4135aa9dc1b842a653dea846903ddb95bfb8c5a10c504a7fa16e10bc31d1fdf0'); # Alex Johnson user 10

# Matt Brown user 1
UPDATE AUTH
SET email='matt@example.com',authKey='b1edd8d44599536a1687546bee7b5ef88ea342b3352302a6322e12ecca19fb86',authKeyEndDate='2023-12-30',userId=1,password='4f31fa50e5bd5ff45684e560fc24aeee527a43739ab611c49c51098a33e2b469'
WHERE userId=1;

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
        (10,4),(10,5),(10,6),
        (1,1),(1,2),(1,3),(1,4),(1,10),(1,11),(1,12),(1,7),(1,8),(1,9),(1,5);

# Id 1 (1,10),(1,2),(1,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
    (date,taskId,userId,time,approved,managerLogged)
    VALUES
        ('2023-03-20',10,1,30,0,0),
        ('2023-03-21',10,1,180  ,0,0),
        ('2023-03-25',10,1,300  ,1,1),
        ('2023-03-23',2 ,1,150  ,0,0),
        ('2023-03-24',2 ,1,540  ,1,1),
        ('2023-03-26',2 ,1,150 ,0,1),
        ('2023-03-22',3 ,1,300  ,1,1),
        ('2023-03-23',3 ,1,150  ,1,1),
        ('2023-03-24',3 ,1,540  ,0,0),

        ('2023-03-21', 1,1 ,30,0,0),
        ('2023-03-22', 2,1 ,180 ,0,0),
        ('2023-03-26', 3,1 ,300 ,1,1),
        ('2023-03-24', 4,1 ,150 ,0,0),
        ('2023-03-24', 5,1 ,150 ,1,1),
        ('2023-03-24', 7,1 ,150 ,1,1),
        ('2023-03-25', 8,1 ,540 ,0,0),
        ('2023-03-23', 9,1 ,300 ,1,1),
        ('2023-03-25', 10,1,540 ,1,1),
        ('2023-03-27', 11,1,150 ,0,1),
        ('2023-03-23', 12,1,300 ,1,1),

        ('2023-03-22', 1,1 ,30,0,0),
        ('2023-03-23', 2,1 ,180 ,0,0),
        ('2023-03-27', 3,1 ,300 ,1,1),
        ('2023-03-25', 4,1 ,150 ,0,0),
        ('2023-03-25', 5,1 ,150 ,1,1),
        ('2023-03-25', 7,1 ,150 ,1,1),
        ('2023-03-26', 8,1 ,540 ,0,0),
        ('2023-03-24', 9,1 ,300 ,1,1),
        ('2023-03-26', 10,1,540 ,1,1),
        ('2023-03-28', 11,1,150 ,0,1),
        ('2023-03-24', 12,1,300 ,1,1),

        ('2023-03-23', 1,1 ,30,0,0),
        ('2023-03-24', 2,1 ,180 ,0,0),
        ('2023-03-28', 3,1 ,300 ,1,1),
        ('2023-03-26', 4,1 ,150 ,0,0),
        ('2023-03-26', 5,1 ,150 ,1,1),
        ('2023-03-26', 7,1 ,150 ,1,1),
        ('2023-03-27', 8,1 ,540 ,0,0),
        ('2023-03-25', 9,1 ,300 ,1,1),
        ('2023-03-27', 10,1,540 ,1,1),
        ('2023-03-29', 11,1,150 ,0,1),
        ('2023-03-25', 12,1,300 ,1,1);


# Id 2 (2,10),(2,2),(2,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
    ('2023-03-20',10,2,0.5,0,1),
    ('2023-03-25',2 ,2,1  ,0,1),
    ('2023-03-26',2 ,2,3  ,0,1),
    ('2023-03-22',3 ,2,1  ,0,1),
    ('2023-03-21',3 ,2,5  ,0,1);

# Id 3 (3,9),(3,2),(3,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-29',9 ,3,0.5,0,0),
        ('2023-04-01',9 ,3,0.5,0,0),
        ('2023-04-02',9 ,3,3  ,0,0),
        ('2023-04-03',2 ,3,5  ,0,0),
        ('2023-04-04',2 ,3,5  ,0,0),
        ('2023-03-26',2 ,3,0.5,0,0),
        ('2023-03-22',3 ,3,0.5,0,0),
        ('2023-03-23',3 ,3,1  ,1,1),
        ('2023-03-24',3 ,3,5  ,0,1);

# Id 4 (4,9),(4,2),(4,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-20',9 ,4,0.5,1,1),
        ('2023-03-21',9 ,4,2  ,1,1),
        ('2023-03-25',9 ,4,3  ,1,1),
        ('2023-03-23',2 ,4,1  ,1,1),
        ('2023-04-02',2 ,4,5  ,0,0),
        ('2023-03-26',3 ,4,1  ,0,0),
        ('2023-03-22',3 ,4,5  ,0,0);

# Id 5 (5,1),(5,8),(5,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-04-04',1 ,5,0.5,0,0),
        ('2023-03-23',8 ,5,1  ,0,1),
        ('2023-03-24',8 ,5,5  ,1,1),
        ('2023-03-26',8 ,5,10 ,1,1),
        ('2023-04-04',3 ,5,3  ,1,1),
        ('2023-03-26',3 ,5,1  ,1,1),
        ('2023-03-22',3 ,5,5  ,1,1);

# Id 6 (6,1),(6,8),(6,3)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-20',1 ,6,0.5,0,0),
        ('2023-03-21',1 ,6,2  ,0,0),
        ('2023-03-25',1 ,6,3  ,0,0),
        ('2023-03-23',8 ,6,1  ,0,0),
        ('2023-03-24',8 ,6,5  ,0,0),
        ('2023-03-26',8 ,6,10 ,0,1),
        ('2023-03-22',3 ,6,3  ,1,1),
        ('2023-03-23',3 ,6,1  ,1,1),
        ('2023-03-24',3 ,6,5  ,0,1);

# Id 7 (7,1),(7,2),(7,7)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-21',1 ,7,0.5,0,1),
        ('2023-03-25',1 ,7,2  ,0,1),
        ('2023-03-23',1 ,7,3  ,0,1),
        ('2023-03-24',2 ,7,1  ,0,1),
        ('2023-03-26',2 ,7,5  ,0,1),
        ('2023-03-24',7 ,7,5  ,0,1);

# Id 8 (8,4),(8,5),(8,6)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-20',4 ,8,0.5,1,1),
        ('2023-03-21',4 ,8,2  ,0,1),
        ('2023-03-26',5 ,8,10 ,0,0),
        ('2023-03-22',6 ,8,3  ,1,1),
        ('2023-03-23',6 ,8,1  ,0,1);

# Id 9 (9,4),(9,5),(9,6)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-20',4 ,9,0.5,0,0),
        ('2023-03-23',5 ,9,1  ,0,0),
        ('2023-03-24',5 ,9,5  ,0,0),
        ('2023-03-26',5 ,9,10 ,0,0),
        ('2023-03-22',6 ,9,3  ,0,0);

# Id 10 (10,4),(10,5),(10,6)
INSERT IGNORE INTO USERS_TASKS_TIME_REGISTER
(date,taskId,userId,time,approved,managerLogged)
VALUES
        ('2023-03-20',4 ,10,0.5,0,0),
        ('2023-03-24',4 ,10,2  ,0,0),
        ('2023-03-23',5 ,10,1  ,0,0),
        ('2023-03-24',6 ,10,3  ,0,1),
        ('2023-03-23',6 ,10,1  ,1,1),
        ('2023-03-24',6 ,10,5  ,1,1);