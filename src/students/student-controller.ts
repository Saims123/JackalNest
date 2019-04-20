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
    this.router.post(`${this.path}/`, this.addNewStudent);
    this.router.get(`${this.path}`, this.getAllStudents);
    this.router.delete(`${this.path}/:id`, this.deleteAStudent);
  }

  addNewStudent = async (
    request: express.Request,
    response: express.Response
  ) => {
    const student: Student = request.body;
    const findStudent = await this.students.findOne({
      uniqueID: student.uniqueID
    });
    if (!findStudent) {
      this.students.create({
        uniqueID: student.uniqueID,
        displayName: student.displayName,
        email: student.email,
        projectTitle: student.projectTitle,
        course: student.course
      });
      response
        .status(200)
        .send({ message: 'Successfully added student', student: student });
    } else {
      response.status(400).send('Student already exist');
    }
  };
  getStudentByID = (request: express.Request, response: express.Response) => {
    const id: number = request.params.id;
    this.students.findOne({ uniqueID: id }).then(student => {
      response.send(student);
    });
  };

  getAllStudents = (request: express.Request, response: express.Response) => {
    this.students.find().then(students => {
      if (students) {
        response.status(200).send(students);
      } else {
        response.status(404).send({message: 'Student Not found', error: 404});
      }
    });
  };

  deleteAStudent = (request: express.Request, response: express.Response) => {
    const id: number = request.params.id;
    let d: any;
    this.students
      .findOne({ uniqueID: id })
      .remove()
      .exec()
      .then(data => {
        if (data) {
          response
            .status(200)
            .send({ message: 'Successfully removed student', response: data });
        } else {
          response
            .status(404)
            .send({
              message: 'Not deleted for unknown reason',
              response: data
            });
        }
      });
  };
}

export default StudentController;
