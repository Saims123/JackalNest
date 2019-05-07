# JackalNest
Express server written in typescript to manage API and CRUD operations for JackalTrack


## Initial Setup
Install all the node_modules for the project
```bash 
npm i
```
Critical packages needed: 
1. mongoose
2. express
3. cors
4. ts-node
## Run server locally
As the project itself are written in Typescript and not JavaScript for code readability and maintainability reasons. It must be complied down to Javascript format before it can be executed by Node.js. 
```bash
npm run dev
```

## Production Build 
The project as a whole needs to be compiled down back to Javascript before it is deployed to production environment. For that, the project needs typescipt complier package called 'tsc' which converts all typescript files down to javascript, and will be transferred to ./dist folder.

To build, run
```bash
npm run build
```

## Run on Remote BU-EDAM servers
Once the compiled code are ready in ./dist folder. Access the account via FileZilla. Then : 
1. Copy and paste the entire content of ./dist into the ./node folder on the EDAM server
2. Access the server via PuTTY using `edam.bournemouth.uk` and port `2223`
3. Login into the server under the user `i7467177`
4. Start the node server by running the command 
    ```bash
    nvm use 11.9.0

    node ./node/server.js > stdout.txt 2> stderr.txt &
    ```
5. When it's running successfully, exit PuTTY using the `exit` command, as forcefully closing the window will cause the server to be shutdown as well

6. Test the server by navigating on the browser `https://i746717.bucomputing.uk/node`

