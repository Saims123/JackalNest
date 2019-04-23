import App from './app';
import MeetingNoteController from './meeting/notes/notes-controller';
import SupervisionGroupController from './supervision-group/group-controller';
import InitiateController from './initiate/initiate-controller';
import TimeslotsController from './meeting/timeslots/timeslots-controller';
const app = new App(
  [
    new InitiateController(),
    new MeetingNoteController(),
    new SupervisionGroupController(),
    new TimeslotsController()
  ],
  40030
);

app.listen();
