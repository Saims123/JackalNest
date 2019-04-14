import * as mongoose from 'mongoose';
import { StudentNotes } from './timeslot-interface';
const meetingNotesSchema = new mongoose.Schema({
    student: { uniqueID: String },
    meetingNotes: [
      {
        title: String,
        created: String,
        todoList: [{ task: String, completed: Boolean }],
        notes: String
      }
    ]
});

const notesModel = mongoose.model<StudentNotes & mongoose.Document>(
  'notes',
  meetingNotesSchema,
  'notes'
);

export default notesModel;
