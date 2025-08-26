import React, {useState} from 'react';
import styles from "./EditTime.module.scss";
import {formatDate} from "../../utils/formatDate";

type AddIntervalProps = {
    startHours: number;
    startMinutes: number;
    endHours: number;
    endMinutes: number;
    selectedDate: Date;
    isOpenModalAdd: boolean;
    onClick?: (startHours: number, startMinutes: number, endHours: number, endMinutes: number, intervalType: 'work' | 'rest', selectedDate: Date) => void;
    onClose: () => void;
    onStartHoursChange: (value: number) => void;
    onStartMinutesChange: (value: number) => void;
    onEndHoursChange: (value: number) => void;
    onEndMinutesChange: (value: number) => void;
    onHoursCurrentMonth: () => void;
    intervalType: 'work' | 'rest';
    onIntervalTypeChange: (value: 'work' | 'rest') => void;
}

const AddInterval: React.FC<AddIntervalProps> = ({
                                                     startHours,
                                                     startMinutes,
                                                     endHours,
                                                     endMinutes,
                                                     selectedDate,
                                                     isOpenModalAdd,
                                                     onClick,
                                                     onClose,
                                                     onStartHoursChange,
                                                     onStartMinutesChange,
                                                     onEndHoursChange,
                                                     onEndMinutesChange,
                                                     onHoursCurrentMonth,
                                                     intervalType,
                                                     onIntervalTypeChange
                                                 }) => {

    const [errorHours, setErrorHours] = useState<string>('');
    const [errorMinutes, setErrorMinutes] = useState<string>('');


    // const [hoursEnd, setHoursEnd] = useState<number>()

    const handleBlurHours = () => {
        if (!startHours) return
        validateHours(Number(startHours))
    }

    const handleBlurMinutes = () => {
        if (!startMinutes) return;
        validateMinutes(Number(startMinutes))
    }

    function validateHours(startHours: any) {
        let num = /^\d+$/
        if (!num.test(startHours)) {
            setErrorHours('Число больше 0')
            return false
        } else if (Number(startHours) >= 0 && Number(startHours) < 24) {
            setErrorHours('')
            return true
        } else {
            setErrorHours('Число от 0 до 23');
            return false;
        }
    }

    function validateMinutes(startMinutes: any) {
        let num = /^\d+$/
        if (!num.test(startMinutes)) {
            setErrorMinutes('Число больше 0')
            return false
        } else if (Number(startMinutes) >= 0 && Number(startMinutes) < 60) {
            setErrorMinutes('')
            return true
        } else {
            setErrorMinutes('Число от 0 до 59');
            return false;
        }
    }

    function saveUpdateTime(startHours: number, startMinutes: number, endHours: number, endMinutes: number, intervalType: 'work' | 'rest', selectedDate: Date) {
        if (!selectedDate) return

        if (validateHours(startHours) && validateMinutes(startMinutes)) {
            onClick?.(startHours, startMinutes, endHours, endMinutes, intervalType, selectedDate)
        }
    }

    return (
        <div className={`${styles.edit__time} ${styles.edit__time_add} ${isOpenModalAdd ? styles.visible : ''}`}>

            <div className={styles.date}>
                <span>{selectedDate ? formatDate(selectedDate) : ''}</span>
            </div>

            <h3 className={styles.title}>Время начало интервала</h3>
            <button className={styles.close} onClick={onClose}></button>

            <form className={styles.form}>
                <div className={styles.box__input}>
                    <label htmlFor="">
                        Часы
                        <input
                            type="number"
                            value={startHours.toString()}
                            onChange={(e) => onStartHoursChange(Number(e.target.value))}
                            onBlur={handleBlurHours}
                            className={`${styles.input} ${styles.input__hours}`}
                        />
                        <span className={styles.text__error}>{errorHours}</span>
                    </label>

                    <label htmlFor="">
                        Минуты
                        <input
                            type="number"
                            value={startMinutes.toString()}
                            onChange={(e) => onStartMinutesChange(Number(e.target.value))}
                            onBlur={handleBlurMinutes}
                            className={`${styles.input} ${styles.input__minutes}`}/>
                        <span className={styles.text__error}>{errorMinutes}</span>
                    </label>
                </div>

                <h3 className={styles.title}>Время окончание интервала</h3>
                <div className={styles.box__input}>
                    <label htmlFor="">
                        Часы
                        <input
                            type="number"
                            value={endHours.toString()}
                            onChange={(e) => onEndHoursChange(Number(e.target.value))}
                            onBlur={handleBlurHours}
                            className={`${styles.input} ${styles.input__hours}`}
                        />
                        <span className={styles.text__error}>{errorHours}</span>
                    </label>

                    <label htmlFor="">
                        Минуты
                        <input
                            type="number"
                            value={endMinutes.toString()}
                            onChange={(e) => onEndMinutesChange(Number(e.target.value))}
                            onBlur={handleBlurMinutes}
                            className={`${styles.input} ${styles.input__minutes}`}/>
                        <span className={styles.text__error}>{errorMinutes}</span>
                    </label>
                </div>

                <div className={styles.box__radio}>
                    <label>
                        <input
                            type='radio'
                            name='intervaleType'
                            value='work'
                            checked={intervalType === 'work'}
                            onChange={() => onIntervalTypeChange('work')}
                        />
                        Работа
                    </label>

                    <label>
                        <input type='radio'
                               name='intervaleType'
                               value='rest'
                               checked={intervalType === 'rest'}
                               onChange={() => onIntervalTypeChange('rest')}/>
                        Отдых
                    </label>

                </div>
                <button type='button' className={styles.btn}
                        onClick={() => saveUpdateTime(startHours, startMinutes, endHours, endMinutes, intervalType, selectedDate)}>Сохранить
                </button>
            </form>
        </div>
    );
};

export default AddInterval;