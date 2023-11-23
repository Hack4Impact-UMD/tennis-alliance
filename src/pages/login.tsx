
"use client";
import React, { useState } from 'react';
import Image from "next/image";
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
            <div className={styles.minilogo}></div>
            <div className={styles.boxContainer}>


                <div className={styles.email}>Email</div>
                <input
                    type="text"
                    value={inputText1}
                    onChange={handleInputChange1}
                    style={{
                        width: '80%',
                        height: '10%',
                        border: 'none',
                        borderRadius: '10.689px',
                        outline: 'none',
                        paddingLeft: '10px', // Adjust this value based on your design

                        color: '#000000',
                    }}
                />

                <div className={styles.pw}>Password</div>
                <input
                    type="text"
                    value={inputText2}
                    onChange={handleInputChange2}
                    style={{
                        width: '80%',
                        height: '10%',
                        border: 'none',
                        borderRadius: '10.689px',
                        outline: 'none',
                        paddingLeft: '10px',

                        color: '#000000',
                    }}
                />


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
        </div>

    );
};


export default UIPage;


