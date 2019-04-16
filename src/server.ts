import App from './app';
import MeetingNoteController from './meeting/notes-controller';
import StudentController from './students/student-controller';
import SupervisionGroupController from './supervision-group/group-controller';
import TimeslotsController from './timeslots/timeslots-controller';
import InitiateController from './initiate/initiate-controller';


const app = new App(
  [
    new InitiateController(),
    new MeetingNoteController(),
    new StudentController(),
    new SupervisionGroupController(),
    new TimeslotsController()
  ],
  40030
);

app.listen();
