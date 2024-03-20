const moment= require('moment');

exports.parseDateTime = (dateString, timeString) => {
    const dateTimeString = `${dateString}T${timeString}`;
    return moment(dateTimeString, 'DD-MM-YYYYTHH:mm').toDate();
};