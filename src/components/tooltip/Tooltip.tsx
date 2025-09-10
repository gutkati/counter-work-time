"use client"
import React from 'react';
import styles from "./Tooltip.module.scss";

type TooltipProps = {
    children?: React.ReactNode;
    text: string;
}

const Tooltip: React.FC<TooltipProps> = ({children, text}) => {
    return (
        <div className={styles.tooltip}>
            {children}
            <span className={styles.tooltip__text}>{text}</span>
        </div>
    );
};

export default Tooltip;