import * as mongoose from 'mongoose';
import { Attendance, AttendanceState } from './attendance-interface';
const attendanceScheme = new mongoose.Schema({
    supervisor: { uniqueID: String },
    records: [
      {
        date: Date,
        attendees: [{ student: {uniqueID : String}, attendanceState: String}],
      }
    ]
});

const attendanceModel = mongoose.model<Attendance & mongoose.Document>('attendance', attendanceScheme, 'attendance');

export default attendanceModel;
