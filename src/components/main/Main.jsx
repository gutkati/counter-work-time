import React, {useState} from 'react';
import styles from './Main.module.scss';
import ButtonWork from "../buttons/buttonWork/ButtonWork";
import color from "../../styles/_variables.scss"
import DayWeek from "../day/DayWeek";

const Main = () => {
    const [arrShowDays, setArrShowDays] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18])

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
                                    index={index}
                                    date={date}
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