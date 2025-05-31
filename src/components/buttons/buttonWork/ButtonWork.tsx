import React, {useState} from 'react';
import styles from './ButtonWork.module.scss'

type ButtonProps = {
    color: string;
    activeColor: string;
    text: string;
    textClick: string;
    onClick?: () => void;
    isRunning: boolean;
    disabled: boolean;
};

const ButtonWork: React.FC<ButtonProps> = ({color, activeColor, text, textClick, onClick, isRunning, disabled}) => {
    const [bg, setBg] = useState(color)

    return (
        <button
            className={styles.button}
            style={isRunning
                ? {background: activeColor,}
                : {background: bg,}}
            // onMouseEnter={() => {
            //     setBg(activeColor);
            // }}
            // onMouseLeave={() => {
            //     setBg(color);
            // }}
            onClick={onClick}
            disabled={disabled}
        >
            {isRunning ? textClick : text}
        </button>
    );
};

export default ButtonWork;