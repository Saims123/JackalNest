"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
class InitiateController {
    constructor() {
        this.path = '/';
        this.router = express.Router();
        this.onInit = async (request, response) => {
            response.status(200).send("Successfully connected to JackalNest");
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(`${this.path}`, this.onInit);
    }
}
exports.default = InitiateController;
//# sourceMappingURL=initiate-controller.js.map