"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const notes_model_1 = require("./notes-model");
class MeetingNoteController {
    constructor() {
        this.path = '/notes';
        this.router = express.Router();
        this.meetingNotes = [
            {
                title: 'Nothing special',
                todoList: [
                    { task: 'Task1', completed: false },
                    { task: 'Task2', completed: true }
                ],
                notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                created: new Date().toISOString()
            },
            {
                title: 'Nothing special2',
                todoList: [
                    { task: 'Task1', completed: true },
                    { task: 'Task2', completed: true }
                ],
                notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                created: new Date().toISOString()
            },
            {
                title: 'Nothing special 3',
                todoList: [
                    { task: 'Task1', completed: false },
                    { task: 'Task2', completed: true }
                ],
                notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
                created: new Date().toISOString()
            }
        ];
        this.studentNotes = [
            {
                student: { displayName: 'Student 1', uniqueID: 'dw' },
                meetingNotes: this.meetingNotes
            }
        ];
        this.getAllStudentNotes = (request, response) => {
            notes_model_1.default.find().then((studentNotes) => {
                response.send(studentNotes);
            });
        };
        this.createNoteForStudent = (request, response) => {
            const sn = request.body;
            const index = this.studentNotes.findIndex(notes => notes.student.uniqueID === sn.student.uniqueID);
            if (index > 0) {
                this.studentNotes[index].meetingNotes = sn.meetingNotes;
            }
            else {
                this.studentNotes.push(sn);
            }
            const createdNote = new notes_model_1.default(sn);
            createdNote.save().then(savedNote => {
                response.send(savedNote);
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllStudentNotes.bind(this));
        this.router.post(this.path, this.createNoteForStudent);
        this.router.post(this.path + '/:id', this.addNewNote);
        this.router.get(this.path + '/:id', this.getStudentNotesByID);
    }
    addNewNote(request, response) {
        let student = request.body;
        //  .findOneAndUpdate(
        //   { 'supervisor.uniqueID': supervisionRequest.supervisor.uniqueID },
        //   { $push: { students: supervisionRequest.student } },
        //   { new: true }
        // )
        notes_model_1.default
            .findOneAndUpdate({ uniqueID: student.uniqueID }, {
            $push: {
                'meetingNotes.todoList': { task: 'Another One', completed: false }
            }
        }, { new: true })
            .then(student => {
            response.send(student);
        });
    }
    getStudentNotesByID(request, response) {
        const id = request.params.id;
        notes_model_1.default.find({ student: { uniqueID: id } }).then(studentNote => {
            response.send(studentNote);
        });
    }
    removeStudentNoteByID(request, response) {
        const id = request.params.id;
    }
}
exports.default = MeetingNoteController;
//# sourceMappingURL=notes-controller.js.map