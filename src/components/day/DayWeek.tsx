import React, {useState} from 'react';
import styles from "./DayWeek.module.scss";

const DayWeek = ({index, date, selectDay, onClick}) => {
        return (
            <div className={styles.day__week}>
                <span>пн</span>
            </div>
        )
    }
;

export default DayWeek;