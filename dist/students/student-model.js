"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const studentSchema = new mongoose.Schema({
    uniqueID: String,
    displayName: String,
    email: String,
    course: String
}, { timestamps: true });
const studentModel = mongoose.model('student', studentSchema, 'student');
exports.default = studentModel;
//# sourceMappingURL=student-model.js.map