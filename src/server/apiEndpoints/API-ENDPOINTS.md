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
returns: [{"id":1,"name":"Project Alpha"}]
```