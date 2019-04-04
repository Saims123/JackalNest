import App from './app';
import MeetingNoteController from './meeting/notes-controller';
import StudentController from './students/student-controller';


const app = new App(
  [new MeetingNoteController(), new StudentController()],
  5000
);

app.listen();
