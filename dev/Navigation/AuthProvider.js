import React, {createContext, useState} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const AuthContext = createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: async (email, password) => {
          try {
            await auth()
              .signInWithEmailAndPassword(email, password)
              .then((result) => {
                const LastLoggedIn = firestore.Timestamp.now();
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .update({
                    LastLoggedIn: LastLoggedIn,
                  })
                  .then(() => {
                    console.log('Logged in status updated!');
                  });
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (e) {
            console.log(e);
          }
        },
        register: async (email, password) => {
          try {
            //Register will create a user for authentication
            await auth()
              .createUserWithEmailAndPassword(email, password)
              .then((result) => {
                const creationDate = firestore.Timestamp.now();
                firestore()
                  .collection('users')
                  .doc(auth().currentUser.uid)
                  .set({
                    creationDate,
                    email,
                    //creationDate,
                  });
                console.log(result);
              })
              .catch((error) => {
                console.log(error);
              });
          } catch (e) {
            console.log(e);
          }
        },
        logout: async () => {
          try {
            await auth().signOut();
          } catch (e) {
            console.error(e);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
