import * as express from 'express';
import timeslotModel from '../../supervision-group/group-model';
import { TimeslotRequestBody } from './timeslot-interface';

class TimeslotsController {
  public path = '/timeslots';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    // Supervisor Routes
    this.router.get(this.path + '/supervisor/:id', this.getAllTimeslotsViaSupervisor.bind(this));
    this.router.post(this.path + '/supervisor/:id', this.addNewTimeslots);
    this.router.delete(this.path + '/supervisor/:id', this.removeTimeslots);
    this.router.put(this.path + '/timeslot/update/supervisor/:id', this.updateTimeslot);
    this.router.put(this.path + '/booking/supervisor/:id', this.bookTimeslotBySupervisor);
    this.router.put(this.path + '/booking/cancel/supervisor/:id', this.unbookTimeslotBySupervisor);
    // Student Routes
    this.router.put(this.path + '/booking/cancel/student/:id', this.unbookTimeslotByStudent);
    this.router.put(this.path + '/booking/student/:id', this.bookTimeslot);
    this.router.get(this.path + '/student/:id', this.getAllTimeslotsViaStudent.bind(this));

  }

  addNewTimeslots(request: express.Request, response: express.Response, next: express.NextFunction) {
    let _id = request.params.id;
    let req: TimeslotRequestBody = request.body;
    timeslotModel
      .findOneAndUpdate(
        { 'supervisor.uniqueID': _id },
        {
          $set: {
            timeslots: req.timeslots,
            meetingPeriod: req.meetingPeriod
          }
        },
        { new: true, upsert: true }
      )
      .then(data => {
        response.status(200).send(data);
      })
      .catch(err => {
        return err;
      });
  }

  removeTimeslots(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    timeslotModel
      .findOneAndUpdate(
        { 'supervisor.uniqueID': _id },
        {
          $set: {
            timeslots: [],
            meetingPeriod: {}
          }
        },
        { new: true }
      )
      .then(student => {
        response.status(200).send(student);
      })
      .catch(err => {
        return err;
      });
  }
  updateTimeslot(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    const body = request.body;
    timeslotModel.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
      let index = newTimeslot.timeslots.findIndex(
        timeslot => (timeslot.startTime == body.timeslot.startTime) && (timeslot.endTime == body.timeslot.endTime)
      );
      newTimeslot.timeslots[index] = body.timeslot;
      newTimeslot.save();
      response.status(200).send({
        message: 'Timeslot updated',
        data: newTimeslot.timeslots[index]
      });
    });
  }
  bookTimeslot(request: express.Request, response: express.Response, next: express.NextFunction) {
    const _id = request.params.id;
    const body = request.body;
    timeslotModel
      .findOne({ 'students.uniqueID': _id })
      .then(newTimeslot => {
        let index = newTimeslot.timeslots.findIndex(
          timeslot =>
            timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime
        );
        newTimeslot.timeslots[index].bookedBy = body.student;
        newTimeslot.timeslots[index].sendICS = false;
        newTimeslot.save();
        response.status(200).send({
          message: 'Timeslot updated',
          data: newTimeslot.timeslots[index]
        });
      })
      .catch(error => {
        response.status(400).send({ error: error, message: 'Unable to book timeslot' });
        console.log(error);
        next();
      });
  }
  bookTimeslotBySupervisor(request: express.Request, response: express.Response, next: express.NextFunction) {
    const _id = request.params.id;
    const body = request.body;
    timeslotModel
      .findOne({ 'supervisor.uniqueID': _id })
      .then(newTimeslot => {
        let index = newTimeslot.timeslots.findIndex(
          timeslot =>
            timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime
        );
        newTimeslot.timeslots[index].bookedBy = body.student;
        newTimeslot.timeslots[index].sendICS = false;
        newTimeslot.save();
        response.status(200).send({
          message: 'Timeslot updated',
          data: newTimeslot.timeslots[index]
        });
      })
      .catch(error => {
        response.status(400).send({ error: error, message: 'Unable to book timeslot' });
        console.log(error);
        next();
      });
  }

  unbookTimeslotBySupervisor(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    timeslotModel.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
      newTimeslot.timeslots.forEach(timeslot => {
        if (timeslot.bookedBy.uniqueID == _id) {
          timeslot.sendICS = false;
          timeslot.bookedBy = { displayName: null, uniqueID: null };
        }
      });
      newTimeslot.save();
      response.status(200).send({
        message: 'Timeslot unbooked',
        data: newTimeslot.timeslots
      });
    });
  }
  unbookTimeslotByStudent(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    timeslotModel.findOne({ 'students.uniqueID': _id }).then(newTimeslot => {
      newTimeslot.timeslots.forEach(timeslot => {
        if (timeslot.bookedBy.uniqueID == _id) {
          timeslot.sendICS = false;
          timeslot.bookedBy = { displayName: null, uniqueID: null };
        }
      });
      newTimeslot.save();
      response.status(200).send({
        message: 'Timeslot unbooked',
        data: newTimeslot.timeslots
      });
    });
  }

  getAllTimeslotsViaSupervisor = (request: express.Request, response: express.Response) => {
    let supervisorID = request.params.id;
    timeslotModel.findOne({ 'supervisor.uniqueID': supervisorID }).then(group => {
      if (group) {
        response.status(200).send({
          supervisor: group.supervisor,
          meetingPeriod: group.meetingPeriod,
          timeslots: group.timeslots
        });
      } else {
        response.status(404).send('Timeslots notes not found');
      }
    });
  };
  getAllTimeslotsViaStudent = (request: express.Request, response: express.Response) => {
    let studentID = request.params.id;
    timeslotModel.findOne({ 'students.uniqueID': studentID }).then(
      group => {
        if (group) {
          response.status(200).send({
            supervisor: group.supervisor,
            meetingPeriod: group.meetingPeriod,
            timeslots: group.timeslots
          });
        } else {
          response.status(404).send('Timeslots notes not found');
        }
      },
      error => {
        response.status(400).send({ message: 'Timeslot API Error', err: error });
      }
    );
  };
}

export default TimeslotsController;
