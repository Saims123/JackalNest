"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
class App {
    constructor(controllers, port) {
        this.app = express();
        this.port = port;
        this.initializeMiddlewares();
        this.initiateCORS();
        this.initializeControllers(controllers);
        this.connectToMongoDB();
    }
    initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(loggerMiddleware);
    }
    initializeControllers(controllers) {
        controllers.forEach(controller => {
            this.app.use('/', controller.router);
        });
    }
    initiateCORS() {
        this.app.use(cors());
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`JackaNest listening on the port ${this.port}`);
        });
    }
    connectToMongoDB() {
        mongoose
            .connect('mongodb+srv://jackal:Jackaltrackbase@jackalcluster0-1stlt.mongodb.net/JackalBase', {
            useNewUrlParser: true
        })
            .then(() => {
            console.log('SUCCESSFULLY CONNECT TO MONGO-ATLAS');
        }, err => {
            console.error(err, 'Failed to connect to MongoDB-ATLAS');
        });
    }
}
function loggerMiddleware(request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
}
exports.default = App;
//# sourceMappingURL=app.js.map