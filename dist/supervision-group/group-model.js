"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const supervisionModel = new mongoose.Schema({
    supervisor: {
        uniqueID: String,
        displayName: String,
        email: String,
        location: String
    },
    students: [
        { uniqueID: String, displayName: String, email: String, course: String }
    ]
}, { timestamps: true });
const groupModel = mongoose.model('supervision-group', supervisionModel, 'supervision-group');
exports.default = groupModel;
//# sourceMappingURL=group-model.js.map