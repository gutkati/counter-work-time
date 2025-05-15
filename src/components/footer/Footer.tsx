import React from 'react';
import styles from './Footer.module.scss'
import {Link} from "react-router-dom";

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.author}>
                <p>Екатерина Шмелева © 2025</p>
            </div>
            <div className={styles.icons}>
                <Link to="https://t.me/gutkati" target="_blank">
                    <div className={styles.telegram}></div>
                </Link>

                <Link to="https://github.com/gutkati" target="_blank">
                    <div className={styles.github}></div>
                </Link>

            </div>
        </div>
    );
};

export default Footer;