import * as express from 'express';
import { MeetingNote, StudentNotes } from '../meeting-interfaces';
import notesModel from './notes-model';

class MeetingNoteController {
  public path = '/notes';
  public router = express.Router();
  public meetingNotes: MeetingNote[];

  constructor() {
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.get(this.path, this.getAllStudentNotes.bind(this));
    this.router.post(this.path + '/:id', this.addNewNote);
    //this.router.post(this.path + '/:id', this.createNewStudentNoteCollection);
    this.router.get(this.path + '/:id', this.getStudentNotesByID);

    this.router.put(this.path + '/:id', this.updateStudentNotesByDate);
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

  createNewStudentNoteCollection(
    request: express.Request,
    response: express.Response
  ) {
    const _id = request.params.id;
    this.createNewStudentEntry(_id).then(res => {
      response
        .status(200)
        .send({ message: 'Successfully added student entry', return: res });
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
    notesModel.find({ 'student.uniqueID': id }).then(studentNote => {
      response.send(studentNote);
    });
  }

  updateStudentNotesByDate(
    request: express.Request,
    response: express.Response
  ) {
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

  removeStudentNoteByID(request: express.Request, response: express.Response) {
    const id = request.params.id;
    const note = request.body;

    notesModel.findOneAndUpdate(
      {
        'student.uniqueID': id
      },
      { $pull: { meetingNotes: { created: note.created } } },
      { new: true }
    );
  }

  updateStudentTaskListByID = (
    request: express.Request,
    response: express.Response
  ) => {};
  getAllStudentNotes = (
    request: express.Request,
    response: express.Response
  ) => {
    notesModel.find().then((studentNotes: StudentNotes[]) => {
      if (studentNotes) {
        response.send(studentNotes);
      } else {
        response.status(404).send('Student notes not found');
      }
    });
  };
}

export default MeetingNoteController;
