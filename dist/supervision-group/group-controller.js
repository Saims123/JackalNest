"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const group_model_1 = require("./group-model");
class SupervisionGroupController {
    constructor() {
        this.path = '/group';
        this.router = express.Router();
        this.supervision = group_model_1.default;
        this.addNewSupervisor = async (request, response) => {
            const supervisor = request.body;
            const findSupervisor = await this.findSupervisor(supervisor.uniqueID);
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
            }
            else {
                response
                    .status(400)
                    .send({ message: 'Supervisor Already Exist', supervisor: supervisor });
            }
        };
        this.addNewStudentToSupervisor = async (request, response) => {
            const supervisionRequest = request.body;
            const findStudent = await this.findStudent(supervisionRequest.student.uniqueID);
            if (!findStudent) {
                this.supervision
                    .findOneAndUpdate({ 'supervisor.uniqueID': supervisionRequest.supervisor.uniqueID }, { $push: { students: supervisionRequest.student } }, { new: true })
                    .then(data => {
                    response.status(200).send({
                        message: 'Successfully added student',
                        student: data
                    });
                });
            }
            else {
                response.status(400).send({
                    message: 'Student Already Exist',
                    student: findStudent.students
                });
            }
        };
        this.getAllStudentsForSupervisor = async (request, response) => {
            const supervisorID = request.params.id;
            this.findSupervisor(supervisorID).then(students => {
                if (students) {
                    response.status(200).send(students);
                }
                else {
                    response.status(404).send('Student Not found');
                }
            });
        };
        this.removeStudentFromSupervisor = async (request, response) => {
            const id = request.params.id;
            let isFound = await this.findStudent(id);
            this.supervision
                .findOneAndUpdate({
                'students.uniqueID': id
            }, { $pull: { students: { uniqueID: id } } }, { new: true })
                .then(data => {
                if (isFound) {
                    response.status(200).send({
                        message: 'Successfully removed student',
                        student: data
                    });
                }
                else {
                    response.status(404).send({
                        message: 'Student not found',
                    });
                }
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        // this.router.get(`${this.path}/:id`, this.getStudentByID);
        this.router.post(`${this.path}/student`, this.addNewStudentToSupervisor);
        this.router.post(`${this.path}/supervisor`, this.addNewSupervisor);
        this.router.get(`${this.path}/supervisor/:id`, this.getAllStudentsForSupervisor);
        this.router.delete(`${this.path}/:id`, this.removeStudentFromSupervisor);
    }
    // Helper Functions
    findSupervisor(uniqueID) {
        return this.supervision.find({
            'supervisor.uniqueID': uniqueID
        });
    }
    findStudent(uniqueID) {
        return this.supervision.findOne({
            'students.uniqueID': uniqueID
        });
    }
}
exports.default = SupervisionGroupController;
//# sourceMappingURL=group-controller.js.map