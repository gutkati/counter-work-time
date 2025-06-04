import React, {useEffect, useState, useMemo} from 'react';
import styles from "./DayWeek.module.scss";
import {arrDays} from "../../arrays/Arrays";

type DayWeekPops = {
    date: Date;
    onClick?: (date: Date) => void;
    selectedDate?: Date;
}

const DayWeek: React.FC<DayWeekPops> = ({date, onClick, selectedDate}) => {
        // const [currentDate, setCurrentDate] = useState<Date>(new Date())
        // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentDate: Date = new Date()
        const dayWeek: string = arrDays[date.getDay()]
        const dayOff: number = date.getDay()
        //const [isCurrentDay, setIsCurrentDay] = useState(false)

        const isCurrentDay: boolean = useMemo(() => {
            return currentDate.toDateString() === date.toDateString();
        }, [currentDate, date]);

        const isSelected = selectedDate
        ? selectedDate.toDateString() === date.toDateString() &&
          selectedDate.getTime() <= currentDate.getTime()
        : false

        const markSelectedDay = selectedDate ? isSelected : isCurrentDay
        return (
            <div className={`${styles.day__week}
            ${markSelectedDay ? styles.mark__square : ''}
           
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