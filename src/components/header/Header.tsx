import React from 'react';
import styles from './Header.module.scss'

type HeaderProps = {
    text: string;
}

const Header: React.FC<HeaderProps> = ({text}) => {
    return (
        <div className={styles.header}>
            <div className={styles.logo}>
                <div className={styles.logo_img}>
                    <div className={styles.clock}>
                        <div className={`${styles.hour_hand} ${styles.hand}` }></div>
                        <div className={`${styles.minute_hand} ${styles.hand}`}></div>
                    </div>
                </div>
                <span>timer.prx.by</span>
            </div>
            <div className={styles.title}>
                <h1>{text}</h1>
            </div>
        </div>
    );
};

export default Header;
