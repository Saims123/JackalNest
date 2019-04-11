"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const notes_controller_1 = require("./meeting/notes-controller");
const student_controller_1 = require("./students/student-controller");
const group_controller_1 = require("./supervision-group/group-controller");
const app = new app_1.default([
    new notes_controller_1.default(),
    new student_controller_1.default(),
    new group_controller_1.default()
], 40030);
app.listen();
//# sourceMappingURL=server.js.map