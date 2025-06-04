"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./styles/index.scss");
const Header_1 = __importDefault(require("./components/header/Header"));
const Footer_1 = __importDefault(require("./components/footer/Footer"));
const Main_1 = __importDefault(require("./components/main/Main"));
function App() {
    return ((0, jsx_runtime_1.jsxs)("div", { className: "app", children: [(0, jsx_runtime_1.jsx)(Header_1.default, { text: "\u0422\u0440\u0435\u043A\u0435\u0440 \u0440\u0430\u0431\u043E\u0447\u0435\u0433\u043E \u0432\u0440\u0435\u043C\u0435\u043D\u0438" }), (0, jsx_runtime_1.jsx)(Main_1.default, {}), (0, jsx_runtime_1.jsx)(Footer_1.default, {})] }));
}
exports.default = App;
