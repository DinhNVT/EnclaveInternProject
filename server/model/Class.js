const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const classSchema = new Schema({
    class_name: {
        type: String,
        required: true,
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: "Teacher",
    },
    teacher_name: {
        type: Schema.Types.String,
        ref: "Teacher",
    },
    grade_id: {
        type: Schema.Types.ObjectId,
        ref: "Grade",
    },
    grade_name: {
        type: Schema.Types.String,
        ref: "Grade",
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: "Student",
        },
    ],
    schedule_id: {
        type: Schema.Types.ObjectId,
        ref: "Schedule",
    },
});

module.exports = mongoose.model("Class", classSchema);
