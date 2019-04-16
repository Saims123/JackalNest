"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const group_model_1 = require("../supervision-group/group-model");
class TimeslotsController {
    constructor() {
        this.path = '/timeslots';
        this.router = express.Router();
        this.getAllTimeslots = (request, response) => {
            let supervisorID = request.params.id;
            group_model_1.default.findOne({ "supervisor.uniqueID": supervisorID }).then((group) => {
                if (group) {
                    response.status(200).send({ meetingPeriod: group.meetingPeriod, timeslots: group.timeslots });
                }
                else {
                    response.status(404).send('Timeslots notes not found');
                }
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + '/supervisor/:id', this.getAllTimeslots.bind(this));
        this.router.post(this.path + '/supervisor/:id', this.addNewTimeslots);
        this.router.delete(this.path + '/supervisor/:id', this.removeTimeslots);
        this.router.put(this.path + 'booking/student/:id', this.bookTimeslot);
    }
    addNewTimeslots(request, response, next) {
        let _id = request.params.id;
        let req = request.body;
        group_model_1.default.findOneAndUpdate({ "supervisor.uniqueID": _id }, { $set: {
                'timeslots': req.timeslots,
                'meetingPeriod': req.meetingPeriod
            } }, { new: true })
            .then(data => {
            response.status(200).send(data);
        }).catch(err => { return err; });
    }
    removeTimeslots(request, response) {
        const _id = request.params.id;
        group_model_1.default.findOneAndUpdate({ "supervisor.uniqueID": _id }, { $set: {
                'timeslots': [],
                'meetingPeriod': {}
            } }, { new: true })
            .then(student => {
            response.status(200).send(student);
        }).catch(err => { return err; });
    }
    bookTimeslot(request, response) {
        const _id = request.params.id;
        group_model_1.default.findOneAndUpdate({ 'students.uniqueID': _id }, {
            $set: {
                timeslots: []
            }
        }, { new: true });
    }
}
exports.default = TimeslotsController;
//# sourceMappingURL=timeslots-controller.js.map