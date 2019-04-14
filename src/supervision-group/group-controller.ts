import * as express from 'express';
import { Supervisor, SupervisionGroupRequest } from './group-interface';
import groupModel from './group-model';

class SupervisionGroupController {
  public path = '/group';
  public router = express.Router();
  private supervision = groupModel;

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    // this.router.get(`${this.path}/:id`, this.getStudentByID);
    this.router.post(`${this.path}/student`, this.addNewStudentToSupervisor);
    this.router.get(`${this.path}/student/:id`, this.getSingleStudent);
    this.router.post(`${this.path}/supervisor`, this.addNewSupervisor);
    this.router.get(
      `${this.path}/supervisor/:id`,
      this.getAllStudentsForSupervisor
    );
    this.router.delete(`${this.path}/:id`, this.removeStudentFromSupervisor);
  }
  getSingleStudent = async (
    request: express.Request,
    response: express.Response
  ) => {
    const studentID = request.params.id;
    this.findStudentByID(studentID).then(res => {
      let customRes = {
        supervisor: res.supervisor,
        student: res.students.find(student => student.uniqueID === studentID)
      };
      response.status(200).send(customRes);
    });
  };

  addNewSupervisor = async (
    request: express.Request,
    response: express.Response
  ) => {
    const supervisor: Supervisor = request.body;
    const findSupervisor = await this.findSupervisorByID(supervisor.uniqueID);
    if (findSupervisor) {
      this.supervision.create({
        supervisor: {
          uniqueID: supervisor.uniqueID,
          displayName: supervisor.displayName,
          email: supervisor.email,
          location: supervisor.location
        },
        students: []
      });
      response.status(200).send({
        message: 'Successfully Added Supervisor',
        supervisor: supervisor
      });
    } else {
      response
        .status(400)
        .send({ message: 'Supervisor Already Exist', supervisor: supervisor });
    }
  };

  addNewStudentToSupervisor = async (
    request: express.Request,
    response: express.Response
  ) => {
    const supervisionRequest: SupervisionGroupRequest = request.body;
    const findStudent = await this.findStudentByID(
      supervisionRequest.student.uniqueID
    );

    if (!findStudent) {
      this.supervision
        .findOneAndUpdate(
          { 'supervisor.uniqueID': supervisionRequest.supervisor.uniqueID },
          { $push: { students: supervisionRequest.student } },
          { new: true }
        )
        .then(data => {
          response.status(200).send({
            message: 'Successfully added student',
            student: data
          });
        });
    } else {
      response.status(400).send({
        message: 'Student Already Exist',
        student: findStudent.students
      });
    }
  };

  getAllStudentsForSupervisor = async (
    request: express.Request,
    response: express.Response
  ) => {
    const supervisorID = request.params.id;
    this.findSupervisorByID(supervisorID).then(students => {
      if (students) {
        response.status(200).send(students);
      } else {
        response.status(404).send('Student Not found');
      }
    });
  };

  removeStudentFromSupervisor = async (
    request: express.Request,
    response: express.Response
  ) => {
    const id: string = request.params.id;
    let isFound = await this.findStudentByID(id);

    this.supervision
      .findOneAndUpdate(
        {
          'students.uniqueID': id
        },
        { $pull: { students: { uniqueID: id } } },
        { new: true }
      )
      .then(data => {
        if (isFound) {
          response.status(200).send({
            message: 'Successfully removed student',
            student: data
          });
        } else {
          response.status(404).send({
            message: 'Student not found'
          });
        }
      });
  };

  // Helper Functions

  findSupervisorByID(uniqueID: string) {
    return this.supervision
      .find({
        'supervisor.uniqueID': uniqueID
      })
      .catch(err => {
        return err;
      });
  }

  findStudentByID(uniqueID: string) {
    return this.supervision
      .findOne({
        'students.uniqueID': uniqueID
      })
      .catch(err => {
        return err;
      });
  }
}

export default SupervisionGroupController;
