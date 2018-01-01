// Helper functions

const _ = require('lodash');

/**
 * Return a {year, month, day} object if the input is a valid date,
 * `null` otherwise
 */
function parseDate(dateString) {
    let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
    if (match) {
        let date = {
            year: parseInt(match[1]),
            month: parseInt(match[2]),
            day: parseInt(match[3]),
        };
        const DAYS_IN_MONTH = [31, date.year % 4 == 0 ? 29 : 28,  // Leap years
                               31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (date.month >= 1 && date.month <= 12 &&
                date.day >= 1 && date.day <= DAYS_IN_MONTH[date.month - 1]) {
            return date;
        }
    }
    return null;
}

/**
 * Reverse `parseDate`
 */
function formatDate(year, month, day) {
    return `${zeroFill(year, 4)}-${zeroFill(month, 2)}-${zeroFill(day, 2)}`;
}

function zeroFill(number, length) {
    return _.padStart(number.toString(), length, '0');
}

module.exports = {
    formatDate,
    parseDate,
};
