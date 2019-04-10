import App from './app';
import MeetingNoteController from './meeting/notes-controller';
import StudentController from './students/student-controller';
import SupervisionGroupController from './supervision-group/group-controller';


const app = new App(
  [
    new MeetingNoteController(),
    new StudentController(),
    new SupervisionGroupController()
  ],
  5000
);

app.listen();
