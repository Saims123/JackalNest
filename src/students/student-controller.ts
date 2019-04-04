import * as express from 'express';
import { Student } from './student-interface';
import studentModel from './student-model';
class StudentController {
  public path = '/student';
  public router = express.Router();
  private students = studentModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(`${this.path}/:id`, this.getStudentByID);
    this.router.post(`${this.path}/create`, this.addNewStudent);
    this.router.get(`${this.path}`, this.getAllStudents);
    this.router.delete(`${this.path}/delete/:id`, this.deleteAStudent);
  }

  addNewStudent = async (
    request: express.Request,
    response: express.Response
  ) => {
    const st: Student = request.body;
    const findStudent = await this.students.findOne({ uniqueID: st.uniqueID });
    if (!findStudent) {
      this.students.create({
        uniqueID: st.uniqueID,
        displayName: st.displayName,
        email: st.email,
        course: st.course
      });
      response.send('success', 201, st);
    }
    response.send('Unsucessful', 400);
  };
  getStudentByID = (request: express.Request, response: express.Response) => {
    const id: number = request.params.id;
    this.students.findOne({ uniqueID: id }).then(student => {
      response.send(student);
    });
  };

  getAllStudents = (request: express.Request, response: express.Response) => {
    this.students.find().then(students => {
      response.send(students);
    });
  };

  deleteAStudent = (request: express.Request, response: express.Response) => {
    const id: number = request.params.id;
    let d: any;
    this.students
    .findOne({ uniqueID: id }).then((data)=> {console.log(data)})
      .remove().exec()
      .then(data => {
        if (data) {
          response.send(data);
        } else {
          response.send(404, 'Not deleted for unknown reason', data);
        }
      });
  };
}

export default StudentController;
