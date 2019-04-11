"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const student_model_1 = require("./student-model");
class StudentController {
    constructor() {
        this.path = '/student';
        this.router = express.Router();
        this.students = student_model_1.default;
        this.addNewStudent = async (request, response) => {
            const student = request.body;
            const findStudent = await this.students.findOne({
                uniqueID: student.uniqueID
            });
            if (!findStudent) {
                this.students.create({
                    uniqueID: student.uniqueID,
                    displayName: student.displayName,
                    email: student.email,
                    course: student.course
                });
                response
                    .status(200)
                    .send({ message: 'Successfully added student', student: student });
            }
            else {
                response.status(400).send('Student already exist');
            }
        };
        this.getStudentByID = (request, response) => {
            const id = request.params.id;
            this.students.findOne({ uniqueID: id }).then(student => {
                response.send(student);
            });
        };
        this.getAllStudents = (request, response) => {
            this.students.find().then(students => {
                if (students) {
                    response.status(200).send(students);
                }
                else {
                    response.status(404).send({ message: 'Student Not found', error: 404 });
                }
            });
        };
        this.deleteAStudent = (request, response) => {
            const id = request.params.id;
            let d;
            this.students
                .findOne({ uniqueID: id })
                .remove()
                .exec()
                .then(data => {
                if (data) {
                    response
                        .status(200)
                        .send({ message: 'Successfully removed student', response: data });
                }
                else {
                    response
                        .status(404)
                        .send({
                        message: 'Not deleted for unknown reason',
                        response: data
                    });
                }
            });
        };
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getStudentByID);
        this.router.post(`${this.path}/`, this.addNewStudent);
        this.router.get(`${this.path}`, this.getAllStudents);
        this.router.delete(`${this.path}/:id`, this.deleteAStudent);
    }
}
exports.default = StudentController;
//# sourceMappingURL=student-controller.js.map