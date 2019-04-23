"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const notes_controller_1 = require("./meeting/notes/notes-controller");
const group_controller_1 = require("./supervision-group/group-controller");
const initiate_controller_1 = require("./initiate/initiate-controller");
const timeslots_controller_1 = require("./meeting/timeslots/timeslots-controller");
const app = new app_1.default([
    new initiate_controller_1.default(),
    new notes_controller_1.default(),
    new group_controller_1.default(),
    new timeslots_controller_1.default()
], 40030);
app.listen();
//# sourceMappingURL=server.js.map