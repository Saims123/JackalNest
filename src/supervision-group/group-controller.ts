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
    this.router.post(`${this.path}/student`, this.addNewStudentToSupervisor);
    this.router.get(`${this.path}/student/:id`, this.getSingleStudent);
    this.router.post(`${this.path}/supervisor`, this.addNewSupervisor);
    this.router.get(`${this.path}/supervisor/:id`, this.getAllStudentsForSupervisor);
    this.router.delete(`${this.path}/:id`, this.removeStudentFromSupervisor);
  }
  /**
   * GET API to return one student found using ID
   * @param {student} Student
   */
  getSingleStudent = async (request: express.Request, response: express.Response) => {
    const studentID = request.params.id;
    this.findStudentByID(studentID).then(res => {
      let customRes = {
        supervisor: res.supervisor,
        student: res.students.find(student => student.uniqueID === studentID)
      };
      response.status(200).json(customRes);
    });
  };
  /**
   * POST API to create new supervision group with supervisor
   * @param {supervisor} Supervisor
   * @param {id} string
   */

  addNewSupervisor = async (request: express.Request, response: express.Response) => {
    const supervisor: Supervisor = request.body;
    const findSupervisor = await this.findSupervisorByID(supervisor.uniqueID);
    if (findSupervisor) {
      this.initiateSupervisorGroup(supervisor);
      response.status(200).send({
        message: 'Successfully Added Supervisor',
        supervisor: supervisor
      });
    } else {
      response.status(400).send({ message: 'Supervisor Already Exist', supervisor: supervisor });
    }
  };
  /** POST API to add new student in the group with supervisor
   * Can only add new students under the condition that :
   * 1. It is not already in another supervision group
   * 2. It does not already exist in current supervision group
   * 3. Supervisor cannot be student at the same time
   */
  addNewStudentToSupervisor = async (request: express.Request, response: express.Response) => {
    const supervisionRequest: SupervisionGroupRequest = request.body;
    const findStudent = await this.findStudentByID(supervisionRequest.student.uniqueID);

    if (!findStudent) {
      this.supervision
        .findOneAndUpdate(
          {
            'supervisor.uniqueID': supervisionRequest.supervisor.uniqueID
          },
          {
            $set: { supervisor: supervisionRequest.supervisor },
            $push: { students: supervisionRequest.student }
          },
          { new: true, upsert: true }
        )
        .then(data => {
          response.status(200).send({
            message: 'Successfully added student',
            object: data
          });
        });
    } else {
      response.status(400).send({
        message: 'Student Already Exist',
        student: findStudent.students
      });
    }
  };

  getAllStudentsForSupervisor = async (request: express.Request, response: express.Response) => {
    const supervisorID = request.params.id;
    this.findSupervisorByID(supervisorID).then(students => {
      if (students) {
        response.status(200).json(students);
      } else {
        response.status(404).send('Student Not found');
      }
    });
  };
  /** DELETE API to remove existing student from the group array, search by ID
   *  @param {student} string
   */

  removeStudentFromSupervisor = async (request: express.Request, response: express.Response) => {
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

  /**
   * Helper function to search for one supervisor by id
   * @param uniqueID
   */

  findSupervisorByID(uniqueID: string) {
    return this.supervision
      .findOne({
        'supervisor.uniqueID': uniqueID
      })
      .catch(err => {
        return err;
      });
  }

  /**
   * Helper function to search for one student by id
   * @param uniqueID
   */
  findStudentByID(uniqueID: string) {
    return this.supervision
      .findOne({
        'students.uniqueID': uniqueID
      })
      .catch(err => {
        return err;
      });
  }
  /** Helper function seperated to create supervision-group document, before adding supervisor into the document
   *
   * @param supervisor
   */
  async initiateSupervisorGroup(supervisor) {
    const findSupervisor = await this.findSupervisorByID(supervisor.uniqueID);
    if (findSupervisor) {
      return this.supervision.create({
        supervisor: {
          uniqueID: supervisor.uniqueID,
          displayName: supervisor.displayName,
          email: supervisor.email,
          location: supervisor.location
        },
        students: [],
        timeslots: [],
        meetingPeriod: {}
      });
    }
  }
}
export default SupervisionGroupController;
