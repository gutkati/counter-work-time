"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const DayWeek_module_scss_1 = __importDefault(require("./DayWeek.module.scss"));
const Arrays_1 = require("../../arrays/Arrays");
const DayWeek = ({ date, onClick, selectedDate }) => {
    // const [currentDate, setCurrentDate] = useState<Date>(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const currentDate = new Date();
    const dayWeek = Arrays_1.arrDays[date.getDay()];
    const dayOff = date.getDay();
    //const [isCurrentDay, setIsCurrentDay] = useState(false)
    const isCurrentDay = (0, react_1.useMemo)(() => {
        return currentDate.toDateString() === date.toDateString();
    }, [currentDate, date]);
    // const isSelected = selectedDate
    // ? selectedDate.toDateString() === date.toDateString() &&
    //   selectedDate.getTime() <= currentDate.getTime()
    // : false
    //const markSelectedDay = selectedDate ? isSelected : isCurrentDay
    return ((0, jsx_runtime_1.jsx)("div", { className: `${DayWeek_module_scss_1.default.day__week}
            ${isCurrentDay ? DayWeek_module_scss_1.default.mark__square : ''}
            ${dayOff === 6 || dayOff === 0 ? DayWeek_module_scss_1.default.off__square : ''}
            `, onClick: () => onClick === null || onClick === void 0 ? void 0 : onClick(date), children: (0, jsx_runtime_1.jsx)("span", { children: dayWeek }) }));
};
exports.default = DayWeek;
