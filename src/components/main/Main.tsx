import React, {useState, useEffect} from 'react';
import styles from './Main.module.scss';
import ButtonWork from "../buttons/buttonWork/ButtonWork";
import color from "../../styles/_variables.module.scss";
import DayWeek from "../day/DayWeek";
import {useMediaQuery} from "react-responsive";
import {arrMonths} from "../../arrays/Arrays";
import EditTime from "../modal/EditTime";

type TimerData = {
    date: string;
    seconds: number;
};

const Main = () => {

    // получаем локальную дату
    const getLocalDateString = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [arrShowDays, setArrShowDays] = useState<Date[]>([]);

    const isSmallScreen = useMediaQuery({maxWidth: 1120});
    const isTabletScreen = useMediaQuery({maxWidth: 834});
    const isMobileScreen = useMediaQuery({maxWidth: 650});
    const [showMonth, setShowMonth] = useState<string>('');
    const [numMonth, setNumMonth] = useState<number>();

    const [isInitialzed, setIsInitialzed] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [seconds, setSeconds] = useState<number>(0);
    const [savedSeconds, setSavedSeconds] = useState<number>(0); // Секунды, сохранённые до старта
    const [todayStr, setTodayStr] = useState(getLocalDateString(new Date()));
    const [startTime, setStartTime] = useState<number | null>(null); // Время старта таймера
    const [currentDate, setCurrentDate] = useState(getLocalDateString(new Date()));

    let currentDay: Date = new Date()
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const [isOpenModalEdit, setIsOpenModalEdit] = useState<boolean>(false);
    const [hoursInput, setHoursInput] = useState<string>('0');
    const [minutesInput, setMinutesInput] = useState<string>('0');

    const [textRest, setTextRest] = useState<string>('');
    const [textWork, setTextWork] = useState<string>('Вы сейчас отдыхаете');

    const [hoursPrevWeek, setHoursPrevWeek] = useState<string>('');
    const [hoursPrevMonth, setHoursPrevMonth] = useState<string>('');

    const [rangeStart, setRangeStart] = useState<Date | null>(null);
    const [rangeEnd, setRangeEnd] = useState<Date | null>(null);
    const [workedSeconds, setWorkedSeconds] = useState<number>(0)
    const [isOpenToolkit, setIsOpenToolkit] = useState<boolean>(false);

    let keyTimer: string = 'timerSeconds';
    const HOUR_HEIGHT_PX = 18; // 282 / 16 - 282 высота контейнера колонки, 16 max кол-во часов работы
    const secondsInHour = 3600;

    //Проверка смены дня (интервал 1 минута)
    useEffect(() => {

        const checkDateChange = () => {
            const now: number = Date.now()
            const date: Date = new Date()
            const nowDate: string = getLocalDateString(date);

            if (todayStr !== currentDate) {
                saveSecondsLocal(nowDate, 0)
                setTodayStr(nowDate)
                setSeconds(0)
                setSavedSeconds(0)
                setStartTime(now)
            }
            setCurrentDate(nowDate)
        }
        checkDateChange()

        const interval = setInterval(() => {
            checkDateChange()
        }, 60000);

        return () => clearInterval(interval);
    }, [currentDate, seconds]);

    // timer
    // Загрузка данных из localStorage при монтировании
    useEffect(() => {
        const data: TimerData[] = getDataLocalStorage(keyTimer)
        const todayData = data.find(d => d.date === todayStr)

        if (todayData) {
            setSeconds(todayData.seconds)
        }

        // Устанавливаем флаг, что данные загружены
        setIsInitialzed(true)
    }, [])

    useEffect(() => {
        if (isInitialzed) saveSecondsLocal(todayStr, seconds)
    }, [seconds]);

    // Основной эффект таймера
    useEffect(() => {
        if (!isRunning) return;

        const updateSeconds = () => {
            const now: number = Date.now()
            const elapsedSeconds: number = Math.round((now - startTime!) / 1000) // Прошедшие секунды с момента старта
            const totalSeconds: number = savedSeconds + elapsedSeconds

            // Проверяем, не сменилась ли дата
            let currentDateStr: string = getLocalDateString(new Date())
            if (currentDateStr !== todayStr) {

                // Сохраняем старый день
                saveSecondsLocal(todayStr, totalSeconds)
                // сохраняем новый день
                saveSecondsLocal(currentDateStr, 0)

                // сброс таймера для новой даты
                setTodayStr(currentDateStr)
                setSeconds(0)
                setSavedSeconds(0)
                setStartTime(now)
                return
            }

            setSeconds(totalSeconds)
        };

        // Запускаем интервал только для визуализации / тиканье
        const interval = setInterval(updateSeconds, 1000)

        // Очистка при размонтировании или остановке
        return () => clearInterval(interval)
    }, [isRunning, startTime, savedSeconds, todayStr])

    // calendar
    useEffect(() => {
        setArrShowDays(getDaysRange())
    }, [isSmallScreen, isTabletScreen, isMobileScreen])

    useEffect(() => {
        if (!arrMonths.length || !arrShowDays.length) return

        if (arrShowDays.length >= 21) {
            getCurrentMonth(arrShowDays, arrMonths, 11)
        } else if (arrShowDays.length < 20 && arrShowDays.length >= 14) {
            getCurrentMonth(arrShowDays, arrMonths, 8)
        } else if (arrShowDays.length < 14 && arrShowDays.length >= 10) {
            getCurrentMonth(arrShowDays, arrMonths, 6)
        } else if (arrShowDays.length >= 7) {
            getCurrentMonth(arrShowDays, arrMonths, 4)
        }

    }, [arrShowDays, arrMonths])

    useEffect(() => {
        getHoursCurrentMonth()
    }, [numMonth]);

    useEffect(() => {
        getHoursPrevWeek()
    }, [currentDay]);

    useEffect(() => {
        if (rangeStart && rangeEnd) {
            calculateWorkedSeconds()
            setIsOpenToolkit(true)
        }
    }, [rangeStart, rangeEnd])

    // timer
    const formatNumber = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600).toString().padStart(2, '0')
        const mins = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0')
        const secs = (totalSeconds % 60).toString().padStart(2, '0')
        return `${hrs}:${mins}:${secs}`
    }

    const formatHours = (totalSeconds: number): string => {
        const hrs = Math.floor(totalSeconds / 3600).toString()
        const mins = Math.floor((totalSeconds % 3600) / 60).toString()

        if (mins !== '0') {
            return `${hrs}ч${mins}м`
        } else {
            return `${hrs}ч`
        }
    }

    function getDataLocalStorage(key: string): TimerData[] {
        const raw = localStorage.getItem(key)
        return raw ? JSON.parse(raw) : []
    }

    function saveDataLocalStorage(key: string, data: TimerData[]) {
        localStorage.setItem(key, JSON.stringify(data))
    }

    function saveSecondsLocal(date: string, seconds: number) {
        const data: TimerData[] = getDataLocalStorage(keyTimer)
        let updated: TimerData[] = [...data]
        let savedDay = updated.find(d => d.date === date)

        if (savedDay) {
            savedDay.seconds = seconds
        } else {
            updated.push({date, seconds})
        }
        saveDataLocalStorage(keyTimer, updated)
    }

    const startTimer = () => {
        setStartTime(Date.now())
        setSavedSeconds(seconds)
        setIsRunning(true)
        setTextRest('Вы сейчас работаете')
        setTextWork('')
    }

    const stopTimer = () => {
        if (!isRunning) return

        const now = Date.now()
        const elapsedSeconds = Math.round((now - startTime!) / 1000)
        const totalSeconds = savedSeconds + elapsedSeconds

        setSavedSeconds(totalSeconds)
        setSeconds(totalSeconds)
        saveSecondsLocal(todayStr, totalSeconds)
        setIsRunning(false)
        setTextWork('Вы сейчас отдыхаете')
        setTextRest('')
        getHoursCurrentMonth()
    }

