import * as express from 'express';
import {MeetingNote, StudentNotes} from './meeting-interfaces';

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
            student: {displayName: "Student 1", },
            meetingNotes: this.meetingNotes
        }
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllStudentNotes.bind(this));
        this.router.post(this.path, this.createAPost);
    }

    getAllStudentNotes = (request: express.Request, response: express.Response) => {
        response.send(this.studentNotes);
    }

    createAPost = (request: express.Request, response: express.Response) => {
        const post: StudentNotes = request.body;
        this.studentNotes.push(post);
        response.send(post);
    }
}

export default MeetingNoteController;