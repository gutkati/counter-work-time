import React, {useState} from 'react';
import styles from './ButtonWork.module.scss'

type ButtonProps = {
  text: string;
  color: string;
  hoverColor: string;
  onClick?: () => void;
};

const ButtonWork: React.FC<ButtonProps> = ({color, hoverColor, text}) => {
    const [bg, setBg] = useState(color)

    return (
        <button
            className={styles.button}
            style={{
                background: bg,
            }}
            onMouseEnter={() => {
                setBg(hoverColor);
            }}
            onMouseLeave={() => {
                setBg(color);
            }}
        >
            {text}
        </button>
    );
};

export default ButtonWork;