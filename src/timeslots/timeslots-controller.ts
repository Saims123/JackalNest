import * as express from 'express';
import timeslotModel from '../supervision-group/group-model';
import { TimeslotRequestBody } from './timeslot-interface';


class TimeslotsController {
  public path = '/timeslots';
  public router = express.Router();

  constructor() {
    this.intializeRoutes();
  }

  public intializeRoutes() {
    this.router.get(this.path + '/supervisor/:id', this.getAllTimeslots.bind(this));
    this.router.post(this.path + '/supervisor/:id', this.addNewTimeslots);
    this.router.delete(this.path + '/supervisor/:id', this.removeTimeslots);
  }

  addNewTimeslots(
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) {
    let _id = request.params.id;
    let req: TimeslotRequestBody = request.body;
    console.log(_id, req.timeslots);
    timeslotModel.findOneAndUpdate(
        { "supervisor.uniqueID": _id },
        { $set: {
            'timeslots': req.timeslots
          }},
        { new: true }
      )
      .then(data => {
        response.status(200).send(data);
      }).catch(err => {return err;});
  }

  removeTimeslots(request: express.Request, response: express.Response) {
    const _id = request.params.id;
    timeslotModel.findOneAndUpdate(
        { "supervisor.uniqueID": _id },
        { $set: {
            'timeslots': []
          }},
        { new: true }
      )
      .then(student => {
        response.status(200).send(student);
      }).catch(err => {return err;});
  }

  getAllTimeslots = (
    request: express.Request,
    response: express.Response
  ) => {
    let supervisorID = request.params.id;
    let requestBody: TimeslotRequestBody =  request.body;
    timeslotModel.findOne({uniqueID : supervisorID}).then((group) => {
      if (group) {
        response.send(group.timeslots);
      } else {
        response.status(404).send('Timeslots notes not found');
      }
    });
  };
}

export default TimeslotsController;
