"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const EditTime_module_scss_1 = __importDefault(require("./EditTime.module.scss"));
const formatDate_1 = require("../../utils/formatDate");
const AddInterval = ({ startHours, startMinutes, endHours, endMinutes, selectedDate, isOpenModalAdd, onClick, onClose, onStartHoursChange, onStartMinutesChange, onEndHoursChange, onEndMinutesChange, onHoursCurrentMonth, intervalType, onIntervalTypeChange }) => {
    const [errorHours, setErrorHours] = (0, react_1.useState)('');
    const [errorMinutes, setErrorMinutes] = (0, react_1.useState)('');
    // const [hoursEnd, setHoursEnd] = useState<number>()
    const handleBlurHours = () => {
        if (!startHours)
            return;
        validateHours(Number(startHours));
    };
    const handleBlurMinutes = () => {
        if (!startMinutes)
            return;
        validateMinutes(Number(startMinutes));
    };
    function validateHours(startHours) {
        let num = /^\d+$/;
        if (!num.test(startHours)) {
            setErrorHours('Число больше 0');
            return false;
        }
        else if (Number(startHours) >= 0 && Number(startHours) < 24) {
            setErrorHours('');
            return true;
        }
        else {
            setErrorHours('Число от 0 до 23');
            return false;
        }
    }
    function validateMinutes(startMinutes) {
        let num = /^\d+$/;
        if (!num.test(startMinutes)) {
            setErrorMinutes('Число больше 0');
            return false;
        }
        else if (Number(startMinutes) >= 0 && Number(startMinutes) < 60) {
            setErrorMinutes('');
            return true;
        }
        else {
            setErrorMinutes('Число от 0 до 59');
            return false;
        }
    }
    function saveUpdateTime(startHours, startMinutes, endHours, endMinutes, intervalType, selectedDate) {
        if (!selectedDate)
            return;
        if (validateHours(startHours) && validateMinutes(startMinutes)) {
            onClick === null || onClick === void 0 ? void 0 : onClick(startHours, startMinutes, endHours, endMinutes, intervalType, selectedDate);
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${EditTime_module_scss_1.default.edit__time} ${EditTime_module_scss_1.default.edit__time_add} ${isOpenModalAdd ? EditTime_module_scss_1.default.visible : ''}`, children: [(0, jsx_runtime_1.jsx)("div", { className: EditTime_module_scss_1.default.date, children: (0, jsx_runtime_1.jsx)("span", { children: selectedDate ? (0, formatDate_1.formatDate)(selectedDate) : '' }) }), (0, jsx_runtime_1.jsx)("h3", { className: EditTime_module_scss_1.default.title, children: "\u0412\u0440\u0435\u043C\u044F \u043D\u0430\u0447\u0430\u043B\u043E \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430" }), (0, jsx_runtime_1.jsx)("button", { className: EditTime_module_scss_1.default.close, onClick: onClose }), (0, jsx_runtime_1.jsxs)("form", { className: EditTime_module_scss_1.default.form, children: [(0, jsx_runtime_1.jsxs)("div", { className: EditTime_module_scss_1.default.box__input, children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u0427\u0430\u0441\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: startHours.toString(), onChange: (e) => onStartHoursChange(Number(e.target.value)), onBlur: handleBlurHours, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__hours}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorHours })] }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u041C\u0438\u043D\u0443\u0442\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: startMinutes.toString(), onChange: (e) => onStartMinutesChange(Number(e.target.value)), onBlur: handleBlurMinutes, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__minutes}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorMinutes })] })] }), (0, jsx_runtime_1.jsx)("h3", { className: EditTime_module_scss_1.default.title, children: "\u0412\u0440\u0435\u043C\u044F \u043E\u043A\u043E\u043D\u0447\u0430\u043D\u0438\u0435 \u0438\u043D\u0442\u0435\u0440\u0432\u0430\u043B\u0430" }), (0, jsx_runtime_1.jsxs)("div", { className: EditTime_module_scss_1.default.box__input, children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u0427\u0430\u0441\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: endHours.toString(), onChange: (e) => onEndHoursChange(Number(e.target.value)), onBlur: handleBlurHours, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__hours}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorHours })] }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u041C\u0438\u043D\u0443\u0442\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: endMinutes.toString(), onChange: (e) => onEndMinutesChange(Number(e.target.value)), onBlur: handleBlurMinutes, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__minutes}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorMinutes })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: EditTime_module_scss_1.default.box__radio, children: [(0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: 'radio', name: 'intervaleType', value: 'work', checked: intervalType === 'work', onChange: () => onIntervalTypeChange('work') }), "\u0420\u0430\u0431\u043E\u0442\u0430"] }), (0, jsx_runtime_1.jsxs)("label", { children: [(0, jsx_runtime_1.jsx)("input", { type: 'radio', name: 'intervaleType', value: 'rest', checked: intervalType === 'rest', onChange: () => onIntervalTypeChange('rest') }), "\u041E\u0442\u0434\u044B\u0445"] })] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: EditTime_module_scss_1.default.btn, onClick: () => saveUpdateTime(startHours, startMinutes, endHours, endMinutes, intervalType, selectedDate), children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] })] }));
};
exports.default = AddInterval;
