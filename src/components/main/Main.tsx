import React, {useState, useEffect} from 'react';
import styles from './Main.module.scss';
import ButtonWork from "../buttons/buttonWork/ButtonWork";
import color from "../../styles/_variables.module.scss"
import DayWeek from "../day/DayWeek";
import {useMediaQuery} from "react-responsive";

const Main = () => {
    const [arrShowDays, setArrShowDays] = useState<Date[]>([]);

    const isSmallScreen = useMediaQuery({maxWidth: 1120});
    const isTabletScreen = useMediaQuery({maxWidth: 834});
    const isMobileScreen = useMediaQuery({maxWidth: 650});

    useEffect(() => {
        setArrShowDays(getDaysRange())
    }, [isSmallScreen, isTabletScreen, isMobileScreen])

    function getDaysRange():Date[] {
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
        }
         else if (isSmallScreen) {
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
        return days
    }

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
                                    // date={date}
                                    //selectDay={selectDay}
                                    //onClick={() => handleDayClick(date)}
                                />

                                <div className={styles.day__num}>
                                    <span>15</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.calendar__month}>
                        <span>Апрель</span>
                    </div>
                </div>

                <button className={`${styles.chart__arrow} ${styles.chart__arrow_left}`}></button>
                <button className={`${styles.chart__arrow} ${styles.chart__arrow_right}`}></button>

            </div>
        </div>
    );
};

export default Main;