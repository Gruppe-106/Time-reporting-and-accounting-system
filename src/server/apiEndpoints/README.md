# Api Data Endpoints
## Projects : /project/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
Optional:
    var=id,superProject,name,startDate,endDate
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        superProject?: number,
        name?: string,
        startDate?: number,
        endDate?: number
      }
  ]
```

### Example
[http://localhost:8080/api/project/get?ids=1&var=id,name,startDate](http://localhost:8080/api/project/get?ids=1&var=id,name,startDate)
#### Returns:
```json
[{"id":1,"name":"Project Alpha","startDate":1679270400}]
```

### Table
```
CREATE TABLE PROJECTS (
    id INT UNSIGNED 
    superProject INT UNSIGNED 
    name CHAR(50)
    startDate datetime
    endDate datetime
    PRIMARY KEY(id, superProject)
)
```

## Users : /user/get
### Params
```
Required:
    ids=number | number,number,... | *
    or
    emails=string | string,string,... | *
    * will return all projects
Optional:
    var=id,email,firstName,lastName,group
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        email?: string,
        firstName?: string,
        lastName?: string,
        group?: number
      }
  ]
```

### Example
[http://localhost:8080/api/user/get?ids=1,5,7&var=group,firstName](http://localhost:8080/api/user/get?ids=1,5,7&var=group,firstName)
#### Returns:
```json
[{"group":1,"firstName":"Sam"},{"group":5,"firstName":"Sarah"},{"group":7,"firstName":"Alex"}]
```
### Table
```
CREATE TABLE USERS(
    id INT UNSIGNED 
    email CHAR(50)
    firstName CHAR(20)
    lastName CHAR(20)
    group INT UNSIGNED 
    PRIMARY KEY(id, email)
)
```

## Tasks : /task/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
Optional:
    var=id,name,startDate,endDate,timeType
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        name?: string,
        startDate?: number,
        endDate?: number,
        timeType?: number
      }
  ]
```

### Example
[http://localhost:8080/api/task/get?ids=1,5,7&var=id,name,timeType](http://localhost:8080/api/task/get?ids=1,5,7&var=id,name,timeType)
#### Returns:
```json
[{"id":1,"name":"Task X"},{"id":5,"name":"Task B"},{"id":7,"name":"Task D"}]
```
### Table
```
CREATE TABLE TASK(
    id INT UNSIGNED 
    name CHAR(50)
    startDate datetime
    endDate datetime
    timeType INT UNSIGNED 
    PRIMARY KEY(id)
)
```

## Time-type : /timetype/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
Optional:
    var=id,name
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        name?: string,
      }
  ]
```

### Example
[http://localhost:8080/api/timetype/get?ids=*](http://localhost:8080/api/timetype/get?ids=*)
#### Returns:
```json
[{"id":0,"name":"billable"},{"id":1,"name":"non-billable"},{"id":2,"name":"sick"},{"id":3,"name":"vacation"}]
```
### Table
```
CREATE TABLE TIMETYPE(
    id INT UNSIGNED 
    name CHAR(20)
    PRIMARY KEY(id)
)
```

## Role : /role/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
Optional:
    var=id,name
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        name?: string,
      }
  ]
```

