import App from './app';
import MeetingNoteController from './meeting/notes/notes-controller';
import SupervisionGroupController from './supervision-group/group-controller';
import InitiateController from './initiate/initiate-controller';
import TimeslotsController from './meeting/timeslots/timeslots-controller';
import AttendanceController from './attendance/attendance-controller';
const app = new App(
  [
    new InitiateController(),
    new MeetingNoteController(),
    new SupervisionGroupController(),
    new TimeslotsController(),
    new AttendanceController()
  ],
  40030
);

app.listen();
