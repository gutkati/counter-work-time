"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const Main_module_scss_1 = __importDefault(require("./Main.module.scss"));
const ButtonWork_1 = __importDefault(require("../buttons/buttonWork/ButtonWork"));
const _variables_module_scss_1 = __importDefault(require("../../styles/_variables.module.scss"));
const DayWeek_1 = __importDefault(require("../day/DayWeek"));
const react_responsive_1 = require("react-responsive");
const Arrays_1 = require("../../arrays/Arrays");
const EditTime_1 = __importDefault(require("../modal/EditTime"));
const Main = () => {
    // получаем локальную дату
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const [arrShowDays, setArrShowDays] = (0, react_1.useState)([]);
    const isSmallScreen = (0, react_responsive_1.useMediaQuery)({ maxWidth: 1120 });
    const isTabletScreen = (0, react_responsive_1.useMediaQuery)({ maxWidth: 834 });
    const isMobileScreen = (0, react_responsive_1.useMediaQuery)({ maxWidth: 650 });
    const [showMonth, setShowMonth] = (0, react_1.useState)('');
    const [numMonth, setNumMonth] = (0, react_1.useState)();
    const [isInitialzed, setIsInitialzed] = (0, react_1.useState)(false);
    const [isRunning, setIsRunning] = (0, react_1.useState)(false);
    const [seconds, setSeconds] = (0, react_1.useState)(0);
    const [savedSeconds, setSavedSeconds] = (0, react_1.useState)(0); // Секунды, сохранённые до старта
    const [todayStr, setTodayStr] = (0, react_1.useState)(getLocalDateString(new Date()));
    const [startTime, setStartTime] = (0, react_1.useState)(null); // Время старта таймера
    const [currentDate, setCurrentDate] = (0, react_1.useState)(getLocalDateString(new Date()));
    let currentDay = new Date();
    const [selectedDate, setSelectedDate] = (0, react_1.useState)(new Date());
    const [isOpenModalEdit, setIsOpenModalEdit] = (0, react_1.useState)(false);
    const [hoursInput, setHoursInput] = (0, react_1.useState)('0');
    const [minutesInput, setMinutesInput] = (0, react_1.useState)('0');
    const [textRest, setTextRest] = (0, react_1.useState)('');
    const [textWork, setTextWork] = (0, react_1.useState)('Вы сейчас отдыхаете');
    const [hoursPrevWeek, setHoursPrevWeek] = (0, react_1.useState)('');
    const [hoursPrevMonth, setHoursPrevMonth] = (0, react_1.useState)('');
    const [rangeStart, setRangeStart] = (0, react_1.useState)(null);
    const [rangeEnd, setRangeEnd] = (0, react_1.useState)(null);
    const [workedSeconds, setWorkedSeconds] = (0, react_1.useState)(0);
    const [isOpenToolkit, setIsOpenToolkit] = (0, react_1.useState)(false);
    let keyTimer = 'timerSeconds';
    const HOUR_HEIGHT_PX = 18; // 282 / 16 - 282 высота контейнера колонки, 16 max кол-во часов работы
    const secondsInHour = 3600;
    //Проверка смены дня (интервал 1 минута)
    (0, react_1.useEffect)(() => {
        const checkDateChange = () => {
            const now = Date.now();
            const date = new Date();
            const nowDate = getLocalDateString(date);
            // if (currentDate === todayStr) {
            //     setSelectedDate(date); // автообновление даты
            // }
            if (todayStr !== currentDate) {
                saveSecondsLocal(nowDate, 0);
                setTodayStr(nowDate);
                setSeconds(0);
                setSavedSeconds(0);
                setStartTime(now);
            }
            setCurrentDate(nowDate);
        };
        checkDateChange();
        const interval = setInterval(() => {
            checkDateChange();
        }, 60000);
        return () => clearInterval(interval);
    }, [currentDate, seconds]);
    // timer
    // Загрузка данных из localStorage при монтировании
    (0, react_1.useEffect)(() => {
        const data = getDataLocalStorage(keyTimer);
        const todayData = data.find(d => d.date === todayStr);
        if (todayData) {
            setSeconds(todayData.seconds);
        }
        // Устанавливаем флаг, что данные загружены
        setIsInitialzed(true);
    }, []);
    (0, react_1.useEffect)(() => {
        if (isInitialzed)
            saveSecondsLocal(todayStr, seconds);
    }, [seconds]);
    // Основной эффект таймера
    (0, react_1.useEffect)(() => {
        if (!isRunning)
            return;
        const updateSeconds = () => {
            const now = Date.now();
            const elapsedSeconds = Math.round((now - startTime) / 1000); // Прошедшие секунды с момента старта
            const totalSeconds = savedSeconds + elapsedSeconds;
            // Проверяем, не сменилась ли дата
            let currentDateStr = getLocalDateString(new Date());
            if (currentDateStr !== todayStr) {
                // Сохраняем старый день
                saveSecondsLocal(todayStr, totalSeconds);
                // сохраняем новый день
                saveSecondsLocal(currentDateStr, 0);
                // сброс таймера для новой даты
                setTodayStr(currentDateStr);
                setSeconds(0);
                setSavedSeconds(0);
                setStartTime(now);
                return;
            }
            setSeconds(totalSeconds);
        };
        // Запускаем интервал только для визуализации / тиканье
        const interval = setInterval(updateSeconds, 1000);
        // Очистка при размонтировании или остановке
        return () => clearInterval(interval);
    }, [isRunning, startTime, savedSeconds, todayStr]);
    // calendar
    (0, react_1.useEffect)(() => {
        setArrShowDays(getDaysRange());
    }, [isSmallScreen, isTabletScreen, isMobileScreen]);
    (0, react_1.useEffect)(() => {
        if (!Arrays_1.arrMonths.length || !arrShowDays.length)
            return;
        if (arrShowDays.length >= 21) {
            getCurrentMonth(arrShowDays, Arrays_1.arrMonths, 11);
        }
        else if (arrShowDays.length < 20 && arrShowDays.length >= 14) {
            getCurrentMonth(arrShowDays, Arrays_1.arrMonths, 8);
        }
        else if (arrShowDays.length < 14 && arrShowDays.length >= 10) {
            getCurrentMonth(arrShowDays, Arrays_1.arrMonths, 6);
        }
        else if (arrShowDays.length >= 7) {
            getCurrentMonth(arrShowDays, Arrays_1.arrMonths, 4);
        }
    }, [arrShowDays, Arrays_1.arrMonths]);
    (0, react_1.useEffect)(() => {
        getHoursCurrentMonth();
    }, [numMonth]);
    (0, react_1.useEffect)(() => {
        getHoursPrevWeek();
    }, [currentDay]);
    // timer
    const formatNumber = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    };
    const formatHours = (totalSeconds) => {
        const hrs = Math.floor(totalSeconds / 3600).toString();
        const mins = Math.floor((totalSeconds % 3600) / 60).toString();
        if (mins !== '0') {
            return `${hrs}ч${mins}м`;
        }
        else {
            return `${hrs}ч`;
        }
    };
    function getDataLocalStorage(key) {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : [];
    }
    function saveDataLocalStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }
    function saveSecondsLocal(date, seconds) {
        const data = getDataLocalStorage(keyTimer);
        let updated = [...data];
        let savedDay = updated.find(d => d.date === date);
        if (savedDay) {
            savedDay.seconds = seconds;
            //savedSeconds(seconds)
        }
        else {
            updated.push({ date, seconds });
        }
        saveDataLocalStorage(keyTimer, updated);
    }
    const startTimer = () => {
        setStartTime(Date.now());
        setSavedSeconds(seconds);
        setIsRunning(true);
        setTextRest('Вы сейчас работаете');
        setTextWork('');
    };
    const stopTimer = () => {
        if (!isRunning)
            return;
        const now = Date.now();
        const elapsedSeconds = Math.round((now - startTime) / 1000);
        const totalSeconds = savedSeconds + elapsedSeconds;
        setSavedSeconds(totalSeconds);
        setSeconds(totalSeconds);
        saveSecondsLocal(todayStr, totalSeconds);
        setIsRunning(false);
        setTextWork('Вы сейчас отдыхаете');
        setTextRest('');
        getHoursCurrentMonth();
    };
    // calendar
    function getDaysRange() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const startOfCurrentWeek = new Date(today);
        // Определяем начало текущей недели (понедельник)
        startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
        // Определяем начало предыдущей недели (понедельник)
        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
        // Количество дней (7 для маленьких экранов, 14 для остальных)
        const days = [];
        if (isMobileScreen) {
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfCurrentWeek);
                day.setDate(startOfCurrentWeek.getDate() + i);
                days.push(day);
            }
        }
        else if (isTabletScreen) {
            for (let i = 0; i < 10; i++) {
                const day = new Date(startOfCurrentWeek);
                day.setDate(startOfCurrentWeek.getDate() + i);
                days.push(day);
            }
        }
        else if (isSmallScreen) {
            for (let i = 0; i < 14; i++) {
                const day = new Date(startOfPreviousWeek);
                day.setDate(startOfPreviousWeek.getDate() + i);
                days.push(day);
            }
        }
        else {
            for (let i = 0; i < 21; i++) {
                const day = new Date(startOfPreviousWeek);
                day.setDate(startOfPreviousWeek.getDate() + i);
                days.push(day);
            }
        }
        setArrShowDays(days);
        return days;
    }
    // карусель календаря назад на 3 дня
    function showPrevDays() {
        let arrUpdateShowDays = [...arrShowDays];
        let firstDayArr = arrUpdateShowDays[0]; // первый день массива
        for (let i = 1; i < 3; i++) {
            const newDay = new Date(firstDayArr);
            newDay.setDate(firstDayArr.getDate() - i);
            arrUpdateShowDays.unshift(newDay);
        }
        let arrPrevDays;
        if (isMobileScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 7);
        }
        else if (isTabletScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 10);
        }
        else if (isSmallScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 14);
        }
        else {
            arrPrevDays = arrUpdateShowDays.slice(0, 21);
        }
        setArrShowDays(arrPrevDays);
    }
    // карусель календаря вперед на 3 дня
    function showNextDays() {
        let arrUpdateShowDays = [...arrShowDays];
        let lastDayArr = arrUpdateShowDays[arrUpdateShowDays.length - 1]; // последний день массива
        for (let i = 1; i < 3; i++) {
            const newDay = new Date(lastDayArr);
            newDay.setDate(lastDayArr.getDate() + i);
            arrUpdateShowDays.push(newDay);
        }
        let arrPrevDays;
        if (isMobileScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-7);
        }
        else if (isTabletScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-10);
        }
        else if (isSmallScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-14);
        }
        else {
            arrPrevDays = arrUpdateShowDays.slice(-21);
        }
        setArrShowDays(arrPrevDays);
    }
    function getCurrentMonth(arrDate, arrMonths, numDay) {
        let countDay = {};
        for (let date of arrDate) {
            let month = date.getMonth();
            countDay[month] = (countDay[month] || 0) + 1;
        }
        for (let key in countDay) {
            const count = countDay[+key];
            if (count >= numDay) {
                setNumMonth(+key);
                setShowMonth(arrMonths[+key]);
                break;
            }
        }
    }
    function editTimeWork(date) {
        let calendarDays = [...arrShowDays];
        let markDay = calendarDays.find(d => d === date);
        if (!markDay)
            return;
        let dateStr = getLocalDateString(markDay);
        const dataDay = getDataLocalStorage(keyTimer);
        let updated = [...dataDay];
        let savedDay = updated.find(d => d.date === dateStr);
        if (savedDay) {
            const hrs = Math.floor(savedDay.seconds / 3600).toString();
            const mins = Math.floor((savedDay.seconds % 3600) / 60).toString();
            setHoursInput(hrs);
            setMinutesInput(mins);
        }
        else {
            setHoursInput('0');
            setMinutesInput('0');
        }
    }
    function handleInputChange(hours, minutes) {
        const hrs = parseInt(hours, 10) || 0;
        const mins = parseInt(minutes, 10) || 0;
        const totalSeconds = hrs * 3600 + mins * 60;
        const dateStr = getLocalDateString(selectedDate); // или currentDay?
        saveSecondsLocal(dateStr, totalSeconds);
        if (dateStr === currentDate) {
            setSavedSeconds(totalSeconds);
            setSeconds(totalSeconds);
        }
        setIsOpenModalEdit(false); // Закрыть модалку
    }
    function closeModal() {
        setIsOpenModalEdit(false);
    }
    function handleDayClick(date) {
        date.setHours(0, 0, 0, 0);
        currentDay.setHours(0, 0, 0, 0);
        if (date <= currentDay) {
            setSelectedDate(date);
            setIsOpenModalEdit(true);
            editTimeWork(date);
        }
    }
    function getHoursCurrentMonth() {
        const arrData = getDataLocalStorage(keyTimer);
        if (!arrData)
            return;
        let seconds = 0;
        arrData.filter((obj) => {
            const date = new Date(obj.date);
            const month = date.getMonth();
            if (month === numMonth) {
                seconds += obj.seconds;
            }
        });
        setHoursPrevMonth(formatHours(seconds));
    }
    function getHoursPrevWeek() {
        const arrData = getDataLocalStorage(keyTimer);
        if (!arrData)
            return;
        let seconds = 0;
        const today = new Date();
        // Получаем понедельник текущей недели
        const dayOfWeek = today.getDay(); // 0 (вс) — 6 (сб)
        const diffToMonday = (dayOfWeek + 6) % 7; // смещение к понедельнику
        const startOfCurrentWeek = new Date(today);
        startOfCurrentWeek.setDate(today.getDate() - diffToMonday);
        startOfCurrentWeek.setHours(0, 0, 0, 0); // обязательно обнуляем!
        // Получаем понедельник предыдущей недели
        const startOfPreviousWeek = new Date(startOfCurrentWeek);
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7);
        startOfPreviousWeek.setHours(0, 0, 0, 0);
        const endOfPreviousWeek = new Date(startOfPreviousWeek);
        endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6);
        endOfPreviousWeek.setHours(23, 59, 59, 999); // конец дня ВС
        arrData.forEach(obj => {
            const date = new Date(obj.date);
            if (date >= startOfPreviousWeek &&
                date <= endOfPreviousWeek) {
                seconds += obj.seconds;
            }
        });
        setHoursPrevWeek(formatHours(seconds));
    }
    // рассчитать время за выбранный диапазон
    function handleDateClick(date) {
        if (!rangeStart || (rangeStart && rangeEnd)) {
            // если нет начала или оба выбраны — начинаем сначала
            setRangeStart(date);
            setIsOpenToolkit(false);
            setRangeEnd(null);
        }
        else if (date < rangeStart) {
            setRangeEnd(rangeStart);
            setRangeStart(date);
        }
        else if (rangeStart && !rangeEnd) {
            // если есть только начало — ставим конец
            if (date > rangeStart) {
                setRangeEnd(date);
            }
            else {
                // если выбрали дату раньше начала — делаем её началом
                setRangeStart(date);
                setIsOpenToolkit(false);
            }
        }
    }
    const calculateWorkedSeconds = () => {
        if (!rangeStart || !rangeEnd)
            return;
        const arrData = getDataLocalStorage(keyTimer) || [];
        // Нормализуем границы
        const start = new Date(rangeStart);
        const end = new Date(rangeEnd);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        let totalSeconds = 0;
        arrData.forEach(item => {
            const itemDate = new Date(item.date);
            if (itemDate >= start && itemDate <= end) {
                totalSeconds += item.seconds;
            }
        });
        setWorkedSeconds(totalSeconds);
    };
    function closeModalToolkit() {
        setIsOpenToolkit(false);
        setRangeStart(null);
        setRangeEnd(null);
    }
    (0, react_1.useEffect)(() => {
        if (rangeStart && rangeEnd) {
            calculateWorkedSeconds();
            setIsOpenToolkit(true);
        }
    }, [rangeStart, rangeEnd]);
    const getColumns = (date) => {
        let arrData = getDataLocalStorage(keyTimer);
        let newDate = getLocalDateString(date);
        let elDate = arrData.find(el => el.date === newDate);
        if (elDate && elDate.seconds > 0) {
            const workedHours = elDate.seconds / secondsInHour;
            const columnHeight = workedHours * HOUR_HEIGHT_PX;
            return ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__column, children: [(0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.hours__work, children: formatHours(elDate.seconds) }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.day__column, style: {
                            height: `${columnHeight}px`,
                            background: `${columnHeight < 80
                                ? 'linear-gradient(to bottom, #FF9D79 0%, #FF6262 70%)'
                                : columnHeight < 110
                                    ? 'linear-gradient(to bottom, #D9D9D9 0%, #FF9D79 40%, #FF6262 70%)'
                                    : columnHeight > 216 && columnHeight <= 240
                                        ? 'linear-gradient(to top, #D9D9D9 90%, #FF9D79 100%)'
                                        : columnHeight > 240
                                            ? 'linear-gradient(to top, #D9D9D9 80%, #FF9D79 90%, #FF6262 100%)'
                                            : '#D9D9D9'}`
                        } })] }));
        }
        else {
            return (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__column });
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.main, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.box_button, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.button, children: [(0, jsx_runtime_1.jsx)(ButtonWork_1.default, { color: _variables_module_scss_1.default.orangeColor, activeColor: _variables_module_scss_1.default.disabledColor, text: "\u041D\u0430\u0447\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443", textClick: '\u0420\u0430\u0431\u043E\u0442\u0430\u044E', onClick: startTimer, isRunning: isRunning, disabled: isRunning }), (0, jsx_runtime_1.jsx)("span", { children: textWork })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.button, children: [(0, jsx_runtime_1.jsx)(ButtonWork_1.default, { color: _variables_module_scss_1.default.disabledColor, activeColor: _variables_module_scss_1.default.greenColor, text: "\u041E\u0442\u0434\u044B\u0445\u0430\u044E", textClick: '\u041F\u0440\u0435\u0440\u0432\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443', onClick: stopTimer, isRunning: isRunning, disabled: !isRunning }), (0, jsx_runtime_1.jsx)("span", { children: textRest })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.chart, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.chart_field, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.timer, children: formatNumber(seconds) }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.time, children: [(0, jsx_runtime_1.jsxs)("p", { children: ["16", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }), (0, jsx_runtime_1.jsx)("hr", { className: Main_module_scss_1.default.time__top }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: ["8", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }) }), (0, jsx_runtime_1.jsxs)("p", { children: ["1", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }), (0, jsx_runtime_1.jsx)("hr", { className: Main_module_scss_1.default.time__bottom })] }), (0, jsx_runtime_1.jsx)(EditTime_1.default, { hours: hoursInput, minutes: minutesInput, selectedDate: selectedDate, isOpenModal: isOpenModalEdit, onClick: handleInputChange, onClose: closeModal, onHoursChange: setHoursInput, onMinutesChange: setMinutesInput, onHoursCurrentMonth: getHoursCurrentMonth }), (0, jsx_runtime_1.jsxs)("div", { className: `${Main_module_scss_1.default.info__toolkit} ${isOpenToolkit ? Main_module_scss_1.default.visible__toolkit : ''}`, children: [(0, jsx_runtime_1.jsx)("button", { className: Main_module_scss_1.default.close__toolkit, onClick: closeModalToolkit }), (0, jsx_runtime_1.jsxs)("p", { className: Main_module_scss_1.default.text__toolkit, children: ["\u0421 ", rangeStart === null || rangeStart === void 0 ? void 0 : rangeStart.toLocaleDateString(), " \u043F\u043E ", rangeEnd === null || rangeEnd === void 0 ? void 0 : rangeEnd.toLocaleDateString(), " \u0432\u044B \u043E\u0442\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u0438 ", formatHours(workedSeconds)] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__container, children: arrShowDays.map((date, index) => ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__day, children: [getColumns(date), (0, jsx_runtime_1.jsx)(DayWeek_1.default, { date: date, onClick: handleDayClick, selectedDate: selectedDate }, index), (0, jsx_runtime_1.jsx)("div", { className: `${Main_module_scss_1.default.day__num}
                                    ${date.getMonth() !== numMonth ? Main_module_scss_1.default.day__pale : ''}
                                    ${rangeStart === date ? Main_module_scss_1.default.day__mark : ''}
                                    ${rangeEnd === date ? Main_module_scss_1.default.day__mark : ''}`, onClick: () => handleDateClick(date), children: (0, jsx_runtime_1.jsx)("span", { children: date.getDate() }) })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__month, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.hours, children: (0, jsx_runtime_1.jsxs)("p", { className: Main_module_scss_1.default.hours__prev, children: ["\u0427\u0430\u0441\u044B \u0437\u0430 \u043F\u0440\u043E\u0448\u043B\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E: ", (0, jsx_runtime_1.jsx)("span", { children: hoursPrevWeek })] }) }), (0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.month, children: showMonth }), (0, jsx_runtime_1.jsx)("div", { className: `${Main_module_scss_1.default.hours} ${Main_module_scss_1.default.hours_month}`, children: (0, jsx_runtime_1.jsxs)("p", { className: Main_module_scss_1.default.hours__prev, children: ["\u0427\u0430\u0441\u044B \u0437\u0430 ", showMonth, ": ", (0, jsx_runtime_1.jsx)("span", { children: hoursPrevMonth })] }) })] })] }), (0, jsx_runtime_1.jsx)("button", { className: `${Main_module_scss_1.default.chart__arrow} ${Main_module_scss_1.default.chart__arrow_left}`, onClick: showPrevDays }), (0, jsx_runtime_1.jsx)("button", { className: `${Main_module_scss_1.default.chart__arrow} ${Main_module_scss_1.default.chart__arrow_right}`, onClick: showNextDays })] })] }));
};
exports.default = Main;