### Example
[http://localhost:8080/api/role/get?ids=*](http://localhost:8080/api/role/get?ids=*)
#### Returns:
```json
[{"id":0,"name":"normal"},{"id":1,"name":"manager"},{"id":2,"name":"project-leader"},{"id":3,"name":"admin"}]
```
### Table
```
CREATE TABLE ROLES(
    id INT UNSIGNED 
    name CHAR(20)
    PRIMARY KEY(id)
)
```
# Api Connector Endpoints
## User role : /role/user/get
### Params
```
Required:
    user=number | number,number,... | *
    or
    role=number | number,number,... | *
    * will return all projects
Optional:
    var=roleId,roleName,userId,firstName,lastName
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        userId?: number,
        firstName?: string,
        lastName?: string,
        roleId?: number,
        roleName?: string
      }
  ]
```

### Example
[http://localhost:8080/api/role/user/get?user=1,2&var=roleName,roleId](http://localhost:8080/api/role/user/get?user=1,2&var=roleName,roleId)
#### Returns:
```json
[{"roleName":"project-leader","roleId":2},{"roleName":"project-leader","roleId":2}]
```
### Table
```
CREATE TABLE USER_ROLES_CONNECTOR(
    role INT UNSIGNED 
    user INT UNSIGNED 
    PRIMARY KEY(id, user)
)
```

## Group manager : /group/manager/get
### Params
```
Required:
    manager=number | number,number,... | *
    or
    group=number | number,number,... | *
    * will return all projects
Optional:
    var=manager,group,firstName,lastName,employees
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
    {
        manager?: number,
        firstName?: string,
        lastName?: string,
        group?: number,
        employees?: {
            id?: number,
            firstName?: string,
            lastName?: string,
            email?: string
        }[];
    }
  ]
```

### Example
[http://localhost:8080/api/group/manager/get?manager=7&var=manager,group,employees](http://localhost:8080/api/group/manager/get?manager=7&var=manager,group,employees)
#### Returns:
```json
[
  {"manager":7,"group":1,"employees":[
      {"id":1,"firstName":"Sam","lastName":"Smith","email":"Smith"},
      {"id":2,"firstName":"Joe","lastName":"Smith","email":"Smith"},
      {"id":3,"firstName":"Jane","lastName":"Doe","email":"Doe"}
    ]
  }
]
```
### Table
```
CREATE TABLE GROUP(
    manager INT UNSIGNED 
    group INT UNSIGNED 
    PRIMARY KEY(id, user)
)
```

## Time task register : /time/register/get
### Params
```
Required:
    user=number | number,number,...
Optional:
    var=taskId,taskName,projectName,projectId,date,userId,time,approved,managerLogged
    Can be any and/or all
```
### Structure Of Object Returned

```
[
    {
        taskId?: number,
        taskName?: string,
        projectName?: string,
        projectId?: number
        date?: number,
        userId?: number,
        time?: number,
        approved?: boolean,
        managerLogged?: boolean
    }
] 
```

### Example
[http://localhost:8080/api/time/register/get?user=1&var=taskName,taskId,projectName](http://localhost:8080/api/time/register/get?user=1&var=taskName,taskId,projectName)
#### Returns:
```json
[
  {"taskName":"Task G","taskId":10,"projectName":"Project Epsilon","userId":1,"approved":false},
  {"taskName":"Task Y","taskId":2,"projectName":"Project Beta","userId":1,"approved":true},
  {"taskName":"Task Z","taskId":3,"projectName":"Project Gamma","userId":1,"approved":true}
]
```
### Table
```
CREATE TABLE TASK_PROJECTS_CONNECTOR(
    date date
    taskId INT UNSIGNED
    userId INT UNSIGNED
    time INT UNSIGNED
    approved BOOLEAN
    managerLogged BOOLEAN
    PRIMARY KEY(date, taskId, userId)
)
```

## Task project : /task/project/get
### Params
```
Required:
    project = number | number,number,... 
    or
    task =number | number,number,...
Optional:
    var=taskId,taskName,projectId,projectName
    Can be any and/or all
```
### Structure Of Object Returned

```
[
    {
        taskId?: number,
        taskName?: string,
        projectId?: number,
        projectName?: string,
    }
] 
```

### Example
[http://localhost:8080/api/task/project/get?project=1&var=projectName,taskName](http://localhost:8080/api/task/project/get?project=1&var=projectName,taskName)
#### Returns:
```json
[{"projectName":"Project Alpha","taskName":"Task X"},{"projectName":"Project Alpha","taskName":"Task C"}]
```
### Table
```
CREATE TABLE USER_TASK_TIME_REGISTER(
    taskId INT UNSIGNED
    projectId INT UNSIGNED
    PRIMARY KEY(taskId, projectId)
)
```

# Non callable tables
## Auth : NULL
This is not available for through api for obvious reasons!
### Table
```
CREATE TABLE AUTH(
    email CHAR(50)
    authKey CHAR(50)
    authKeyEndDate datetime
    userId INT UNSIGNED 
    password CHAR(32)
    PRIMARY KEY(email, auth_key)
)
```

# Todo
1. Projects manager connector
2. Get name of timetype in tasks
3. Time as a number not string
