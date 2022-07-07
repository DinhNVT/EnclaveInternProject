const express = require("express");
const router = express.Router();
const Summary = require("../model/SummaryScore");
const Student = require("../model/Student");
// Create Score For Subject
router.post("/:studentID", async (req, res) => {
    const { studentID } = req.params;
    const { summary_behavior, summary_score } = req.body;
    if (!summary_behavior || !summary_score) {
        return res.status(400).json({
            success: false,
            message: "Missing information.Please fill in!",
        });
    }
    try {
        //Validate
        const student = await Student.findById(studentID);
        if (!student) {
            return res.status(400).json({
                success: false,
                message: "This student does not exist.",
            });
        }
        if (student.summary) {
            return res.status(400).json({
                success: false,
                message: "This student already have summary.",
            });
        }
        const newSummary = new Summary({
            summary_behavior,
            summary_score,
            student_id: student,
        });
        await newSummary.save();
        student.summary = newSummary._id;
        await student.save();
        res.json({
            success: true,
            message: "Create score successfully",
            summary: newSummary,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error });
    }
});

// Get
router.get("/", async (req, res) => {
    try {
        // Return token
        const allSummary = await Summary.find({});
        res.json({ success: true, allSummary });
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error });
    }
});

//Update
router.put("/:id", async (req, res) => {
    const { summary_behavior, summary_score } = req.body;
    // Validation
    if (!summary_behavior || !summary_score) {
        return res.status(400).json({
            success: false,
            message: "Missing information.Please fill in!",
        });
    }
    try {
        let updateSummary = {
            summary_behavior,
            summary_score,
        };
        const postUpdateCondition = { _id: req.params.id };
        const updatedSummary = await Summary.findOneAndUpdate(
            postUpdateCondition,
            updateSummary,
            { new: true }
        );
        console.log(updatedSummary);
        if (!updatedSummary)
            return res
                .status(401)
                .json({ success: false, message: "Summary not found" });
        res.json({
            success: true,
            message: "Updated!",
            summary: updateSummary,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error });
    }
});

// Delete
router.delete("/:id", async (req, res) => {
    try {
        const postDeleteCondition = { _id: req.params.id };
        const deletedSummary = await Summary.findOneAndDelete(
            postDeleteCondition
        );

        if (!deletedSummary)
            return res
                .status(401)
                .json({ success: false, message: "Summary not found" });
        res.json({ success: true, message: "Deleted!", parent: deletedParent });
    } catch (error) {
        return res.status(500).json({ success: false, message: "" + error });
    }
});

module.exports = router;