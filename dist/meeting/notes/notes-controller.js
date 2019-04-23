"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const notes_model_1 = require("./notes-model");
class MeetingNoteController {
    constructor() {
        this.path = '/notes';
        this.router = express.Router();
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path + '/new/:id', this.addNewNote);
        this.router.get(this.path + '/:id', this.getStudentNotesByID);
        this.router.get(this.path + '/:id/:createdDate', this.getOneStudentNoteByDate);
        this.router.put(this.path + '/edit/:id', this.updateStudentNotesByDate);
        this.router.delete(this.path + '/:id/:createdDate', this.deleteStudentNoteByDate);
    }
    addNewNote(request, response) {
        let note = request.body;
        let _id = request.params.id;
        console.log(note.toDoList);
        notes_model_1.default
            .findOneAndUpdate({
            'student.uniqueID': _id
        }, { $set: { student: { uniqueID: _id } }, $push: { meetingNotes: note } }, { upsert: true, new: true })
            .then(data => {
            console.log(data);
            response.send(data);
        });
    }
    createNewStudentNoteCollection(request, response) {
        const _id = request.params.id;
        this.createNewStudentEntry(_id).then(res => {
            response.status(200).send({ message: 'Successfully added student entry', return: res });
        });
    }
    createNewStudentEntry(_id) {
        return notes_model_1.default.create({
            student: { uniqueID: _id },
            meetingNotes: []
        });
    }
    getStudentNotesByID(request, response) {
        const id = request.params.id;
        notes_model_1.default.findOne({ 'student.uniqueID': id }).then(studentNote => {
            if (studentNote) {
                response.status(200).send(studentNote.meetingNotes);
            }
            else {
                response.send([]);
            }
        });
    }
    getOneStudentNoteByDate(request, response) {
        const id = request.params.id;
        const created = request.params.createdDate;
        notes_model_1.default
            .findOne({ 'student.uniqueID': id, 'meetingNotes.created': created })
            .then(studentNote => {
            if (studentNote) {
                let studentNoteResult = studentNote.meetingNotes.find(meetingNote => meetingNote.created == created);
                response.status(200).send(studentNoteResult);
            }
            else {
                response.status(404).send({ message: 'Student Note not found ' });
            }
        });
    }
    updateStudentNotesByDate(request, response) {
        const id = request.params.id;
        const note = request.body;
        notes_model_1.default
            .findOneAndUpdate({
            $and: [{ 'student.uniqueID': id, 'meetingNotes.created': note.created }]
        }, { $set: { 'meetingNotes.$': note } }, { new: true })
            .then(studentNote => {
            response.status(200).send(studentNote);
        }, (_error) => {
            response.status(400).send({ message: 'Unable to update student', error: _error });
        });
    }
    deleteStudentNoteByDate(request, response) {
        const id = request.params.id;
        const createdDate = request.params.createdDate;
        notes_model_1.default
            .findOneAndUpdate({
            'student.uniqueID': id
        }, { $pull: { meetingNotes: { created: createdDate } } }, { new: true })
            .then(newNote => {
            response.status(200).send({
                message: `Successfully removed note : ${createdDate}`,
                new: newNote
            });
        });
    }
}
exports.default = MeetingNoteController;
//# sourceMappingURL=notes-controller.js.map