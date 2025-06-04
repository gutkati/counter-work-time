"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Header_module_scss_1 = __importDefault(require("./Header.module.scss"));
const Header = ({ text }) => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: Header_module_scss_1.default.header, children: [(0, jsx_runtime_1.jsxs)("div", { className: Header_module_scss_1.default.logo, children: [(0, jsx_runtime_1.jsx)("div", { className: Header_module_scss_1.default.logo_img, children: (0, jsx_runtime_1.jsxs)("div", { className: Header_module_scss_1.default.clock, children: [(0, jsx_runtime_1.jsx)("div", { className: `${Header_module_scss_1.default.hour_hand} ${Header_module_scss_1.default.hand}` }), (0, jsx_runtime_1.jsx)("div", { className: `${Header_module_scss_1.default.minute_hand} ${Header_module_scss_1.default.hand}` })] }) }), (0, jsx_runtime_1.jsx)("span", { children: "jtrack.prx.by" })] }), (0, jsx_runtime_1.jsx)("div", { className: Header_module_scss_1.default.title, children: (0, jsx_runtime_1.jsx)("h1", { children: text }) })] }));
};
exports.default = Header;
