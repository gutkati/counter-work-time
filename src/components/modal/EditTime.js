"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const EditTime_module_scss_1 = __importDefault(require("./EditTime.module.scss"));
const EditTime = ({ hours, minutes, isOpenModal, onClick, onClose, onHoursChange, onMinutesChange }) => {
    const [errorHours, setErrorHours] = (0, react_1.useState)('');
    const [errorMinutes, setErrorMinutes] = (0, react_1.useState)('');
    const handleBlurHours = () => {
        if (!hours)
            return;
        validateHours(Number(hours));
    };
    const handleBlurMinutes = () => {
        if (!minutes)
            return;
        validateMinutes(Number(minutes));
    };
    function validateHours(hours) {
        let num = /^\d+$/;
        if (hours === "") {
            setErrorHours('Введите количество');
            return false;
        }
        else if (!num.test(hours)) {
            setErrorHours('Число больше 0');
            return false;
        }
        else if (Number(hours) >= 0 && Number(hours) < 24) {
            setErrorHours('');
            return true;
        }
        else {
            setErrorHours('Число от 0 до 23');
            return false;
        }
    }
    function validateMinutes(minutes) {
        let num = /^\d+$/;
        if (minutes === "") {
            setErrorMinutes('Введите количество');
            return false;
        }
        else if (!num.test(minutes)) {
            setErrorMinutes('Число больше 0');
            return false;
        }
        else if (Number(minutes) >= 0 && Number(minutes) < 60) {
            setErrorMinutes('');
            return true;
        }
        else {
            setErrorMinutes('Число от 0 до 59');
            return false;
        }
    }
    function saveUpdateTime(hours, minutes) {
        if (!hours || !minutes)
            return;
        if (validateHours(hours) && validateMinutes(minutes)) {
            onClick === null || onClick === void 0 ? void 0 : onClick(hours, minutes);
        }
    }
    return ((0, jsx_runtime_1.jsxs)("div", { className: `${EditTime_module_scss_1.default.edit__time} ${isOpenModal ? EditTime_module_scss_1.default.visible : ''}`, children: [(0, jsx_runtime_1.jsx)("h3", { className: EditTime_module_scss_1.default.title, children: "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432\u0440\u0435\u043C\u044F" }), (0, jsx_runtime_1.jsx)("button", { className: EditTime_module_scss_1.default.close, onClick: onClose }), (0, jsx_runtime_1.jsxs)("form", { className: EditTime_module_scss_1.default.form, children: [(0, jsx_runtime_1.jsxs)("div", { className: EditTime_module_scss_1.default.box__input, children: [(0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u0427\u0430\u0441\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: hours, onChange: (e) => onHoursChange(e.target.value), onBlur: handleBlurHours, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__hours}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorHours })] }), (0, jsx_runtime_1.jsxs)("label", { htmlFor: "", children: ["\u041C\u0438\u043D\u0443\u0442\u044B", (0, jsx_runtime_1.jsx)("input", { type: "number", value: minutes, onChange: (e) => onMinutesChange(e.target.value), onBlur: handleBlurMinutes, className: `${EditTime_module_scss_1.default.input} ${EditTime_module_scss_1.default.input__minutes}` }), (0, jsx_runtime_1.jsx)("span", { className: EditTime_module_scss_1.default.text__error, children: errorMinutes })] })] }), (0, jsx_runtime_1.jsx)("button", { type: 'button', className: EditTime_module_scss_1.default.btn, onClick: () => saveUpdateTime(hours, minutes), children: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C" })] })] }));
};
exports.default = EditTime;
