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
    this.router.get(this.path + '/:id/:createdDate', this.getOneStudentNoteByDate);
    this.router.put(this.path + '/edit/:id', this.updateStudentNotesByDate);
    this.router.delete(this.path + '/:id/:createdDate', this.deleteStudentNoteByDate);
  }

  addNewNote(request: express.Request, response: express.Response) {
    let note = request.body;
    let _id = request.params.id;
    notesModel
      .findOneAndUpdate(
        {
          'student.uniqueID': _id
        },
        { $set: { student: { uniqueID: _id } }, $push: { meetingNotes: note } },
        { upsert: true, new: true }
      )
      .then(data => {
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

  getOneStudentNoteByDate(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const created = request.params.createdDate;
    notesModel
      .findOne({ 'student.uniqueID': id, 'meetingNotes.created': created })
      .then(studentNote => {
        if (studentNote) {
          let studentNoteResult = studentNote.meetingNotes.find(
            meetingNote => meetingNote.created == created
          );
          response.status(200).send(studentNoteResult);
        } else {
          response.status(404).send({ message: 'Student Note not found '});
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
        response.status(200).send(studentNote);
      },
      (_error) => {
        response.status(400).send({message: 'Unable to update student', error: _error});

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
