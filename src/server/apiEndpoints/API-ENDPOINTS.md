# Api Data Endpoints
## Projects : /project/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
Optional:
    val=id,super_project,name,start_date,end_date
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        super_project?: number,
        name?: string,
        start_date?: string,
        end_date?: string
      }
  ]
```

### Example
[http://localhost:8080/api/project/get?ids=1&var=id,name](http://localhost:8080/api/project/get?ids=1&var=id,name)
#### Returns:
```json
[{"id":1,"name":"Project Alpha"}]
```

### Table
```
CREATE TABLE PROJECTS (
    id INT UNSIGNED 
    super_project INT UNSIGNED 
    name CHAR(50)
    start_date datetime
    end_date datetime
    PRIMARY KEY(id, super_project)
)
```

## Users : /user/get
### Params
```
Required:
    ids=number | number,number,... | *
    emails=string | string,string,... | *
    * will return all projects
Optional:
    val=id,email,first_name,last_name,group
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        email?: string,
        first_name?: string,
        last_name?: string,
        group?: number
      }
  ]
```

### Example
[http://localhost:8080/api/user/get?ids=1,5,7&var=group,first_name](http://localhost:8080/api/user/get?ids=1,5,7&var=group,first_name)
#### Returns:
```json
[{"group":1,"first_name":"Sam"},{"group":5,"first_name":"Sarah"},{"group":7,"first_name":"Alex"}]
```
### Table
```
CREATE TABLE USERS(
    id INT UNSIGNED 
    email CHAR(50)
    first_name CHAR(20)
    last_name CHAR(20)
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
    val=id,name,start_date,end_date,time_type
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        id?: number,
        name?: string,
        start_date?: string,
        end_date?: string,
        time_type?: number
      }
  ]
```

### Example
[http://localhost:8080/api/task/get?ids=1,5,7&var=id,name,time_type](http://localhost:8080/api/task/get?ids=1,5,7&var=id,name,time_type)
#### Returns:
```json
[{"id":1,"name":"Task X"},{"id":5,"name":"Task B"},{"id":7,"name":"Task D"}]
```
### Table
```
CREATE TABLE TASK(
    id INT UNSIGNED 
    name CHAR(50)
    start_date datetime
    end_date datetime
    time_type INT UNSIGNED 
    PRIMARY KEY(id)
)
```

## Time-type : /timetype/get
### Params
```
Required:
    ids=number | number,number,... | *
    * will return all projects
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
    user_ids=number | number,number,... | *
    * will return all projects
Optional:
    val=role_id,role_name,user_id
    Can be any and/or all
```
### Structure Of Object Returned

```
  [
      {
        user_id?: number,
        role_id?: number,
        role_name?: string
      }
  ]
```

### Example
[http://localhost:8080/api/role/user/get?user_ids=1,2&var=role_name,role_id](http://localhost:8080/api/role/user/get?user_ids=1,2&var=role_name,role_id)
#### Returns:
```json
[{"role_name":"project-leader","role_id":2},{"role_name":"project-leader","role_id":2}]
```
### Table
```
CREATE TABLE USER_ROLES_CONNECTOR(
    role INT UNSIGNED 
    user INT UNSIGNED 
    PRIMARY KEY(id, user)
)
```

# Non callable tables
## Auth : NULL
This is not available for through api for obvious reasons!
### Table
```
CREATE TABLE AUTH(
    email CHAR(50)
    auth_key CHAR(50)
    auth_key_end_date datetime
    user_id INT UNSIGNED 
    password CHAR(32)
    PRIMARY KEY(email, auth_key)
)
```