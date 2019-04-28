import * as express from 'express';
import attendanceModel from './attendance-model';
import { Attendance, Attendee, AttendanceState } from './attendance-interface';
import supervisionModel from '../supervision-group/group-model';
// https://docs.mongodb.com/manual/reference/operator/update/set/

class AttendanceController {
  public path = '/attendance';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    // this.router.get(this.path + '/supervisor/:id', this.getAllTimeslotsViaSupervisor.bind(this));
    this.router.post(this.path + '/supervisor/:id', this.addNewAttendanceDate);
    this.router.delete(this.path + '/supervisor/:id', this.removeAttendanceRecord);
    this.router.put(this.path + '/student/:id', this.updateStudentAttendanceState);
  }

  async addNewAttendanceDate(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    let _id = request.params.id;
    let students: any[] = [];
    await supervisionModel
      .findOne({ 'supervisor.uniqueID': _id })
      .then(group => {
        if (group) {
          group.students.forEach(_student => {
            students.push({
              student: { uniqueID: _student.uniqueID },
              attendanceState: AttendanceState.Unknown
            });
          });
        } else {
          response.status(400).send('Supervisor Group not found');
          next();
        }
      })
      .then(async () => {
        const record = {
          date: request.body.date,
          attendees: students
        };
        await attendanceModel
          .findOneAndUpdate(
            { 'supervisor.uniqueID': _id },
            {
              $addToSet: {
                records: record
              }
            },
            { new: true, upsert: true }
          )
          .then(data => {
            response.status(200).send(data);
          })
          .catch(err => {
            console.error('Cannot do + ', err);
            response.status(400).send(err);
            next();
            return err;
          });
      })
      .catch(error => {
        response.status(400).send(error);
        console.error('Once again : ', error);
        next();
      });
  }

  updateStudentAttendanceState(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    attendanceModel
      .findOneAndUpdate(
        { 'records.attendees.student.uniqueID': _id, 'records.date': request.body.date },
        {
          $set: { 'records.$.attendees.0.attendanceState': request.body.state }
        },
        { new: true }
      )
      .then(newState => {
        response.send(newState);
      })
      .catch(error => {
        response.status(400).send(error);
        console.error(error);
      });
  }

  removeAttendanceRecord(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    attendanceModel
      .findOneAndUpdate(
        { 'supervisor.uniqueID': _id, 'records.date': request.body.date },
        {
          $pull: {
            records: {
              date: request.body.date
            }
          }
        },
        { new: true }
      )
      .then(record => {
        response.status(200).send(record);
      })
      .catch(err => {
        response.status(400).send({ message: 'Failed to delete record : ', error: err });
        return err;
      });
  }
  // updateTimeslot(request: express.Request, response: express.Response) {
  //   const _id = request.params.id;
  //   const body = request.body;
  //   attendanceModel.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
  //     let index = newTimeslot.timeslots.findIndex(
  //       timeslot => timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime
  //     );
  //     newTimeslot.timeslots[index] = body.timeslot;
  //     newTimeslot.save();
  //     response.status(200).send({
  //       message: 'Timeslot updated',
  //       data: newTimeslot.timeslots[index]
  //     });
  //   });
  // }
  // bookTimeslot(request: express.Request, response: express.Response, next: express.NextFunction) {
  //   const _id = request.params.id;
  //   const body = request.body;
  //   attendanceModel
  //     .findOne({ 'students.uniqueID': _id })
  //     .then(newTimeslot => {
  //       let index = newTimeslot.timeslots.findIndex(
  //         timeslot =>
  //           timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime
  //       );
  //       newTimeslot.timeslots[index].bookedBy = body.student;
  //       newTimeslot.timeslots[index].sendICS = false;
  //       newTimeslot.save();
  //       response.status(200).send({
  //         message: 'Timeslot updated',
  //         data: newTimeslot.timeslots[index]
  //       });
  //     })
  //     .catch(error => {
  //       response.status(400).send({ error: error, message: 'Unable to book timeslot' });
  //       console.log(error);
  //       next();
  //     });
  // }
  // bookTimeslotBySupervisor(request: express.Request, response: express.Response, next: express.NextFunction) {
  //   const _id = request.params.id;
  //   const body = request.body;
  //   attendanceModel
  //     .findOne({ 'supervisor.uniqueID': _id })
  //     .then(newTimeslot => {
  //       let index = newTimeslot.timeslots.findIndex(
  //         timeslot =>
  //           timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime
  //       );
  //       newTimeslot.timeslots[index].bookedBy = body.student;
  //       newTimeslot.timeslots[index].sendICS = false;
  //       newTimeslot.save();
  //       response.status(200).send({
  //         message: 'Timeslot updated',
  //         data: newTimeslot.timeslots[index]
  //       });
  //     })
  //     .catch(error => {
  //       response.status(400).send({ error: error, message: 'Unable to book timeslot' });
  //       console.log(error);
  //       next();
  //     });
  // }

  // unbookTimeslotBySupervisor(request: express.Request, response: express.Response) {
  //   const _id = request.params.id;
  //   attendanceModel.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
  //     newTimeslot.timeslots.forEach(timeslot => {
  //       if (timeslot.bookedBy.uniqueID == _id) {
  //         timeslot.sendICS = false;
  //         timeslot.bookedBy = { displayName: null, uniqueID: null };
  //       }
  //     });
  //     newTimeslot.save();
  //     response.status(200).send({
  //       message: 'Timeslot unbooked',
  //       data: newTimeslot.timeslots
  //     });
  //   });
  // }
  // unbookTimeslotByStudent(request: express.Request, response: express.Response) {
  //   const _id = request.params.id;
  //   attendanceModel.findOne({ 'students.uniqueID': _id }).then(newTimeslot => {
  //     newTimeslot.timeslots.forEach(timeslot => {
  //       if (timeslot.bookedBy.uniqueID == _id) {
  //         timeslot.sendICS = false;
  //         timeslot.bookedBy = { displayName: null, uniqueID: null };
  //       }
  //     });
  //     newTimeslot.save();
  //     response.status(200).send({
  //       message: 'Timeslot unbooked',
  //       data: newTimeslot.timeslots
  //     });
  //   });
  // }

  // getAllTimeslotsViaSupervisor = (request: express.Request, response: express.Response) => {
  //   let supervisorID = request.params.id;
  //   attendanceModel.findOne({ 'supervisor.uniqueID': supervisorID }).then(group => {
  //     if (group) {
  //       response.status(200).send({
  //         supervisor: group.supervisor,
  //         meetingPeriod: group.meetingPeriod,
  //         timeslots: group.timeslots
  //       });
  //     } else {
  //       response.status(404).send('Timeslots notes not found');
  //     }
  //   });
  // };
  // getAllTimeslotsViaStudent = (request: express.Request, response: express.Response) => {
  //   let studentID = request.params.id;
  //   attendanceModel.findOne({ 'students.uniqueID': studentID }).then(
  //     group => {
  //       if (group) {
  //         response.status(200).send({
  //           supervisor: group.supervisor,
  //           meetingPeriod: group.meetingPeriod,
  //           timeslots: group.timeslots
  //         });
  //       } else {
  //         response.status(404).send('Timeslots notes not found');
  //       }
  //     },
  //     error => {
  //       response.status(400).send({ message: 'Timeslot API Error', err: error });
  //     }
  //   );
  // };
}

export default AttendanceController;
