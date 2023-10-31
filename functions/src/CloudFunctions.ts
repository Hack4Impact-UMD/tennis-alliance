import app, {functions} from '../../config/firebase';

import { httpsCallable } from 'firebase/functions';
import { getAuth, sendPasswordResetEmail } from '@firebase/auth';
import { Hash } from 'crypto';

/*
 * Creates a user and sends a password reset email to that user.
 */
export function createUser(
  uid: number,
  newEmail: string,
  password: Hash,
  newFirstName: string,
  newLastName: string,
  phoneNumber: number,
  zipCode: number,
  children: {
    firstName: string,
    lastName: string,
    age: number,
    birthYear: number,
    school: string,
  }[],
  notifcations: boolean,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const createUserCloudFunction = httpsCallable(functions, 'createUser');
    const auth = getAuth(app);

    createUserCloudFunction({ id: uid, 
                              email: newEmail, 
                              pass: password, 
                              firstName: newFirstName, 
                              lastName: newLastName, 
                              phone: phoneNumber, 
                              zip: zipCode,  
                              children: children, 
                              notifs: notifcations})
      .then(async () => {
        await sendPasswordResetEmail(auth, newEmail)
          .then(() => {
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}