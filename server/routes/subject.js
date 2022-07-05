const express = require('express')
const router = express.Router()
const Subjects = require('../model/Subject')
const Grades = require('../model/Grade')

// Create
router.post('/', async (req, res) => { 
    const {
        subject_name,
        subject_ratio,
        grade_id,
    } = req.body
    if (!subject_name || !subject_ratio || !grade_id) {
        return res.status(400).json({ success: false, message: 'Missing information.Please fill in!' })
    }
    try {
        //Validate
        const subjectValidate = await Subjects.findOne({ subject_name:subject_name })
        const gradeValidate = await Grades.findOne({grade_id:grade_id})
        if (subjectValidate && gradeValidate) {
            return res.status(400).json({ success: false, message: 'This subject is existing in this grade.' })
        }
        const newSubject = new Subjects ({
            subject_name,
            subject_ratio,
            grade_id,
        })
        await newSubject.save()
        res.json({ success: true, message: 'Create subject successfully' })
    } catch (error) {
        return res.status(500).json({ success: false, message: '' + error })
    }
})


// Get
router.get('/', async (req, res) => {
    try {
        // Return token
        const allSubjects = await Subjects.find({})
        res.json({ success: true, allSubjects })
    } catch (error) {
        return res.status(500).json({ success: false, message: '' + error })
    }

})


// Update
router.put('/:id', async (req, res) => {

    const {
        subject_name,
        subject_ratio,
        grade_id,
    } = req.body
    // Validation
    if (!subject_name || !subject_ratio || !grade_id) {
        return res.status(400).json({ success: false, message: 'Missing information.Please fill in!' })
    }
    try {
        let updateSubject = {
            subject_name,
            subject_ratio,
            grade_id,
        }
        const postUpdateCondition = { _id: req.params.id }
        updatedSubject = await Subjects.findOneAndUpdate(postUpdateCondition, updateSubject, { new: true })

        if (!updatedSubject)
            return res.status(401).json({ success: false, message: 'Subject not found' })
        res.json({ success: true, message: 'Updated!', parent: updateParent })
    } catch {
        return res.status(500).json({ success: false, message: '' + error })
    }
})

// Delete
router.delete('/:id', async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id }
        const deletedSubject = await Subjects.findOneAndDelete(postDeleteCondition)

        if (!deletedSubject)
            return res.status(401).json({ success: false, message: 'Subject not found' })
        res.json({ success: true, message: 'Deleted!', subject: deletedSubject })
    } catch {
        return res.status(500).json({ success: false, message: '' + error })
    }
})

module.exports = router