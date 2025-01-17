const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const privateNotificationSchema = new Schema({
    notification_title: {
        type: String,
        required: true,
    },
    notification_date: {
        type: String,
        required: true,
    },
    notification_content: {
        type: String,
        required: true,
    },
    teacher_id: {
        type: Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    parent_id: {
        type: Schema.Types.ObjectId,
        ref: 'Parents'
    }
});

module.exports = mongoose.model('PrivateNotification', privateNotificationSchema)