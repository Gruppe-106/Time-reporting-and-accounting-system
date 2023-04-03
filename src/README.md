# Api Endpoints
# Project
<details>
<summary>Get</summary>

## /api/project/get
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
  {
  status: number,
  data:
      {
        id?           : number,
        superProject? : number,
        name?         : string,
        startDate?    : number,
        endDate?      : number
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [{"id":1,"name":"Project Alpha","startDate":1679270400}]
}
```
</details>

<details>
<summary>Create</summary>

## /api/project/creation/post
### Body
```
{
    superProjectId?: number,
    name           : string,
    startDate      : number,
    endDate        : number,
    projectLeader  : number,
    task?: {
        name       : string,
        userId     : number[],
        startDate  : number,
        endDate    : number,
        timeType   : number
    }[]
}
```
### Structure Of Object Returned
```
    {
        status: number,
        data: {
            success? : boolean, 
            error?   : string, 
            message? : string[], 
            reason?  : string[]
        }
    }
```
### Example return:

```json
{
  "success": true,
  "data": {
    "success": "true", 
    "message": ["success"]
  }
}
```
</details>

<details>
<summary>Edit ( Not Implemented )</summary>

## /api/project/edit/put
### Body
```
{
}
```
### Structure Of Object Returned
```
    {
        status: number,
        data: {
            success? : boolean, 
            error?   : string, 
            message? : string[], 
            reason?  : string[]
        }
    }
```
### Example return:

```json
{
  "success": true,
  "data": {
    "success": "true", 
    "message": ["success"]
  }
}
```
</details>

# Task

<details>
<summary>Get</summary>

## /api/task/get
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
  {
  status: number,
  data:
      {
        id?: number,
        name?: string,
        startDate?: number,
        endDate?: number,
        timeType?: number
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"id":1,"name":"Task X"},
    {"id":5,"name":"Task B"},
    {"id":7,"name":"Task D"}
  ]
}
```
</details>

# Project Task

<details>
<summary>Get</summary>

## /api/task/project/get
```
Required:
    project = number | number,number,... 
    or
    task = number | number,number,...
Optional:
    var=taskId,taskName,projectId,projectName
    Can be any and/or all
```
### Structure Of Object Returned

```
  {
  status: number,
  data:
    {
      taskId?: number,
      taskName?: string,
      projectId?: number,
      projectName?: string,
    }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"projectName":"Project Alpha","taskName":"Task X"},
    {"projectName":"Project Alpha","taskName":"Task C"}
  ]
}
```
</details>

# User
<details>
<summary>Get</summary>

## /api/user/get
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
  {
  status: number,
  data:
      {
        id?        : number,
        email?     : string,
        firstName? : string,
        lastName?  : string,
        group?     : number
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [{"group":1,"firstName":"Sam"},{"group":5,"firstName":"Sarah"},{"group":7,"firstName":"Alex"}]
}
```
</details>

<details>
<summary>Create</summary>

## /api/user/creation/post
### Body
```
{
    firstName   : string,
    lastName    : string,
    email       : string,
    password    : string,
    manager     : number,
    roles       : number[]
}
```
### Structure Of Object Returned
```
    {
        status: number,
        data: {
            success? : boolean, 
            error?   : string, 
            message? : string[], 
            reason?  : string[]
        }
    }
```
### Example return:

```json
{
  "success": true,
  "data": {
    "success": "true", 
    "message": ["success"]
  }
}
```
</details>

<details>
<summary>Edit</summary>

## /api/user/edit/put
### Body
```
{
    userId       : number,
    firstName   ?: string,
    lastName    ?: string,
    email       ?: string,
    password    ?: string,
    manager     ?: number,
    rolesAdd    ?: number[],
    rolesRemove ?: number[]
}
```
### Structure Of Object Returned
```
    {
        status: number,
        data: {
            success? : boolean, 
            error?   : string, 
            message? : string[], 
            reason?  : string[]
        }
    }
```
### Example return:

```json
{
  "success": true,
  "data": {
    "success": "true", 
    "message": ["success"]
  }
}
```
</details>

# Manager Group

<details>
<summary>Get</summary>

## /api/group/manager/get
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
  {
  status: number,
  data:
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
        }[]
    }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {
      "manager":7,"group":1,"employees": [
          {"id":1,"firstName":"Sam","lastName":"Smith","email":"Smith"},
          {"id":2,"firstName":"Joe","lastName":"Smith","email":"Smith"},
          {"id":3,"firstName":"Jane","lastName":"Doe","email":"Doe"}
      ]
    }
  ]
}
```
</details>

# Role

<details>
<summary>Get</summary>

## /api/role/get
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
  {
  status: number,
  data:
      {
        id?: number,
        name?: string,
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"id":0,"name":"normal"},
    {"id":1,"name":"manager"},
    {"id":2,"name":"project-leader"},
    {"id":3,"name":"admin"}
  ]
}
```
</details>

# User Role

<details>
<summary>Get</summary>

## /api/role/user/get
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
  {
  status: number,
  data:
      {
        userId?: number,
        firstName?: string,
        lastName?: string,
        roleId?: number,
        roleName?: string
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"roleName":"project-leader","roleId":2},
    {"roleName":"project-leader","roleId":2}
  ]
}
```
</details>

# Timetype

<details>
<summary>Get</summary>

## /api/timetype/get
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
  {
  status: number,
  data:
      {
        id?: number,
        name?: string,
      }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"id":0,"name":"billable"},
    {"id":1,"name":"non-billable"},
    {"id":2,"name":"sick"},
    {"id":3,"name":"vacation"}
  ]
}
```
</details>

# Time task register

<details>
<summary>Get</summary>

## /api/timetype/get
```
Required:
    user=number | number,number,...
Optional:
    var=taskId,taskName,projectName,projectId,date,userId,time,approved,managerLogged
    Can be any and/or all
```
### Structure Of Object Returned

```
  {
  status: number,
  data:
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
    }[]
  }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"taskName":"Task G","taskId":10,"projectName":"Project Epsilon","userId":1,"approved":false},
    {"taskName":"Task Y","taskId":2,"projectName":"Project Beta","userId":1,"approved":true},
    {"taskName":"Task Z","taskId":3,"projectName":"Project Gamma","userId":1,"approved":true}
  ]
}
```
</details>

# Login

<details>
<summary>Post</summary>

## /api/login
### Body
```
{
    email    : string,
    password : string
}
```
### Structure Of Object Returned
#### Success
```
  {
  status: status,
  data: {
        success: boolean,
        message: string[
            "success", 
            authKey, 
            validTo
        ] 
        OR
        [
            ( what failed )
        ]
     }
  }
```
### Example return:

```json
{
  "success": true,
  "data": {
    "success": true,
    "message": [
      "success",
      "12jk3lk1j3li12j31lk23jlk12j312al3a",
      "102931001000"
    ]
  }
}
```
</details>

# Auth

<details>
<summary>Authenticate</summary>

## /api/auth
!! This api endpoint should only be used for page authentication !!
### Structure Of Object Returned
#### Success
```
  {
  status: 200,
  data: {
        success: boolean,
        userId: number,
        userRoles: {
            roleId: number 
        }[]
     }
  }
```
#### Failed
```
    {
        status: 404, 
        data: {
            success: false
        }
    }
```
### Example return:

```json
{
  "success": true,
  "data": [
    {"id":0,"name":"normal"},
    {"id":1,"name":"manager"},
    {"id":2,"name":"project-leader"},
    {"id":3,"name":"admin"}
  ]
}
```
</details>