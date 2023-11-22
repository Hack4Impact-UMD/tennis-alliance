
"use client";
import React, { useState } from 'react';
import Image from "next/image";
import styles from './page.module.css'
import Rectangle1 from "src/assets/Group 27.png";
import Rectangle2 from "src/assets/Rectangle 69.svg";
import Rectangle3 from "src/assets/Rectangle 70.svg";
import Ellipse from "src/assets/Group 27.png";




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
               <div className={styles.menuContainer}>

               </div>
           </div>
           <div className={styles.bodyContainer}>
               <Image src={Ellipse} alt="Ellipses" id="centeredImage" />
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


