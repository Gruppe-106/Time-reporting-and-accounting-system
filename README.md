# Time-reporting-and-accounting-system
Project by **CS-23-DAT-01**

# Plan
## Frontend
1. No authKey provided sent user to Login page
   1. Use cookies to make it persistent
2. Change navbar to dynamically change based on authorisation
3. Front page - \[{(Simon)}\]
   1. Display username
   2. List of main project and task the user is part of
4. Register time - \[{(Christian)}\]
   1. Table of current week
   2. Allow user to add rows dynamically
   3. Load all previously entered data
5. Group Manager - \[{(Mads)}\]
   1. Only allow managers to access page
   2. Show all employees tied to that manager
   3. Click employee to show timesheet aka Time Approval
6. Time approval deletus
7. Data export
   1. Basic version button that generates monthly report and allows the user to download it as csv
8. Create user - \[{(Andreas)}\]
   1. Form for creating user and save(POST to server)
9. Login
   1. Make functioned and remove navbar
10. Admin panel
    1. Create user
    2. Group manager
    3. Role assigner
11. Project creator - \[{(Alexander)}\]
    1. Require project leader role
    2. Form for creating a project
12. Manage project
    1. Edit project and assign/add task to users

## Backend
1. MySql
   1. For now send dummy
2. API  - \[{(Mikkel)}\]

# First time setup for development
## Setup Node:
### Open terminal in '../src'
```bash
  npm install
```
## Setup React:
### 1. Open terminal in '../src/client' 
```bash
npm install
```

### 3. Run configurations
Config files are located, these should load automatically:
1. VSCode are in .vscode.
2. WebStorms are in .idea.

# Code style
## Function/Method case
**P**ascal**Case** & methods should always have private or publice
## Class Case
**F**irst letter uppercase
## Variable/params/Member case
camel**C**ase
## Interfaces
**F**irst letter uppercase & must have types like: hasTime:number (can be optional hasTime?:number)

# Code Rules
## Comments on function
Always explain function in a comment, use /** (Enter) (Above function)
## Big nested loops
Give identifiers to the different loops, for better readibility
## Type
Give everything a class if possible
## Github push/pull requests
