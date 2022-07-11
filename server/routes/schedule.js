require('dotenv').config()
const express = require('express')
const router = express.Router()
const verifyJWTandTeacher = require('../middleware/verifyJWTandTeacher')
const Schedule = require('../model/Schedule')
const ObjectId = require('mongodb')
const Class = require('../model/Class')

// @route POST /api/schedule/create-schedule/{classId}
// @desc create schedule by class id
// @access Private
router.post("/create-schedule/:classId", verifyJWTandTeacher, async (req, res) => {
    const { classId } = req.params
    const { schedule_link } = req.body
    try {
        // Validate
        const scheduleValidate = await Schedule.findOne({ 'class': classId })
        const getClass = await Class.findById(classId)
        if (scheduleValidate) {
            return res
                .status(400)
                .json({ success: false, message: "Schedule already exists in this class!" })
        }
        const newSchedule = new Schedule({
            schedule_link: schedule_link,
            class: classId
        })
        await newSchedule.save()
        getClass.schedule_id = newSchedule._id
        await getClass.save()
        res.status(200).json({ success: true, message: "Create schedule successfully" })
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error })
    }
})

// @route GET /api/schedule/get-schedule
// @desc get schedule
// @access Private
router.get("/get-schedule", verifyJWTandTeacher, async (req, res) => {
    try {
        // Return token
        const allSchedule = await Schedule.find().populate("class", ["class_name"]).select("schedule_link")
        res.status(200).json({
            success: true,
            schedulelink: allSchedule
        })
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error })
    }
})

// @route PUT /api/schedule/update-schedule/{schedule-id}
// @desc update schedule
// @access Private
router.put("/update-schedule/:scheduleId", verifyJWTandTeacher, async (req, res) => {
    const { schedule_link } = req.body
    try {
        // Validate
        const scheduleValidate = await Schedule.findOne({ 'schedule_link': schedule_link })
        if (scheduleValidate) {
            return res
                .status(400)
                .json({ success: false, message: "This link is already exists!" })
        }
        let updateSchedule = {
            schedule_link
        }
        console.log("2", updateSchedule)
        const postUpdateCondition = { _id: req.params.scheduleId }
        console.log("3", postUpdateCondition)
        updateSchedule = await Schedule.findOneAndUpdate(
            postUpdateCondition,
            updateSchedule,
            { new: true }
        ).select("schedule_link")
        if (!updateSchedule)
            return res
                .status(401)
                .json({ success: false, message: "Schedule not found" })
        res.json({ success: true, message: "Update schedule successfully!", schedule: updateSchedule })
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error })
    }
})

// @route DELETE /api/schedule/delete-schedule/{schedule-id}
// @desc delete schedule
// @access Private
router.delete("/delete-schedule/:scheduleId", verifyJWTandTeacher, async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.scheduleId };
        const scheduleDB = await Schedule.findById(postDeleteCondition._id)
        if (!scheduleDB) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Schedule is not found"
                })
        }
        const deletedSchedule = await Schedule.findOneAndDelete(postDeleteCondition)
        const getClass = await Class.findById(scheduleDB.class.toString())
        if (!getClass) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Class is not found"
                })
        }
        getClass.schedule_id = undefined
        getClass.save()
        if (!deletedSchedule)
            return res
                .status(401)
                .json({ success: false, message: "Schedule is not found" });
        res.json({ success: true, message: "Deleted schedule successfully!", schedule: deletedSchedule });
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error });
    }
});

module.exports = router