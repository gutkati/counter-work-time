import React, {useState} from 'react';
import styles from './EditTime.module.scss';
import {formatDate} from '../../utils/formatDate'

type EditTimeProps = {
    hours: string;
    minutes: string;
    selectedDate: Date;
    isOpenModal: boolean;
    onClick?: (hours: string, minutes: string) => void;
    onClose: () => void;
    onHoursChange: (value: string) => void;
    onMinutesChange: (value: string) => void;
    onHoursCurrentMonth: () => void;
}

const EditTime: React.FC<EditTimeProps> = ({
                                               hours,
                                               minutes,
                                               selectedDate,
                                               isOpenModal,
                                               onClick,
                                               onClose,
                                               onHoursChange,
                                               onMinutesChange,
                                               onHoursCurrentMonth
                                           }) => {


    const [errorHours, setErrorHours] = useState<string>('');
    const [errorMinutes, setErrorMinutes] = useState<string>('');

    const handleBlurHours = () => {
        if (!hours) return
        validateHours(Number(hours))
    }

    const handleBlurMinutes = () => {
        if (!minutes) return;
        validateMinutes(Number(minutes))
    }

    function validateHours(hours: any) {
        let num = /^\d+$/
        if (hours === "") {
            setErrorHours('Введите количество')
            return false
        } else if (!num.test(hours)) {
            setErrorHours('Число больше 0')
            return false
        } else if (Number(hours) >= 0 && Number(hours) < 24) {
            setErrorHours('')
            return true
        } else {
            setErrorHours('Число от 0 до 23');
            return false;
        }
    }

    function validateMinutes(minutes: any) {
        let num = /^\d+$/
        if (minutes === "") {
            setErrorMinutes('Введите количество')
            return false
        } else if (!num.test(minutes)) {
            setErrorMinutes('Число больше 0')
            return false
        } else if (Number(minutes) >= 0 && Number(minutes) < 60) {
            setErrorMinutes('')
            return true
        } else {
            setErrorMinutes('Число от 0 до 59');
            return false;
        }
    }

    function saveUpdateTime(hours: string, minutes: string) {
        if (!hours || !minutes) return

        if (validateHours(hours) && validateMinutes(minutes)) {
            onClick?.(hours, minutes)
            onHoursCurrentMonth()
        }
    }

    return (
        <div className={`${styles.edit__time} ${isOpenModal ? styles.visible : ''}`}>
            <h3 className={styles.title}>Редактировать время</h3>
            <button className={styles.close} onClick={onClose}></button>

            <div className={styles.date}>
                <span>{selectedDate ?  formatDate(selectedDate) : ''}</span>
            </div>

            <form className={styles.form}>
                <div className={styles.box__input}>
                    <label htmlFor="">
                        Часы
                        <input
                            type="number"
                            value={hours}
                            onChange={(e) => onHoursChange(e.target.value)}
                            onBlur={handleBlurHours}
                            className={`${styles.input} ${styles.input__hours}`}
                        />
                        <span className={styles.text__error}>{errorHours}</span>
                    </label>

                    <label htmlFor="">
                        Минуты
                        <input
                            type="number"
                            value={minutes}
                            onChange={(e) => onMinutesChange(e.target.value)}
                            onBlur={handleBlurMinutes}
                            className={`${styles.input} ${styles.input__minutes}`}/>
                        <span className={styles.text__error}>{errorMinutes}</span>
                    </label>
                </div>

                <button type='button' className={styles.btn} onClick={() => saveUpdateTime(hours, minutes)}>Сохранить
                </button>
            </form>
        </div>
    );
};

export default EditTime;