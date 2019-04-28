import { Student, Supervisor } from 'supervision-group/group-interface';

export interface Attendance {
  supervisor: Supervisor;
  records: Record[];
}

export interface Record {
  date: Date;
  attendees: Attendee;
}

export interface Attendee {
  student: Student;
  attendanceState: AttendanceState;
}

export enum AttendanceState {
  Yes = 'Yes',
  No = 'No',
  Cancelled = 'Cancelled',
  Unknown = 'Unknown'
}
