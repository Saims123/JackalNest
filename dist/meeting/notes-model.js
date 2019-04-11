"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const meetingNotesSchema = new mongoose.Schema({
    student: { uniqueID: String },
    meetingNotes: [
        {
            title: String,
            created: String,
            todoList: [{ task: String, completed: Boolean }],
            notes: String
        }
    ]
});
const notesModel = mongoose.model('notes', meetingNotesSchema, 'notes');
exports.default = notesModel;
//# sourceMappingURL=notes-model.js.map