import React, {useMemo} from 'react';
import styles from "./DayWeek.module.scss";
import {arrDays} from "../../arrays/Arrays";

type DayWeekPops = {
    date: Date;
    onClick?: (date: Date) => void;
    selectedDate?: Date;
}

const DayWeek: React.FC<DayWeekPops> = ({date, onClick, selectedDate}) => {
        const currentDate: Date = new Date()
        const dayWeek: string = arrDays[date.getDay()]
        const dayOff: number = date.getDay()

        const isCurrentDay: boolean = useMemo(() => {
            return currentDate.toDateString() === date.toDateString();
        }, [currentDate, date]);

        return (
            <div
                className={`${styles.day__week}
            ${isCurrentDay ? styles.mark__square : ''}
            ${dayOff === 6 || dayOff === 0 ? styles.off__square : ''}
            `}

                onClick={() => onClick?.(date)}
            >
                <span>{dayWeek}</span>
            </div>
        )
    }
;

export default DayWeek;