"use client";
import React, { useState } from 'react';
import styles from './page.module.css'

const UIPage = () => {
    const [inputText1, setInputText1] = useState('');
    const [inputText2, setInputText2] = useState('');

    const handleInputChange1 = (e) => {
        setInputText1(e.target.value);
    };

    const handleInputChange2 = (e) => {
        setInputText2(e.target.value);
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.topRectangle}>
                <img src="/Top_Rectangle.svg" alt="TopRectangle" />
                <img src="/image 4.svg" alt="Image 4" className={styles.logo} />
                <div className={styles.menuContainer}>
                    <img src="/Rectangle 68.svg" alt="Menu_Rectangle" className={styles.menuItems} />
                    <img src="/Rectangle 69.svg" alt="Menu_Rectangle" className={styles.menuItems} />
                    <img src="/Rectangle 70.svg" alt="Menu_Rectangle" className={styles.menuItems} />
                </div>
            </div>
            <div className={styles.bodyContainer}>
                <img src="/Group 27.svg" alt="Ellipses" id="centeredImage" />
            </div>
            <div className={styles.minilogo}></div>
            <div className={styles.box}></div>
            <div
                style={{
                    position: 'absolute',
                    width: '426px',
                    height: '60px',
                    left: '209px',
                    top: '511px',
                    background: '#FFFFFF',
                    borderRadius: '10.689px',
                }}
            >
                <input
                    type="text"
                    value={inputText1}
                    onChange={handleInputChange1}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '10.689px',
                        outline: 'none',
                        paddingLeft: '10px', // Adjust this value based on your design
                        background: 'transparent',
                        color: '#000000',
                    }}
                />
            </div>
            <div
                style={{
                    position: 'absolute',
                    width: '426px',
                    height: '60px',
                    left: '209px',
                    top: '647px',
                    background: '#FFFFFF',
                    borderRadius: '10.689px',
                }}
            >
                <input
                    type="text"
                    value={inputText2}
                    onChange={handleInputChange2}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: '10.689px',
                        outline: 'none',
                        paddingLeft: '10px',
                        background: 'transparent',
                        color: '#000000',
                    }}
                />
            </div>
            <div className={styles.email}>Email</div>
            <div className={styles.pw}>Password</div>
            <a href="#" className={styles.forgotPasswordLink}> Forgot password?</a>
            <div
                className={styles.submitButtonContainer}
                onClick={() => console.log('Submit button clicked')}
            >
                <div className={styles.logoImage}></div>
                <div className={styles.submitText}>Submit</div>
            </div>
            <div className={styles.bottomText}><a href="#" className={styles.genLink}>Sign up </a>for an account/One time event <a href="#" className={styles.genLink}>sign up</a></div>
        </div>

    );
};

export default UIPage;
