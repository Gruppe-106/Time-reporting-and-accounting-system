# Time-reporting-and-accounting-system
Project by **CS-23-DAT-2-01**
# About
This project is the second semester project for the group **CS-23-DAT-2-01**
## How to access site
To access the site you must either be connected to Aalborg university's internet or connected to the Aalborg university's VPN service https://www.en.its.aau.dk/instructions/vpn. 
When this is done first go to the site https://10.92.1.237:8080 to allow the API to work, notice that your browser will give a warning. This is because the SSL certificate is self-signed. Ignore the warning and enter the site. Now the normal site can be visited on https://10.92.1.237/, here you will encounter a login page, below can be seen some different logins with different roles.

# !! Update this when final data is uploaded !!

**Admin**:

email: matt@example.com

password: matt

**Manager**:

email: jane@example.com

password: jane

# Server commands
Start Node WebServer
```
pm2 start app.js --watch && pm2 monit app
```

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
