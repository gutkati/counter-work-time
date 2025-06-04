"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const ButtonWork_module_scss_1 = __importDefault(require("./ButtonWork.module.scss"));
const ButtonWork = ({ color, activeColor, text, textClick, onClick, isRunning, disabled }) => {
    const [bg, setBg] = (0, react_1.useState)(color);
    return ((0, jsx_runtime_1.jsx)("button", { className: ButtonWork_module_scss_1.default.button, style: isRunning
            ? { background: activeColor, }
            : { background: bg, }, 
        // onMouseEnter={() => {
        //     setBg(activeColor);
        // }}
        // onMouseLeave={() => {
        //     setBg(color);
        // }}
        onClick: onClick, disabled: disabled, children: isRunning ? textClick : text }));
};
exports.default = ButtonWork;
