import { Student } from 'meeting/meeting-interfaces';
import { Supervisor } from 'supervision-group/group-interface';

export interface Timeslot {
  startTime: string;
  endTime: string;
  day: string;
  bookedBy: Student;
  sendICS: boolean;
}

export interface TimeslotRequestBody {
student ?: Student
supervisor ?: Supervisor;
timeslots?: Timeslot[],
meetingPeriod ?: MeetingPeriod
}

export interface MeetingPeriod {
  start: Date;
  end: Date;
  location: string;
}




