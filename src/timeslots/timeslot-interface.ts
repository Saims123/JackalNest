import { Student } from 'meeting/meeting-interfaces';
import { Supervisor } from 'supervision-group/group-interface';

export interface Timeslot {
  startTime: string;
  endTime: string;
  day: string;
  student: Student;
}

export interface TimeslotRequestBody {
student ?: Student
supervisor ?: Supervisor;
timeslots?: Timeslot[]
}





