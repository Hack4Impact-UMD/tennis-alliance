import React from 'react';
import styles from './page.module.css'


const ForgotPasswordPage = () => {
    return (
        <div className= {styles.loginContainer}>
            <div className={styles.topRectangle}>
                <img src="./Rectangle 67.svg" alt="TopRectangle" />
                <img src="./logo.svg" alt="Image 4" className={styles.logo} />
                <div className={styles.menuContainer}>
                <img src="./Rectangle 68.svg" alt="Menu_Rectangle"  className = {styles.menuItems} />
                <img src="./Rectangle 69.svg" alt="Menu_Rectangle" className={styles.menuItems}/>
                <img src="./Rectangle 70.svg" alt="Menu_Rectangle" className={styles.menuItems}/>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;