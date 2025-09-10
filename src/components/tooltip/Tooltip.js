"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Tooltip_module_scss_1 = __importDefault(require("./Tooltip.module.scss"));
const Tooltip = ({ children, text }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: Tooltip_module_scss_1.default.tooltip, children: [children, (0, jsx_runtime_1.jsx)("span", { className: Tooltip_module_scss_1.default.tooltip__text, children: text })] }));
};
exports.default = Tooltip;
