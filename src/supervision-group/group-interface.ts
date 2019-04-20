import { Timeslot, MeetingPeriod } from 'timeslots/timeslot-interface';

export interface SupervisionGroup {
  supervisor: Supervisor,
  students: Student[],
  timeslots: Timeslot[],
  meetingPeriod: MeetingPeriod;
}

export interface Supervisor {
  uniqueID: string;
  displayName: string;
  email: string;
  location: string;
}

export interface Student {
  uniqueID: string;
  displayName: string;
  email: string;
  projectTitle: string;
  course: string;
}


export interface SupervisionGroupRequest {
  supervisor: Supervisor;
  student: Student;
}


