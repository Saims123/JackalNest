export interface StudentNotes {
  student: Student;
  meetingNotes: MeetingNote[];
}

export interface MeetingNote {
  title?: string;
  created: string;
  todoList?: TodoList[];
  notes: string;
}

export interface TodoList {
  task: string;
  completed: boolean;
}

export interface Student {
  displayName?: string;
  uniqueID?: string;
}


