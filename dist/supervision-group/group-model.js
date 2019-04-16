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
    ],
    timeslots: [
        {
            startTime: String,
            endTime: String,
            day: String,
            bookedBy: { uniqueID: String, displayName: String }
        }
    ],
    meetingPeriod: { start: Date, end: Date, location: String }
}, { timestamps: true });
const groupModel = mongoose.model('supervision-group', supervisionModel, 'supervision-group');
exports.default = groupModel;
//# sourceMappingURL=group-model.js.map