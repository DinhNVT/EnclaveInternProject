require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const { authTeacher } = require('../middleware/verifyRoles')
const verifyJWT = require('../../server/middleware/verifyJWT')
const Student = require('../model/Student')
const { MongoClient, ObjectId } = require('mongodb');
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@enclave-project.cnfw0.mongodb.net/?retryWrites=true&w=majority`;

// @route GET dashboard/teacher/create-student
// @desc create student information
// @access Private
router.post('/create-student', verifyJWT, async (req, res) => {
    const { student_fullname, student_age, student_gender, student_image, student_behavior, class_id, score_id, schoolyear_id } = req.body
    //Simple validation
    if (!student_fullname || !student_age || student_gender == null || !student_image || !student_behavior || !class_id || !score_id || !schoolyear_id)
        return res.status(400).json({ success: false, message: 'Please fill in complete information' })
    try {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("test");
            var queryClassId = { "_id": new ObjectId(class_id) }
            var tableClassName = "classes"

            dbo.collection(tableClassName).find(queryClassId).toArray(function (err, result) {
                if (err) throw err;
                var classId = result[0]._id.toString()
                //save collection
                const newStudent = new Student({
                    student_fullname,
                    student_age,
                    student_gender,
                    student_image,
                    student_behavior,
                    teacher_id: req.userId,
                    class_id: ObjectId(classId),
                    score_id: ObjectId(score_id),
                    schoolyear_id: ObjectId(schoolyear_id)
                })
                const start = async function () {
                    await newStudent.save()
                }
                res.json({ success: true, message: 'Create student successfully', student: newStudent })
                start();
            });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: '' + error })
    }
})

// @route GET dashboard/teacher/get-all-student
// @desc get student information
// @access Private
router.get('/get-all-student', verifyJWT, async (req, res) => {
    try {
        // Return token
        const allStudent = await Student.find({})
        res.json({ success: true, allStudent })
    } catch (error) {
        return res.status(500).json({ success: false, message: '' + error })
    }
})

// @route PUT dashboard/teacher/update-student
// @desc Update stduent
// @access Private Only Admin
router.put('/update-student/:id', verifyJWT, async (req, res) => {
    const {
        student_fullname,
        student_age,
        student_gender,
        student_image,
        student_behavior,
        class_id,
        score_id,
        schoolyear_id } = req.body
    // Validation
    if (!student_fullname || !student_age || student_gender == null || !student_image || !student_behavior || !class_id || !score_id || !schoolyear_id)
        return res.status(400).json({ success: false, message: 'Please fill in complete information' })
    try {
        let updateStudent = {
            student_fullname,
            student_age,
            student_gender,
            student_image,
            student_behavior,
            class_id,
            score_id,
            schoolyear_id
        }
        const postUpdateCondition = { _id: req.params.id, user: req.userId }
        updatedParent = await Student.findOneAndUpdate(postUpdateCondition, updateStudent, { new: true })

        if (!updateStudent)
            return res.status(401).json({ success: false, message: 'Student is not found' })
        res.json({ success: true, message: 'Update succesfully!', parent: updateStudent })
    } catch (error) {
        return res.status(500).json({ success: false, message: '' + error })
    }
})
module.exports = router