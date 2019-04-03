import App from './app';
import MeetingNoteController from './meeting/notes-controller';


const app = new App([new MeetingNoteController()], 5000);

app.listen();
