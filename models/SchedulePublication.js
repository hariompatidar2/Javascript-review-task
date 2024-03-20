const mongoose = require('mongoose');

const schedulePublicationSchema = new mongoose.Schema({
    page: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Page',
        required: true
    },
    publishDateTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Published', 'Canceled'],
        default: 'Scheduled'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SchedulePublication', schedulePublicationSchema);
