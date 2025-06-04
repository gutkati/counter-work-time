"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Footer_module_scss_1 = __importDefault(require("./Footer.module.scss"));
const react_router_dom_1 = require("react-router-dom");
const Footer = () => {
    return ((0, jsx_runtime_1.jsxs)("div", { className: Footer_module_scss_1.default.footer, children: [(0, jsx_runtime_1.jsx)("div", { className: Footer_module_scss_1.default.author, children: (0, jsx_runtime_1.jsx)("p", { children: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430 \u0428\u043C\u0435\u043B\u0435\u0432\u0430 \u00A9 2025" }) }), (0, jsx_runtime_1.jsxs)("div", { className: Footer_module_scss_1.default.icons, children: [(0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "https://t.me/gutkati", target: "_blank", children: (0, jsx_runtime_1.jsx)("div", { className: Footer_module_scss_1.default.telegram }) }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "https://github.com/gutkati", target: "_blank", children: (0, jsx_runtime_1.jsx)("div", { className: Footer_module_scss_1.default.github }) })] })] }));
};
exports.default = Footer;
