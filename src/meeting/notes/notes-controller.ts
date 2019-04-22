import * as express from 'express';
import { MeetingNote } from '../meeting-interfaces';
import notesModel from './notes-model';

class MeetingNoteController {
  public path = '/notes';
  public router = express.Router();
  public meetingNotes: MeetingNote[];

  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.post(this.path + '/new/:id', this.addNewNote);
    this.router.get(this.path + '/:id', this.getStudentNotesByID);
    this.router.put(this.path + '/:id', this.updateStudentNotesByDate);
    this.router.delete(this.path + '/:id/:createdDate', this.deleteStudentNoteByDate);
  }

  addNewNote(request: express.Request, response: express.Response) {
    let note = request.body;
    let _id = request.params.id;
    console.log(note.toDoList);
    notesModel
      .findOneAndUpdate(
        {
          'student.uniqueID': _id
        },
        { $set: { student: { uniqueID: _id } }, $push: { meetingNotes: note } },
        { upsert: true, new: true }
      )
      .then(data => {
        console.log(data);
        response.send(data);
      });
  }

  createNewStudentNoteCollection(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    this.createNewStudentEntry(_id).then(res => {
      response.status(200).send({ message: 'Successfully added student entry', return: res });
    });
  }

  createNewStudentEntry(_id) {
    return notesModel.create({
      student: { uniqueID: _id },
      meetingNotes: []
    });
  }

  getStudentNotesByID(request: express.Request, response: express.Response) {
    const id = request.params.id;
    notesModel.findOne({ 'student.uniqueID': id }).then(studentNote => {
      if (studentNote) {
        response.status(200).send(studentNote.meetingNotes);
      } else {
        response.send([]);
      }
    });
  }

  updateStudentNotesByDate(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const note = request.body;
    notesModel
      .findOneAndUpdate(
        {
          $and: [{ 'student.uniqueID': id, 'meetingNotes.created': note.created }]
        },
        { $set: { 'meetingNotes.$': note } },
        { new: true }
      )
      .then(studentNote => {
        response.send(studentNote);
      });
  }

  deleteStudentNoteByDate(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const createdDate = request.params.createdDate;

    notesModel
      .findOneAndUpdate(
        {
          'student.uniqueID': id
        },
        { $pull: { meetingNotes: { created: createdDate } } },
        { new: true }
      )
      .then(newNote => {
        response.status(200).send({
          message: `Successfully removed note : ${createdDate}`,
          new: newNote
        });
      });
  }
}

export default MeetingNoteController;
