import React, {useState} from 'react';
import styles from "./DayWeek.module.scss";
import {arrDays} from "../../arrays/Arrays";

type DayWeekPops = {
    date: Date;
}

const DayWeek: React.FC<DayWeekPops> = ({date}) => {
        let currentDate: Date = new Date()
        const dayWeek: string = arrDays[date.getDay()]
        let dayOff: number = date.getDay()
        let isCurrentDay: boolean = currentDate.toDateString() === date.toDateString()
        return (
            <div className={`${styles.day__week}
            ${isCurrentDay ? styles.mark__square : ''}
            ${dayOff === 6 || dayOff === 0 ? styles.off__square : ''}
            `}>
                <span>{dayWeek}</span>
            </div>
        )
    }
;

export default DayWeek;