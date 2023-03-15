# Api Endpoints
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
```
http://localhost:8080/api/project/get?ids=1&var=id,name
```
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
```
http://localhost:8080/api/user/get?ids=1,5,7&var=group,first_name
```
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