// calendar
    function getDaysRange(): Date[] {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfCurrentWeek = new Date(today)

        // Определяем начало текущей недели (понедельник)
        startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

        // Определяем начало предыдущей недели (понедельник)
        const startOfPreviousWeek = new Date(startOfCurrentWeek)
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7)

        // Количество дней (7 для маленьких экранов, 14 для остальных)
        const days = []

        if (isMobileScreen) {
            for (let i = 0; i < 7; i++) {
                const day = new Date(startOfCurrentWeek)
                day.setDate(startOfCurrentWeek.getDate() + i)

                days.push(day)
            }
        } else if (isTabletScreen) {
            for (let i = 0; i < 10; i++) {
                const day = new Date(startOfCurrentWeek)
                day.setDate(startOfCurrentWeek.getDate() + i)

                days.push(day)
            }
        } else if (isSmallScreen) {
            for (let i = 0; i < 14; i++) {
                const day = new Date(startOfPreviousWeek)
                day.setDate(startOfPreviousWeek.getDate() + i)

                days.push(day)
            }
        } else {
            for (let i = 0; i < 21; i++) {
                const day = new Date(startOfPreviousWeek)
                day.setDate(startOfPreviousWeek.getDate() + i)

                days.push(day)
            }
        }
        setArrShowDays(days)
        return days
    }

    // карусель календаря назад на 3 дня
    function showPrevDays(): void {
        let arrUpdateShowDays: Date[] = [...arrShowDays]
        let firstDayArr = arrUpdateShowDays[0] // первый день массива

        for (let i = 1; i < 3; i++) {
            const newDay = new Date(firstDayArr)
            newDay.setDate(firstDayArr.getDate() - i)
            arrUpdateShowDays.unshift(newDay)
        }
        let arrPrevDays
        if (isMobileScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 7)
        } else if (isTabletScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 10)
        } else if (isSmallScreen) {
            arrPrevDays = arrUpdateShowDays.slice(0, 14)
        } else {
            arrPrevDays = arrUpdateShowDays.slice(0, 21)
        }

        setArrShowDays(arrPrevDays)
    }

