"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = void 0;
const formatDate = (selectedDate) => {
    if (!selectedDate)
        return;
    let day = getDay(selectedDate);
    let month = getMonth(selectedDate);
    let year = selectedDate.getFullYear();
    return selectedDate ? `${day}.${month}.${year}` : '';
};
exports.formatDate = formatDate;
function getDay(selectedDate) {
    if (!selectedDate)
        return;
    let day = selectedDate.getDate();
    if (day < 10) {
        return `0${day}`;
    }
    else {
        return day;
    }
}
function getMonth(selectedDate) {
    if (!selectedDate)
        return;
    let month = selectedDate.getMonth() + 1;
    if (month < 10) {
        return `0${month}`;
    }
    else {
        return month;
    }
}
