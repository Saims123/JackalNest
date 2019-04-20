import * as mongoose from 'mongoose';
import { Student } from './student-interface';
const studentSchema = new mongoose.Schema(
  {
    uniqueID: String,
    displayName: String,
    email: String,
    projectTitle: String,
    course: String
  },
  { timestamps: true }
);

const studentModel = mongoose.model<Student & mongoose.Document>(
  'student',
  studentSchema,
  'student'
);

export default studentModel;
