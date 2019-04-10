import { Student } from 'students/student-interface';

export interface SupervisionGroup {
  supervisor: Supervisor,
  students: Student[]
}

export interface Supervisor {
  uniqueID: string;
  displayName: string;
  email: string;
  location: string;
}


export interface SupervisionGroupRequest {
  supervisor: Supervisor;
  student: Student;
}


