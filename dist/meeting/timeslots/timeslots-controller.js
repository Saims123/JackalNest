"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const group_model_1 = require("../../supervision-group/group-model");
class TimeslotsController {
    constructor() {
        this.path = '/timeslots';
        this.router = express.Router();
        this.getAllTimeslots = (request, response) => {
            let supervisorID = request.params.id;
            group_model_1.default
                .findOne({ 'supervisor.uniqueID': supervisorID })
                .then(group => {
                if (group) {
                    response
                        .status(200)
                        .send({
                        meetingPeriod: group.meetingPeriod,
                        timeslots: group.timeslots
                    });
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
        this.router.put(this.path + '/booking/student/:id', this.bookTimeslot);
        this.router.put(this.path + '/booking/cancel/student/:id', this.unbookTimeslot);
    }
    addNewTimeslots(request, response, next) {
        let _id = request.params.id;
        let req = request.body;
        group_model_1.default
            .findOneAndUpdate({ 'supervisor.uniqueID': _id }, {
            $set: {
                timeslots: req.timeslots,
                meetingPeriod: req.meetingPeriod
            }
        }, { new: true, upsert: true })
            .then(data => {
            response.status(200).send(data);
        })
            .catch(err => {
            return err;
        });
    }
    removeTimeslots(request, response) {
        const _id = request.params.id;
        group_model_1.default
            .findOneAndUpdate({ 'supervisor.uniqueID': _id }, {
            $set: {
                timeslots: [],
                meetingPeriod: {}
            }
        }, { new: true })
            .then(student => {
            response.status(200).send(student);
        })
            .catch(err => {
            return err;
        });
    }
    bookTimeslot(request, response) {
        const _id = request.params.id;
        const body = request.body;
        group_model_1.default.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
            let index = newTimeslot.timeslots.findIndex(timeslot => timeslot.startTime == body.timeslot.startTime &&
                timeslot.endTime == body.timeslot.endTime);
            newTimeslot.timeslots[index].bookedBy = body.student;
            newTimeslot.timeslots[index].sendICS = false;
            newTimeslot.save();
            response
                .status(200)
                .send({
                message: 'Timeslot updated',
                data: newTimeslot.timeslots[index]
            });
        });
    }
    unbookTimeslot(request, response) {
        const _id = request.params.id;
        const body = request.body;
        group_model_1.default.findOne({ 'supervisor.uniqueID': body.supervisor.uniqueID }).then(newTimeslot => {
            newTimeslot.timeslots.forEach((timeslot) => {
                if (timeslot.bookedBy.uniqueID == _id) {
                    timeslot.sendICS = false;
                    timeslot.bookedBy = { displayName: null, uniqueID: null };
                }
            });
            newTimeslot.save();
            response
                .status(200)
                .send({
                message: 'Timeslot unbooked',
                data: newTimeslot.timeslots
            });
        });
    }
}
exports.default = TimeslotsController;
//# sourceMappingURL=timeslots-controller.js.map