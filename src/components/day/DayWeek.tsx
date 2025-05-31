import React, {useEffect, useState, useMemo} from 'react';
import styles from "./DayWeek.module.scss";
import {arrDays} from "../../arrays/Arrays";

type DayWeekPops = {
    date: Date;
}

const DayWeek: React.FC<DayWeekPops> = ({date}) => {
        // const [currentDate, setCurrentDate] = useState<Date>(new Date())
    // eslint-disable-next-line react-hooks/exhaustive-deps
        const currentDate:Date = new Date()
        const dayWeek: string = arrDays[date.getDay()]
        const dayOff: number = date.getDay()
        //const [isCurrentDay, setIsCurrentDay] = useState(false)

        const isCurrentDay: boolean = useMemo(() => {
            return currentDate.toDateString() === date.toDateString();
        }, [currentDate, date]);

        // useEffect(() => {
        //     const interval = setInterval(() => {
        //         const now = new Date();
        //         // Сравниваем только даты, без времени
        //         if (now.toDateString() !== currentDate.toDateString()) {
        //             setIsCurrentDay(true); // Обновляем текущую дату
        //         } else if(currentDate.toDateString() === date.toDateString()) {
        //             setIsCurrentDay(true);
        //         }
        //
        //     }, 1000); // проверка каждую минуту
        //
        //     return () => clearInterval(interval);
        // }, [currentDate, isCurrentDay]);

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