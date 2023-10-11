// aqui exportaras las funciones que necesites

// export myFunction ...

/*
import {
  collection, addDoc,
} from 'firebase/firestore';
import {
  db, auth,
} from '../firebase/firebaseConfig';

export function addProfile({
  avatar, email, userID, name,
}) {
  return new Promise((resolve, reject) => {
    addDoc(collection(db, 'users'), {
      avatar: auth.currentUser.photoURL ? auth.currentUser.photoURL : 'urlimagengenerica',
      email,
      userID: auth.currentUser.uid,
      userName: name,
    })
      .then((docRef) => {
        resolve(docRef.id);
      })
      .catch((error) => {
        reject(error);
      });
  });
} */

// Aquí puedes mostrar la foto del usuario en tu aplicación
/* const userProfilePhoto = document.createElement('img');
userProfilePhoto.src = photoURL;
userProfilePhoto.alt = 'Perfil de usuario'; */
