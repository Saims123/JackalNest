"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const group_model_1 = require("../../supervision-group/group-model");
class TimeslotsController {
    constructor() {
        this.path = '/timeslots';
        this.router = express.Router();
        this.getAllTimeslotsViaSupervisor = (request, response) => {
            let supervisorID = request.params.id;
            group_model_1.default.findOne({ 'supervisor.uniqueID': supervisorID }).then(group => {
                if (group) {
                    response.status(200).send({
                        supervisor: group.supervisor,
                        meetingPeriod: group.meetingPeriod,
                        timeslots: group.timeslots
                    });
                }
                else {
                    response.status(404).send('Timeslots notes not found');
                }
            });
        };
        this.getAllTimeslotsViaStudent = (request, response) => {
            let studentID = request.params.id;
            group_model_1.default.findOne({ 'students.uniqueID': studentID }).then(group => {
                if (group) {
                    response.status(200).send({
                        supervisor: group.supervisor,
                        meetingPeriod: group.meetingPeriod,
                        timeslots: group.timeslots
                    });
                }
                else {
                    response.status(404).send('Timeslots notes not found');
                }
            }, error => {
                response.status(400).send({ message: 'Timeslot API Error', err: error });
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path + '/supervisor/:id', this.getAllTimeslotsViaSupervisor.bind(this));
        this.router.get(this.path + '/student/:id', this.getAllTimeslotsViaStudent.bind(this));
        this.router.post(this.path + '/supervisor/:id', this.addNewTimeslots);
        this.router.delete(this.path + '/supervisor/:id', this.removeTimeslots);
        this.router.put(this.path + '/booking/student/:id', this.bookTimeslot);
        this.router.put(this.path + '/booking/cancel/student/:id', this.unbookTimeslot);
        this.router.put(this.path + '/timeslot/update/supervisor/:id', this.updateTimeslot);
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
    updateTimeslot(request, response) {
        const _id = request.params.id;
        const body = request.body;
        group_model_1.default.findOne({ 'supervisor.uniqueID': _id }).then(newTimeslot => {
            let index = newTimeslot.timeslots.findIndex(timeslot => timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime);
            newTimeslot.timeslots[index] = body.timeslot;
            newTimeslot.save();
            response.status(200).send({
                message: 'Timeslot updated',
                data: newTimeslot.timeslots[index]
            });
        });
    }
    bookTimeslot(request, response, next) {
        const _id = request.params.id;
        const body = request.body;
        group_model_1.default.findOne({ 'students.uniqueID': _id }).then(newTimeslot => {
            let index = newTimeslot.timeslots.findIndex(timeslot => timeslot.startTime == body.timeslot.startTime && timeslot.endTime == body.timeslot.endTime);
            newTimeslot.timeslots[index].bookedBy = body.student;
            newTimeslot.timeslots[index].sendICS = false;
            newTimeslot.save();
            response.status(200).send({
                message: 'Timeslot updated',
                data: newTimeslot.timeslots[index]
            });
        }, error => {
            response.status(400).send({ error: error, message: 'Unable to book timeslot' });
            console.log(error);
            next();
        });
    }
    unbookTimeslot(request, response) {
        const _id = request.params.id;
        const body = request.body;
        group_model_1.default.findOne({ 'supervisor.uniqueID': body.supervisor.uniqueID }).then(newTimeslot => {
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
}
exports.default = TimeslotsController;
//# sourceMappingURL=timeslots-controller.js.map