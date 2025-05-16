import React, {useState, useEffect} from 'react';
import styles from './Main.module.scss';
import ButtonWork from "../buttons/buttonWork/ButtonWork";
import color from "../../styles/_variables.module.scss"
import DayWeek from "../day/DayWeek";
import {useMediaQuery} from "react-responsive";
import {arrMonths} from "../../arrays/Arrays";

const Main = () => {
    const [arrShowDays, setArrShowDays] = useState<Date[]>([]);

    const isSmallScreen = useMediaQuery({maxWidth: 1120});
    const isTabletScreen = useMediaQuery({maxWidth: 834});
    const isMobileScreen = useMediaQuery({maxWidth: 650});
    const [showMonth, setShowMonth] = useState('')
    const [numMonth, setNumMonth] = useState<number>()

    useEffect(() => {
        setArrShowDays(getDaysRange())
    }, [isSmallScreen, isTabletScreen, isMobileScreen])

    useEffect(() => {
        if (!arrMonths.length || !arrShowDays.length) return;

        if (arrShowDays.length >= 18) {
            getCurrentMonth(arrShowDays, arrMonths, 10);
        } else if (arrShowDays.length >= 10) {
            getCurrentMonth(arrShowDays, arrMonths, 6);
        } else if (arrShowDays.length >= 7) {
            getCurrentMonth(arrShowDays, arrMonths, 4);
        }

    }, [arrShowDays, arrMonths]);

    function getDaysRange(): Date[] {
        const today = new Date()
        const dayOfWeek = today.getDay()
        const startOfCurrentWeek = new Date(today)

        // Определяем начало текущей недели (понедельник)
        startOfCurrentWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1))

        // Определяем начало предыдущей недели (понедельник)
        const startOfPreviousWeek = new Date(startOfCurrentWeek)
        startOfPreviousWeek.setDate(startOfCurrentWeek.getDate() - 7)

        // Проверяем ширину экрана

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
                const day = new Date(startOfCurrentWeek)
                day.setDate(startOfCurrentWeek.getDate() + i)

                days.push(day)
            }
        } else {
            for (let i = 0; i < 18; i++) {
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
        let firstDayArr = arrShowDays[0] // первый день массива

        for (let i = 1; i < 3; i++) {
            const newDay = new Date(firstDayArr)
            newDay.setDate(firstDayArr.getDate() - i)
            arrShowDays.unshift(newDay)
        }
        let arrPrevDays
        if (isMobileScreen) {
            arrPrevDays = arrShowDays.slice(0, 7)
        } else if (isTabletScreen) {
            arrPrevDays = arrShowDays.slice(0, 10)
        } else if (isSmallScreen) {
            arrPrevDays = arrShowDays.slice(0, 14)
        } else {
            arrPrevDays = arrShowDays.slice(0, 18)
        }

        setArrShowDays(arrPrevDays)
    }

// карусель календаря вперед на 3 дня
    function showNextDays(): void {
        let lastDayArr = arrShowDays[arrShowDays.length - 1] // последний день массива

        for (let i = 1; i < 3; i++) {
            const newDay = new Date(lastDayArr)
            newDay.setDate(lastDayArr.getDate() + i)
            arrShowDays.push(newDay)
        }

        let arrPrevDays
        if (isMobileScreen) {
            arrPrevDays = arrShowDays.slice(-7)
        } else if (isTabletScreen) {
            arrPrevDays = arrShowDays.slice(-10)
        } else if (isSmallScreen) {
            arrPrevDays = arrShowDays.slice(-14)
        } else {
            arrPrevDays = arrShowDays.slice(-18)
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
            const count = countDay[+key];
            if (count >= numDay) {
                setNumMonth(+key)
                setShowMonth(arrMonths[+key])
                break
            }
        }
    }

    //console.log(arrShowDays)
    console.log(numMonth)
    return (
        <div className={styles.main}>
            <div className={styles.box_button}>
                <ButtonWork
                    color={color.orangeColor}
                    hoverColor={color.hoverColorWork}
                    text="Работаю"
                />
                <ButtonWork
                    color={color.gradientButton}
                    hoverColor={color.hoverColorRest}
                    text="Отдых"
                />
            </div>

            {/* section chart*/}

            <div className={styles.chart}>
                <div className={styles.chart_field}>
                    <div className={styles.timer}>22:18</div>
                    <div className={styles.time}>
                        <p>16<span>час</span></p>
                        <div>
                            <p>8<span>час</span></p>
                        </div>

                        <p>1<span>час</span></p>
                    </div>
                </div>

                {/* section calendar*/}
                <div className={styles.calendar}>
                    <div className={styles.calendar__container}>
                        {arrShowDays.map((date, index) => (
                            <div
                                key={index}
                                className={styles.calendar__day}>

                                <div className={styles.day__column}></div>

                                <DayWeek
                                    key={index}
                                    // index={index}
                                    date={date}
                                    //selectDay={selectDay}
                                    //onClick={() => handleDayClick(date)}
                                />

                                <div className={`${styles.day__num}
                                    ${date.getMonth() !== numMonth ? styles.day__pale : ''}
                                `}>
                                    <span>{date.getDate()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.calendar__month}>
                        <span>{showMonth}</span>
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