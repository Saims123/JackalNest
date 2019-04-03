import * as express from 'express';
import { MeetingNote, StudentNotes, Student } from './meeting-interfaces';
import notesModel from './notes-model';

class MeetingNoteController {
  public path = '/notes';
  public router = express.Router();
  public meetingNotes: MeetingNote[] = [
    {
      title: 'Nothing special',
      todoList: [
        { task: 'Task1', completed: false },
        { task: 'Task2', completed: true }
      ],
      notes:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      created: new Date().toISOString()
    },
    {
      title: 'Nothing special2',
      todoList: [
        { task: 'Task1', completed: true },
        { task: 'Task2', completed: true }
      ],
      notes:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      created: new Date().toISOString()
    },
    {
      title: 'Nothing special 3',
      todoList: [
        { task: 'Task1', completed: false },
        { task: 'Task2', completed: true }
      ],
      notes:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      created: new Date().toISOString()
    }
  ];
  private studentNotes: StudentNotes[] = [
    {
      student: { displayName: 'Student 1' },
      meetingNotes: this.meetingNotes
    }
  ];

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path, this.getAllStudentNotes.bind(this));
    this.router.post(this.path, this.createNoteForStudent);
    this.router.post(this.path + '/test', this.addNewNote);
    this.router.get(
      this.path + '/:id',
      this.getAllStudentNotes.bind(this)
    );
  }

  addNewNote(request: express.Request, response: express.Response) {
    notesModel
      .findOneAndUpdate({ student: { uniqueID: 'Student 1' } })
      .then(student => {
        student.meetingNotes[0].todoList.push({
          task: 'Another one',
          completed: false
        });

        response.send(student.meetingNotes);
      });
  }

  getStudentNotesByID(request: express.Request, response: express.Response) {
    const id = request.params.id;
    notesModel.find({student: {uniqueID: id}}).then(studentNote => {response.send(studentNote)})
  }

  getAllStudentNotes = (
    request: express.Request,
    response: express.Response
  ) => {
    notesModel.find().then((studentNotes: StudentNotes[]) => {
      response.send(studentNotes);
    });
  };

  createNoteForStudent = (request: express.Request, response: express.Response) => {
    const sn: StudentNotes = request.body;
    const index = this.studentNotes.findIndex(
      notes => notes.student.uniqueID === sn.student.uniqueID
    );
    if (index > 0) { 
      this.studentNotes[index].meetingNotes = sn.meetingNotes;
    } else {
      this.studentNotes.push(sn);
    }
    const createdNote = new notesModel(sn);
    createdNote.save().then(savedNote => {
      response.send(savedNote);
    });
  };
}

export default MeetingNoteController;
