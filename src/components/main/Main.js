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
const formatDate_1 = require("../../utils/formatDate");
const AddInterval_1 = __importDefault(require("../modal/AddInterval"));
const Tooltip_1 = __importDefault(require("../tooltip/Tooltip"));
const nanoid_1 = require("nanoid");
const Main = () => {
    // получаем локальную дату
    const getLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    let keyTimer = 'timerSeconds';
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
    const [deficitHours, setDeficitHours] = (0, react_1.useState)('');
    const [rangeStart, setRangeStart] = (0, react_1.useState)(null);
    const [rangeEnd, setRangeEnd] = (0, react_1.useState)(null);
    const [workedSeconds, setWorkedSeconds] = (0, react_1.useState)(0);
    const [isOpenToolkit, setIsOpenToolkit] = (0, react_1.useState)(false);
    const [timeIntervals, setTimeIntervals] = (0, react_1.useState)([]);
    let [counterWeekDay, setCounterWeekDay] = (0, react_1.useState)('');
    let [remainingHoursWeek, setRemainingHoursWeek] = (0, react_1.useState)('');
    let [counterMonthDay, setCounterMonthDay] = (0, react_1.useState)('');
    const [lastStopTime, setLastStopTime] = (0, react_1.useState)(null);
    const [isOpenModalAdd, setIsOpenModalAdd] = (0, react_1.useState)(false);
    const [startIntervalHours, setStartIntervalHours] = (0, react_1.useState)(0);
    const [starIntervaltMinutes, setStartIntervalMinutes] = (0, react_1.useState)(0);
    const [endIntervalHours, setEndIntervalHours] = (0, react_1.useState)(0);
    const [endIntervalMinutes, setEndIntervalMinutes] = (0, react_1.useState)(0);
    const [intervalType, setIntervalType] = (0, react_1.useState)('work');
    const [editingInterval, setEditingInterval] = (0, react_1.useState)(null);
    const [daysData, setDaysData] = (0, react_1.useState)(() => getDataLocalStorage(keyTimer));
    const [isVisibleWeek, setIsVisibleWeek] = (0, react_1.useState)(false);
    const [isVisibleMonth, setIsVisibleMonth] = (0, react_1.useState)(false);
    const colorToType = (color) => {
        return color === '#FF9D79' ? 'work' : 'rest';
    };
    const typeToColor = (type) => {
        return type === 'work' ? '#FF9D79' : '#018c79';
    };
    const HOUR_HEIGHT_PX = 13; // 282 / 16 - 282 высота контейнера колонки, 16 max кол-во часов работы
    const secondsInHour = 3600;
    //Проверка смены дня (интервал 1 минута)
    (0, react_1.useEffect)(() => {
        const checkDateChange = () => {
            const now = Date.now();
            const date = new Date();
            const nowDate = getLocalDateString(date);
            if (todayStr !== currentDate) {
                saveSecondsLocal(todayStr, seconds, timeIntervals);
                // Создаем новый интервал для нового дня
                const newWork = {
                    id: (0, nanoid_1.nanoid)(16),
                    date: nowDate,
                    time: 0,
                    start: now,
                    color: _variables_module_scss_1.default.orangeColor,
                };
                saveSecondsLocal(nowDate, 0, [newWork]);
                setTodayStr(nowDate);
                setSeconds(0);
                setSavedSeconds(0);
                setStartTime(now);
                // !!!!!
                setSelectedDate(new Date());
                setTimeIntervals([newWork]);
            }
            setCurrentDate(nowDate);
        };
        checkDateChange();
        const interval = setInterval(() => {
            checkDateChange();
        }, 60000);
        return () => clearInterval(interval);
    }, [currentDate, seconds, todayStr, timeIntervals]);
    // timer
    // Загрузка данных из localStorage при монтировании
    (0, react_1.useEffect)(() => {
        const data = getDataLocalStorage(keyTimer);
        const todayData = data.find(d => d.date === todayStr);
        if (todayData) {
            setSeconds(todayData.seconds);
            setTimeIntervals(todayData.timeIntervals || []);
        }
        // Устанавливаем флаг, что данные загружены
        setIsInitialzed(true);
    }, []);
    (0, react_1.useEffect)(() => {
        if (isInitialzed && getLocalDateString(selectedDate) === todayStr) {
            saveSecondsLocal(todayStr, seconds, timeIntervals);
        }
    }, [seconds, timeIntervals, isInitialzed, selectedDate]);
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
                saveSecondsLocal(todayStr, totalSeconds, timeIntervals);
                // сохраняем новый день
                const newWork = {
                    id: (0, nanoid_1.nanoid)(16), // или nanoid(16)
                    date: currentDateStr,
                    time: 0,
                    start: now,
                    color: _variables_module_scss_1.default.orangeColor,
                };
                saveSecondsLocal(currentDateStr, 0, [newWork]);
                // сброс таймера для новой даты
                setTodayStr(currentDateStr);
                //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                setSelectedDate(new Date());
                setSeconds(0);
                setSavedSeconds(0);
                setStartTime(now);
                setTimeIntervals([newWork]);
                return;
            }
            setSeconds(totalSeconds);
            // 🔹 Обновляем последний интервал "на лету"
            setTimeIntervals(prev => {
                if (!prev.length)
                    return prev;
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last.color === _variables_module_scss_1.default.orangeColor) {
                    last.time = now - last.start; // обновляем длительность
                }
                return updated;
            });
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
    (0, react_1.useEffect)(() => {
        if (rangeStart && rangeEnd) {
            calculateWorkedSeconds();
            setIsOpenToolkit(true);
        }
    }, [rangeStart, rangeEnd]);
    // useEffect(() => {
    //     if (!selectedDate) return;
    //     const dataDay: TimerData[] = getDataLocalStorage(keyTimer);
    //     const currentData = dataDay.find(day => day.date === getLocalDateString(selectedDate));
    //     if (currentData && currentData.timeIntervals) {
    //         setTimeIntervals(currentData.timeIntervals);
    //     } else {
    //         setTimeIntervals([]);
    //     }
    // }, [selectedDate]);
    // useEffect(() => {
    //     if (!selectedDate) return;
    //     const currentDay = daysData.find(day => day.date === getLocalDateString(selectedDate));
    //     setTimeIntervals(currentDay?.timeIntervals || []);
    // }, [selectedDate, daysData]);
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
    function saveSecondsLocal(date, seconds, timeIntervals) {
        const data = getDataLocalStorage(keyTimer);
        let updated = [...data];
        let savedDay = updated.find(d => d.date === date);
        if (savedDay) {
            savedDay.seconds = seconds;
            savedDay.timeIntervals = timeIntervals;
        }
        else {
            updated.push({ date, seconds, timeIntervals });
        }
        saveDataLocalStorage(keyTimer, updated);
    }
    function deleteDayLocal(key, date) {
        let arrDays = getDataLocalStorage(key);
        arrDays = arrDays.filter(d => d.date !== date);
        saveDataLocalStorage(key, arrDays);
    }
    const startTimer = () => {
        const selectedDateStr = getLocalDateString(currentDay);
        if (isRunning && selectedDateStr === todayStr)
            return;
        const now = Date.now();
        const nowDateStr = getLocalDateString(new Date());
        // Берём актуальные интервалы для текущего дня
        const dataDay = getDataLocalStorage(keyTimer);
        const currentData = dataDay.find(day => day.date === selectedDateStr);
        const actualIntervals = (currentData === null || currentData === void 0 ? void 0 : currentData.timeIntervals) || [];
        let updatedIntervals = [...actualIntervals];
        // === Проверяем, был ли перерыв и в том же ли дне он закончился ===
        if (lastStopTime && updatedIntervals.length !== 0) {
            const stopDateStr = getLocalDateString(new Date(lastStopTime));
            // Перерыв в том же дне → сохраняем зелёный интервал
            if (stopDateStr === nowDateStr) {
                const restDuration = now - lastStopTime;
                if (restDuration > 1000) {
                    const restLogItem = {
                        id: (0, nanoid_1.nanoid)(16),
                        date: nowDateStr,
                        time: 0,
                        start: lastStopTime,
                        color: _variables_module_scss_1.default.greenColor // отдых
                    };
                    updatedIntervals = saveIntervalTime(updatedIntervals, restLogItem, new Date());
                }
            }
            // Если дата изменилась → ничего не добавляем, т.к. новый день начинается с работы
        }
        if (updatedIntervals.length === 0) {
            const newWorkInterval = {
                id: (0, nanoid_1.nanoid)(16),
                date: currentDate,
                time: 0,
                start: now,
                color: _variables_module_scss_1.default.orangeColor
            };
        }
        // 🔹 Создаём новый рабочий интервал
        const newWorkInterval = {
            id: (0, nanoid_1.nanoid)(16),
            date: currentDate,
            time: 0,
            start: now,
            color: _variables_module_scss_1.default.orangeColor
        };
        updatedIntervals = [...updatedIntervals, newWorkInterval];
        // Просто актуализируем, но тоже только если выбран сегодня
        if (getLocalDateString(selectedDate) === todayStr) {
            setTimeIntervals(updatedIntervals);
        }
        setStartTime(Date.now());
        setSavedSeconds(seconds);
        setIsRunning(true);
        setTextRest('Вы сейчас работаете');
        setTextWork('');
    };
    const stopTimer = () => {
        console.log('curentDateStop', currentDate);
        const selectedDateStr = getLocalDateString(currentDay);
        if (!isRunning || !startTime)
            return;
        const now = Date.now();
        const elapsedMs = now - startTime;
        const elapsedSeconds = Math.round(elapsedMs / 1000);
        const totalSeconds = savedSeconds + elapsedSeconds;
        // Берём актуальные интервалы для выбранного дня
        const dataDay = getDataLocalStorage(keyTimer);
        const currentData = dataDay.find(day => day.date === todayStr);
        const actualIntervals = (currentData === null || currentData === void 0 ? void 0 : currentData.timeIntervals) || [];
        // 🔹 обновляем последний рабочий интервал
        const updatedIntervals = actualIntervals.map((int, i, arr) => i === arr.length - 1 && int.color === _variables_module_scss_1.default.orangeColor
            ? Object.assign(Object.assign({}, int), { time: elapsedMs }) : int);
        saveSecondsLocal(todayStr, totalSeconds, updatedIntervals);
        // В state заливаем ТОЛЬКО если выбран именно сегодняшний день
        if (getLocalDateString(selectedDate) === todayStr) {
            setTimeIntervals(updatedIntervals);
        }
        // Актуализируем daysData (чтобы при клике по дням данные не затирались)
        const updatedDays = dataDay.map(day => day.date === todayStr
            ? Object.assign(Object.assign({}, day), { seconds: totalSeconds, timeIntervals: updatedIntervals }) : day);
        setDaysData(updatedDays);
        setSavedSeconds(totalSeconds);
        setSeconds(totalSeconds);
        setIsRunning(false);
        setTextWork('Вы сейчас отдыхаете');
        setTextRest('');
        getHoursCurrentMonth();
        setLastStopTime(now);
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
        console.log('intervals#', timeIntervals);
        if (totalSeconds <= 0) {
            deleteDayLocal(keyTimer, dateStr);
            setSeconds(totalSeconds);
            setTimeIntervals([]);
            console.log('intervals', timeIntervals);
        }
        else {
            saveSecondsLocal(dateStr, totalSeconds, timeIntervals);
        }
        if (dateStr === currentDate && totalSeconds > 0) {
            setSavedSeconds(totalSeconds);
            setSeconds(totalSeconds);
        }
        setIsOpenModalEdit(false); // Закрыть модалку
    }
    function closeModal() {
        setIsOpenModalEdit(false);
        setIsOpenModalAdd(false);
    }
    function handleDayClick(date) {
        date.setHours(0, 0, 0, 0);
        currentDay.setHours(0, 0, 0, 0);
        if (date <= currentDay) {
            setSelectedDate(date);
            setIsOpenModalEdit(true);
            editTimeWork(date);
            getColumnDay(date);
        }
    }
    function getHoursCurrentMonth() {
        const arrData = getDataLocalStorage(keyTimer);
        if (!arrData)
            return;
        let seconds = 0;
        let counterDay = 0;
        let workDay = 0;
        arrData.filter((obj) => {
            const date = new Date(obj.date);
            const month = date.getMonth();
            if (month === numMonth) {
                seconds += obj.seconds;
                counterDay += 1;
                if (obj.seconds > 0) {
                    workDay += 1;
                }
            }
        });
        setHoursPrevMonth(formatHours(seconds));
        if (seconds > 0 && workDay > 0) {
            let sumCounterDay = seconds / workDay;
            setCounterMonthDay(formatHours(sumCounterDay));
        }
        else {
            setCounterMonthDay('0');
        }
        // считаем норму часов за месяц
        const year = new Date().getFullYear();
        if (typeof numMonth === "number") {
            const totalWorkDays = getWorkDaysInMonth(year, numMonth);
            const planSeconds = totalWorkDays * 8 * 3600;
            const deficitSeconds = planSeconds - seconds;
            setDeficitHours(formatHours(Math.max(deficitSeconds, 0)));
        }
    }
    // утилита для расчёта рабочих дней месяца
    function getWorkDaysInMonth(year, month) {
        const date = new Date(year, month, 1);
        let workDays = 0;
        while (date.getMonth() === month) {
            const day = date.getDay();
            if (day !== 0 && day !== 6) { // 0 - воскресенье, 6 - суббота
                workDays++;
            }
            date.setDate(date.getDate() + 1);
        }
        return workDays;
    }
    function getHoursPrevWeek() {
        const arrData = getDataLocalStorage(keyTimer);
        if (!arrData || arrData.length === 0)
            return;
        let seconds = 0;
        let counterDay = 0;
        let workDay = 0;
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
                counterDay += 1;
                if (obj.seconds > 0) {
                    workDay += 1;
                }
            }
        });
        setHoursPrevWeek(formatHours(seconds));
        let remainder = (40 * 3600) - seconds;
        setRemainingHoursWeek(formatHours(remainder));
        if (seconds > 0 && workDay > 0) {
            let sumCounter = seconds / workDay;
            setCounterWeekDay(formatHours(sumCounter));
        }
        else {
            setCounterWeekDay('0');
        }
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
    const getColumns = (date) => {
        let arrData = getDataLocalStorage(keyTimer);
        let newDate = getLocalDateString(date);
        let elDate = arrData.find(el => el.date === newDate);
        if (elDate && elDate.seconds > 0) {
            const workedHours = elDate.seconds / secondsInHour;
            const columnHeight = workedHours * HOUR_HEIGHT_PX;
            return ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__column, onClick: () => handleColumnClick(date), children: [(0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.hours__work, children: formatHours(elDate.seconds) }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.day__column, style: {
                            height: `${columnHeight}px`,
                            background: `${columnHeight < 50
                                ? 'linear-gradient(to bottom, #FF9D79 0%, #FF6262 70%)'
                                : columnHeight < 78
                                    ? 'linear-gradient(to bottom, #D9D9D9 0%, #FF9D79 40%, #FF6262 70%)'
                                    : columnHeight > 140 && columnHeight <= 156
                                        ? 'linear-gradient(to top, #D9D9D9 90%, #FF9D79 100%)'
                                        : columnHeight > 156
                                            ? 'linear-gradient(to top, #D9D9D9 80%, #FF9D79 90%, #FF6262 100%)'
                                            : '#D9D9D9'}`
                        } })] }));
        }
        else {
            return (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__column });
        }
    };
    // intervals
    function handleColumnClick(date) {
        const dateStr = getLocalDateString(date);
        // Блокируем только если это сегодня и таймер запущен
        if (isRunning && dateStr === todayStr) {
            alert("Нельзя редактировать активный день, таймер запущен");
            return;
        }
        if (date <= currentDay) {
            setSelectedDate(date);
            getColumnDay(date);
        }
    }
    function getColumnDay(date) {
        setSelectedDate(date); // только меняем дату
        const dataDay = getDataLocalStorage(keyTimer);
        const currentData = dataDay.find(day => day.date === getLocalDateString(date));
        if (currentData && currentData.timeIntervals) {
            setTimeIntervals(currentData.timeIntervals);
        }
        else {
            setTimeIntervals([]);
        }
    }
    function saveIntervalTime(arrIntervals, newLogItem, forDate) {
        const update = [...(arrIntervals || []), newLogItem];
        const dateStr = getLocalDateString(forDate);
        saveIntervalLocal(dateStr, update);
        return update;
    }
    function saveIntervalLocal(date, timeIntervals) {
        const data = getDataLocalStorage(keyTimer);
        let updated = [...data];
        let savedDay = updated.find(d => d.date === date);
        if (savedDay) {
            savedDay.timeIntervals = timeIntervals;
        }
        // else {
        //     updated.push({date, seconds, timeIntervals})
        // }
        saveDataLocalStorage(keyTimer, updated);
    }
    function addInterval() {
        setIntervalType('work');
        setEditingInterval(null);
        setIsOpenModalAdd(true);
        setStartIntervalHours(0);
        setStartIntervalMinutes(0);
        setEndIntervalHours(0);
        setEndIntervalMinutes(0);
    }
    function handleUpdateInterval(id) {
        let currentInterval = timeIntervals.find(interval => interval.id === id);
        if (currentInterval) {
            setIntervalType(colorToType(currentInterval.color));
            setEditingInterval(currentInterval); // сохраняем что редактируем
            setStartIntervalHours(new Date(currentInterval.start).getHours());
            setStartIntervalMinutes(new Date(currentInterval.start).getMinutes());
            setEndIntervalHours(new Date(currentInterval.start + currentInterval.time).getHours());
            setEndIntervalMinutes(new Date(currentInterval.start + currentInterval.time).getMinutes());
            setIsOpenModalAdd(true);
        }
    }
    function handleSaveInterval(startHours, startMinutes, endHours, endMinutes, colorInterval, forDate) {
        var _a, _b;
        const dateStr = getLocalDateString(forDate);
        if (isRunning && dateStr === todayStr) {
            alert("Нельзя редактировать активный день, таймер запущен");
            return;
        }
        const dayIndex = daysData.findIndex(day => day.date === dateStr);
        const day = (_a = daysData[dayIndex]) !== null && _a !== void 0 ? _a : { date: dateStr, seconds: 0, timeIntervals: [] };
        let intervals = [...day.timeIntervals];
        // Если всё по нулям → удалить
        if (startHours === 0 && startMinutes === 0 && endHours === 0 && endMinutes === 0) {
            if (editingInterval) {
                intervals = intervals.filter(int => int.id !== editingInterval.id);
                setEditingInterval(null);
            }
        }
        else if (editingInterval) {
            // === Редактирование ===
            const startDate = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate(), startHours, startMinutes);
            const endDate = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate(), endHours, endMinutes);
            const elapsedMs = endDate.getTime() - startDate.getTime();
            intervals = intervals.map(int => int.id === editingInterval.id
                ? Object.assign(Object.assign({}, int), { time: elapsedMs, start: startDate.getTime(), color: typeToColor(colorInterval) }) : int);
            setEditingInterval(null);
        }
        else {
            // === Добавление ===
            const startDate = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate(), startHours, startMinutes);
            const endDate = new Date(forDate.getFullYear(), forDate.getMonth(), forDate.getDate(), endHours, endMinutes);
            const elapsedMs = endDate.getTime() - startDate.getTime();
            const newLogItem = {
                id: (0, nanoid_1.nanoid)(16),
                date: dateStr,
                time: elapsedMs,
                start: startDate.getTime(),
                color: typeToColor(colorInterval),
            };
            intervals = saveIntervalTime(intervals, newLogItem, forDate);
        }
        // 🔹 Обновляем state для текущего рендера
        if (dateStr === getLocalDateString(selectedDate)) {
            setTimeIntervals(intervals);
        }
        // Обновляем state
        const updatedDays = [...daysData];
        updatedDays[dayIndex] = Object.assign(Object.assign({}, day), { timeIntervals: intervals });
        setDaysData(updatedDays);
        // Сохраняем в localStorage
        saveSecondsLocal(dateStr, (_b = day === null || day === void 0 ? void 0 : day.seconds) !== null && _b !== void 0 ? _b : 0, intervals);
        setIsOpenModalAdd(false);
    }
    const getIntervalWork = (id, date, color) => {
        let arrData = getDataLocalStorage(keyTimer);
        let elDate = arrData.find(el => el.date === date);
        let widthInPx = 50;
        if (elDate && elDate.seconds > 0) {
            const workedHours = elDate.seconds / secondsInHour;
            if (elDate.seconds > 3600) {
                widthInPx = workedHours * HOUR_HEIGHT_PX;
            }
            return ((0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.interval, style: {
                    background: color,
                    width: `${widthInPx}px`
                }, onClick: () => handleUpdateInterval(id) }));
        }
        else {
            return (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__column });
        }
    };
    const renderIntervals = (date) => {
        const arrData = getDataLocalStorage(keyTimer);
        const dateStr = getLocalDateString(date);
        const elDate = arrData.find(el => el.date === dateStr);
        if (!elDate || !elDate.timeIntervals) {
            return (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__intervals_empty });
        }
        return ((0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__intervals_container, children: elDate.timeIntervals.map((int) => ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.intervalWrapper, children: [(0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.time__interval, children: int.start
                            ? new Date(int.start).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            })
                            : '' }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.interval, style: {
                            background: int.color,
                            width: `${Math.max(50, Math.floor(int.time / 1000 / 60))}px`
                        }, onClick: () => handleUpdateInterval(int.id) })] }, int.id))) }));
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.main, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.box_button, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.button, children: [(0, jsx_runtime_1.jsx)(ButtonWork_1.default, { color: _variables_module_scss_1.default.orangeColor, activeColor: _variables_module_scss_1.default.disabledColor, text: "\u041D\u0430\u0447\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443", textClick: '\u0420\u0430\u0431\u043E\u0442\u0430\u044E', onClick: startTimer, isRunning: isRunning, disabled: isRunning }), (0, jsx_runtime_1.jsx)("span", { children: textWork })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.button, children: [(0, jsx_runtime_1.jsx)(ButtonWork_1.default, { color: _variables_module_scss_1.default.disabledColor, activeColor: _variables_module_scss_1.default.greenColor, text: "\u041E\u0442\u0434\u044B\u0445\u0430\u044E", textClick: '\u041F\u0440\u0435\u0440\u0432\u0430\u0442\u044C \u0440\u0430\u0431\u043E\u0442\u0443', onClick: stopTimer, isRunning: isRunning, disabled: !isRunning }), (0, jsx_runtime_1.jsx)("span", { children: textRest })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.chart, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.chart_field, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.timer, children: formatNumber(seconds) }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.time, children: [(0, jsx_runtime_1.jsxs)("p", { children: ["16", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }), (0, jsx_runtime_1.jsx)("hr", { className: Main_module_scss_1.default.time__top }), (0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsxs)("p", { children: ["8", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }) }), (0, jsx_runtime_1.jsxs)("p", { children: ["1", (0, jsx_runtime_1.jsx)("span", { children: "\u0447" })] }), (0, jsx_runtime_1.jsx)("hr", { className: Main_module_scss_1.default.time__bottom })] }), (0, jsx_runtime_1.jsx)(EditTime_1.default, { hours: hoursInput, minutes: minutesInput, selectedDate: selectedDate, isOpenModal: isOpenModalEdit, onClick: handleInputChange, onClose: closeModal, onHoursChange: setHoursInput, onMinutesChange: setMinutesInput, onHoursCurrentMonth: getHoursCurrentMonth }), (0, jsx_runtime_1.jsxs)("div", { className: `${Main_module_scss_1.default.info__toolkit} ${isOpenToolkit ? Main_module_scss_1.default.visible__toolkit : ''}`, children: [(0, jsx_runtime_1.jsx)("button", { className: Main_module_scss_1.default.close__toolkit, onClick: closeModalToolkit }), (0, jsx_runtime_1.jsxs)("p", { className: Main_module_scss_1.default.text__toolkit, children: ["\u0421 ", rangeStart === null || rangeStart === void 0 ? void 0 : rangeStart.toLocaleDateString(), " \u043F\u043E ", rangeEnd === null || rangeEnd === void 0 ? void 0 : rangeEnd.toLocaleDateString(), " \u0432\u044B \u043E\u0442\u0440\u0430\u0431\u043E\u0442\u0430\u043B\u0438 ", formatHours(workedSeconds)] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__container, children: arrShowDays.map((date, index) => ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__day, children: [getColumns(date), (0, jsx_runtime_1.jsx)(DayWeek_1.default, { date: date, onClick: handleDayClick, selectedDate: selectedDate }, index), (0, jsx_runtime_1.jsx)("div", { className: `${Main_module_scss_1.default.day__num}
                                    ${date.getMonth() !== numMonth ? Main_module_scss_1.default.day__pale : ''}
                                    ${rangeStart === date ? Main_module_scss_1.default.day__mark : ''}
                                    ${rangeEnd === date ? Main_module_scss_1.default.day__mark : ''}`, onClick: () => handleDateClick(date), children: (0, jsx_runtime_1.jsx)("span", { children: date.getDate() }) })] }, index))) }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__month, children: [(0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.hours, children: [isVisibleWeek && ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.hours__prev, children: [(0, jsx_runtime_1.jsx)(Tooltip_1.default, { children: (0, jsx_runtime_1.jsxs)("span", { className: Main_module_scss_1.default.hours__week, children: [hoursPrevWeek, "/", remainingHoursWeek] }), text: "\u041E\u0442\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0435/\u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C" }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { children: (0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.hours__week, children: counterWeekDay }), text: "\u0412 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0437\u0430 \u0434\u0435\u043D\u044C" })] })), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.hours__info, children: [(0, jsx_runtime_1.jsx)("p", { className: Main_module_scss_1.default.hours__text, children: "\u0427\u0430\u0441\u044B \u0437\u0430 \u043F\u0440\u043E\u0448\u043B\u0443\u044E \u043D\u0435\u0434\u0435\u043B\u044E" }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.toggleBtn, onClick: () => setIsVisibleWeek(prev => !prev), children: isVisibleWeek ? "▲" : "▼" })] })] }), (0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.month, children: showMonth }), (0, jsx_runtime_1.jsxs)("div", { className: `${Main_module_scss_1.default.hours} ${Main_module_scss_1.default.hours_month}`, children: [isVisibleMonth && ((0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.hours__prev, children: [(0, jsx_runtime_1.jsx)(Tooltip_1.default, { children: (0, jsx_runtime_1.jsxs)("span", { className: Main_module_scss_1.default.hours__week, children: [hoursPrevMonth, "/", deficitHours] }), text: "\u041E\u0442\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043D\u044B\u0435/\u043E\u0441\u0442\u0430\u043B\u043E\u0441\u044C \u0434\u043E\u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C" }), (0, jsx_runtime_1.jsx)(Tooltip_1.default, { children: (0, jsx_runtime_1.jsx)("span", { className: Main_module_scss_1.default.hours__week, children: counterMonthDay }), text: "\u0412 \u0441\u0440\u0435\u0434\u043D\u0435\u043C \u0437\u0430 \u0434\u0435\u043D\u044C" })] })), (0, jsx_runtime_1.jsxs)("div", { className: `${Main_module_scss_1.default.hours__info} ${Main_module_scss_1.default.hours__info_right}`, children: [(0, jsx_runtime_1.jsxs)("p", { className: Main_module_scss_1.default.hours__text, children: ["\u0427\u0430\u0441\u044B \u0437\u0430 ", showMonth] }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.toggleBtn, onClick: () => setIsVisibleMonth(prev => !prev), children: isVisibleMonth ? "▲" : "▼" })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__intervals, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__intervals_date, children: (0, formatDate_1.formatDate)(selectedDate) }), (0, jsx_runtime_1.jsxs)("div", { className: Main_module_scss_1.default.calendar__intervals_field, children: [(0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__intervals_box, children: renderIntervals(selectedDate) }), (0, jsx_runtime_1.jsx)("div", { className: Main_module_scss_1.default.calendar__intervals_add, onClick: addInterval })] })] })] }), (0, jsx_runtime_1.jsx)("button", { className: `${Main_module_scss_1.default.chart__arrow} ${Main_module_scss_1.default.chart__arrow_left}`, onClick: showPrevDays }), (0, jsx_runtime_1.jsx)("button", { className: `${Main_module_scss_1.default.chart__arrow} ${Main_module_scss_1.default.chart__arrow_right}`, onClick: showNextDays })] }), (0, jsx_runtime_1.jsx)(AddInterval_1.default, { startHours: startIntervalHours, startMinutes: starIntervaltMinutes, endHours: endIntervalHours, endMinutes: endIntervalMinutes, selectedDate: selectedDate, isOpenModalAdd: isOpenModalAdd, onClick: handleSaveInterval, onClose: closeModal, onStartHoursChange: setStartIntervalHours, onStartMinutesChange: setStartIntervalMinutes, onEndHoursChange: setEndIntervalHours, onEndMinutesChange: setEndIntervalMinutes, onHoursCurrentMonth: getHoursCurrentMonth, intervalType: intervalType, onIntervalTypeChange: setIntervalType })] }));
};
exports.default = Main;
