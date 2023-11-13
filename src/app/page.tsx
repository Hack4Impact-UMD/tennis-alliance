import React from 'react';
import styles from './page.module.css'

const UIPage = () => {
    return (
        <div className= {styles.loginContainer}>
            <div className={styles.topRectangle}>
                <img src="/Top_Rectangle.svg" alt="TopRectangle" />
                <img src="/image 4.svg" alt="Image 4" className={styles.logo} />
                <div className={styles.menuContainer}>
                <img src="/Rectangle 68.svg" alt="Menu_Rectangle"  className = {styles.menuItems} />
                <img src="/Rectangle 69.svg" alt="Menu_Rectangle" className={styles.menuItems}/>
                <img src="/Rectangle 70.svg" alt="Menu_Rectangle" className={styles.menuItems}/>
                </div>
            </div>
            <div className= {styles.bodyContainer}>
            <img src="/Group 27.svg" alt="Ellipses" id="centeredImage"/>

               
            </div>

        </div>
    );
};

export default UIPage;