// карусель календаря вперед на 3 дня
    function showNextDays(): void {
        let arrUpdateShowDays: Date[] = [...arrShowDays]
        let lastDayArr = arrUpdateShowDays[arrUpdateShowDays.length - 1] // последний день массива

        for (let i = 1; i < 3; i++) {
            const newDay = new Date(lastDayArr)
            newDay.setDate(lastDayArr.getDate() + i)
            arrUpdateShowDays.push(newDay)
        }

        let arrPrevDays
        if (isMobileScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-7)
        } else if (isTabletScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-10)
        } else if (isSmallScreen) {
            arrPrevDays = arrUpdateShowDays.slice(-14)
        } else {
            arrPrevDays = arrUpdateShowDays.slice(-21)
        }

        setArrShowDays(arrPrevDays)
    }

    function getCurrentMonth(arrDate: Date[], arrMonths: string[], numDay: number) {
        let countDay: Record<number, number> = {}
        for (let date of arrDate) {
            let month = date.getMonth()
            countDay[month] = (countDay[month] || 0) + 1
        }

        for (let key in countDay) {
            const count = countDay[+key]
            if (count >= numDay) {
                setNumMonth(+key)
                setShowMonth(arrMonths[+key])
                break
            }
        }
    }

    function editTimeWork(date: Date) {
        let calendarDays: Date[] = [...arrShowDays]
        let markDay = calendarDays.find(d => d === date)
        if (!markDay) return;

        let dateStr = getLocalDateString(markDay)
        const dataDay: TimerData[] = getDataLocalStorage(keyTimer)
        let updated: TimerData[] = [...dataDay]


        let savedDay = updated.find(d => d.date === dateStr)

        if (savedDay) {
            const hrs = Math.floor(savedDay.seconds / 3600).toString()
            const mins = Math.floor((savedDay.seconds % 3600) / 60).toString()

            setHoursInput(hrs)
            setMinutesInput(mins)

        } else {
            setHoursInput('0')
            setMinutesInput('0')
        }
    }

    function handleInputChange(hours: string, minutes: string) {
        const hrs = parseInt(hours, 10) || 0;
        const mins = parseInt(minutes, 10) || 0;

        const totalSeconds = hrs * 3600 + mins * 60;
        const dateStr = getLocalDateString(selectedDate); // или currentDay?
        saveSecondsLocal(dateStr, totalSeconds);

        if (dateStr === currentDate) {
            setSavedSeconds(totalSeconds)
            setSeconds(totalSeconds)
        }
        setIsOpenModalEdit(false); // Закрыть модалку
    }

    function closeModal(): void {
        setIsOpenModalEdit(false)
    }

    function handleDayClick(date: Date) {
        date.setHours(0, 0, 0, 0)
        currentDay.setHours(0, 0, 0, 0)
        if (date <= currentDay) {
            setSelectedDate(date)
            setIsOpenModalEdit(true)
            editTimeWork(date)
        }
    }

    function getHoursCurrentMonth() {
        const arrData: TimerData[] = getDataLocalStorage(keyTimer)

        if (!arrData) return
        let seconds = 0
        arrData.filter((obj): void => {
            const date = new Date(obj.date)
            const month = date.getMonth()

            if (month === numMonth) {
                seconds += obj.seconds
            }
        })

        setHoursPrevMonth(formatHours(seconds))
    }

    function getHoursPrevWeek() {
        const arrData: TimerData[] = getDataLocalStorage(keyTimer)
        if (!arrData) return

        let seconds = 0
        const today = new Date()

        // Получаем понедельник текущей недели
        const dayOfWeek = today.getDay() // 0 (вс) — 6 (сб)
        const diffToMonday = (dayOfWeek + 6) % 7 // смещение к понедельнику
        const startOfCurrentWeek = new Date(today)
        startOfCurrentWeek.setDate(today.getDate() - diffToMonday)
        startOfCurrentWeek.setHours(0, 0, 0, 0) // обязательно обнуляем!

        // Получаем понедельник предыдущей недели
        const startOfPreviousWeek = new Date(startOfCurrentWeek)
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7)
        startOfPreviousWeek.setHours(0, 0, 0, 0)

        const endOfPreviousWeek = new Date(startOfPreviousWeek)
        endOfPreviousWeek.setDate(startOfPreviousWeek.getDate() + 6)
        endOfPreviousWeek.setHours(23, 59, 59, 999); // конец дня ВС

        arrData.forEach(obj => {
            const date = new Date(obj.date)

            if (
                date >= startOfPreviousWeek &&
                date <= endOfPreviousWeek
            ) {
                seconds += obj.seconds
            }
        })
        setHoursPrevWeek(formatHours(seconds))
    }

    // рассчитать время за выбранный диапазон
    function handleDateClick(date: any) {

        if (!rangeStart || (rangeStart && rangeEnd)) {
            // если нет начала или оба выбраны — начинаем сначала
            setRangeStart(date)
            setIsOpenToolkit(false)
            setRangeEnd(null)
        } else if (date < rangeStart) {
            setRangeEnd(rangeStart)
            setRangeStart(date)

        } else if (rangeStart && !rangeEnd) {
            // если есть только начало — ставим конец
            if (date > rangeStart) {
                setRangeEnd(date)
            } else {
                // если выбрали дату раньше начала — делаем её началом
                setRangeStart(date)
                setIsOpenToolkit(false)
            }
        }
    }

    const calculateWorkedSeconds = () => {
        if (!rangeStart || !rangeEnd) return

        const arrData: TimerData[] = getDataLocalStorage(keyTimer) || []

        // Нормализуем границы
        const start = new Date(rangeStart)
        const end = new Date(rangeEnd)
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)

        let totalSeconds = 0

        arrData.forEach(item => {
            const itemDate = new Date(item.date)
            if (itemDate >= start && itemDate <= end) {
                totalSeconds += item.seconds
            }
        });

        setWorkedSeconds(totalSeconds)
    };

    function closeModalToolkit() {
        setIsOpenToolkit(false)
        setRangeStart(null)
        setRangeEnd(null)
    }

    const getColumns = (date: Date) => {
        let arrData: TimerData[] = getDataLocalStorage(keyTimer)
        let newDate: string = getLocalDateString(date)
        let elDate: any = arrData.find(el => el.date === newDate)

        if (elDate && elDate.seconds > 0) {
            const workedHours = elDate.seconds / secondsInHour
            const columnHeight = workedHours * HOUR_HEIGHT_PX
            return (
                <div className={styles.calendar__column}>
                    <span className={styles.hours__work}>{formatHours(elDate.seconds)}</span>
                    <div
                        className={styles.day__column}
                        style={{
                            height: `${columnHeight}px`,
                            background: `${columnHeight < 80
                                ? 'linear-gradient(to bottom, #FF9D79 0%, #FF6262 70%)'
                                : columnHeight < 110
                                    ? 'linear-gradient(to bottom, #D9D9D9 0%, #FF9D79 40%, #FF6262 70%)'
                                    : columnHeight > 216 && columnHeight <= 240
                                        ? 'linear-gradient(to top, #D9D9D9 90%, #FF9D79 100%)'
                                        : columnHeight > 240
                                            ? 'linear-gradient(to top, #D9D9D9 80%, #FF9D79 90%, #FF6262 100%)'
                                            : '#D9D9D9'
                            }`
                        }}>
                    </div>
                </div>
            )
        } else {
            return <div className={styles.calendar__column}></div>
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.box_button}>
                <div className={styles.button}>
                    <ButtonWork
                        color={color.orangeColor}
                        activeColor={color.disabledColor}
                        text="Начать работу"
                        textClick='Работаю'
                        onClick={startTimer}
                        isRunning={isRunning}
                        disabled={isRunning}
                    />

                    <span>{textWork}</span>
                </div>

                <div className={styles.button}>
                    <ButtonWork
                        color={color.disabledColor}
                        activeColor={color.greenColor}
                        text="Отдыхаю"
                        textClick='Прервать работу'
                        onClick={stopTimer}
                        isRunning={isRunning}
                        disabled={!isRunning}
                    />

                    <span>{textRest}</span>
                </div>
            </div>

            {/* section chart*/}

            <div className={styles.chart}>
                <div className={styles.chart_field}>
                    <div className={styles.timer}>
                        {formatNumber(seconds)}
                    </div>
                    <div className={styles.time}>
                        <p>16<span>ч</span></p>
                        <hr className={styles.time__top}/>
                        <div>
                            <p>8<span>ч</span></p>
                        </div>

                        <p>1<span>ч</span></p>
                        <hr className={styles.time__bottom}/>

                    </div>

                    <EditTime
                        hours={hoursInput}
                        minutes={minutesInput}
                        selectedDate={selectedDate}
                        isOpenModal={isOpenModalEdit}
                        onClick={handleInputChange}
                        onClose={closeModal}
                        onHoursChange={setHoursInput}
                        onMinutesChange={setMinutesInput}
                        onHoursCurrentMonth={getHoursCurrentMonth}
                    />

                    <div className={`${styles.info__toolkit} ${isOpenToolkit ? styles.visible__toolkit : ''}`}>
                        <button className={styles.close__toolkit} onClick={closeModalToolkit}></button>
                        <p className={styles.text__toolkit}>
                            С {rangeStart?.toLocaleDateString()} по {rangeEnd?.toLocaleDateString()} вы
                            отработали {formatHours(workedSeconds)}
                        </p>
                    </div>

                </div>

                {/* section calendar*/}
                <div className={styles.calendar}>
                    <div className={styles.calendar__container}>
                        {arrShowDays.map((date, index) => (
                            <div
                                key={index}
                                className={styles.calendar__day}>

                                {/*show colons*/}
                                {getColumns(date)}

                                <DayWeek
                                    key={index}
                                    date={date}
                                    onClick={handleDayClick}
                                    selectedDate={selectedDate}
                                />

                                <div className={`${styles.day__num}
                                    ${date.getMonth() !== numMonth ? styles.day__pale : ''}
                                    ${rangeStart === date ? styles.day__mark : ''}
                                    ${rangeEnd === date ? styles.day__mark : ''}`}
                                     onClick={() => handleDateClick(date)}
                                >
                                    <span>{date.getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.calendar__month}>
                        <div className={styles.hours}>
                            <p className={styles.hours__prev}>Часы за прошлую неделю: <span>{hoursPrevWeek}</span></p>
                        </div>

                        <span className={styles.month}>{showMonth}</span>

                        <div className={`${styles.hours} ${styles.hours_month}`}>
                            <p className={styles.hours__prev}>Часы за {showMonth}: <span>{hoursPrevMonth}</span></p>
                        </div>
                    </div>
                </div>

                <button
                    className={`${styles.chart__arrow} ${styles.chart__arrow_left}`}
                    onClick={showPrevDays}
                >
                </button>
                <button
                    className={`${styles.chart__arrow} ${styles.chart__arrow_right}`}
                    onClick={showNextDays}
                >
                </button>
            </div>


        </div>
    );
};

export default Main;