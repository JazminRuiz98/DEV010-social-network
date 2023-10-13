import { updateProfile } from 'firebase/auth';
import icono from '../assets/icono.png';
import generalUser from '../assets/general-user.png';
import { createUse, emailVerification, googleCount } from '../firebase/firebaseConfig.js';
import { createModal, showModal } from './modal';

function userRegister(navigateTo) {
  const section = document.createElement('section');
  const icon = document.createElement('img');
  const title = document.createElement('h2');
  const form = document.createElement('form');
  const inputName = document.createElement('input');
  const inputEmail = document.createElement('input');
  const inputPass = document.createElement('input');
  const buttonRegister = document.createElement('button');
  const buttonSingUpWithGoogle = document.createElement('button');
  inputPass.setAttribute('type', 'password');
  inputEmail.setAttribute('type', 'email');
  inputName.setAttribute('type', 'text');

  buttonSingUpWithGoogle.setAttribute('type', 'submit');
  const textLogin = document.createElement('span');
  const linkLogin = document.createElement('span');

  section.id = 'registerSection';
  icon.src = icono;
  icon.alt = 'New Wave Icon';
  icon.classList.add('icon');
  title.classList.add('titles');
  form.id = 'registerForm';
  inputName.classList.add('input');
  inputEmail.classList.add('input');
  inputPass.classList.add('input');
  inputName.classList.add('input');
  buttonRegister.id = 'btnLogin';
  textLogin.classList.add('text');
  linkLogin.classList.add('link');
  buttonSingUpWithGoogle.classList.add('googleButton');
  buttonSingUpWithGoogle.id = 'btnGoogle';

  title.textContent = 'CREA TU CUENTA:';
  buttonRegister.textContent = 'REGISTRARSE';

  inputName.placeholder = 'Tu nombre';
  inputEmail.placeholder = 'Correo electrónico';
  inputPass.placeholder = 'Contraseña';
  inputName.placeholder = 'Nombre de usuario';

  // Signing users
  buttonRegister.addEventListener('click', (e) => {
    e.preventDefault();

    // const userName = inputName.value;
    const email = inputEmail.value;
    const password = inputPass.value;
    const name = inputName.value;

    /* verifica si el campo del correo electrónico no está vacío */
    if (email.trim() === '') {
      // window.alert('Ingrese un correo electrónico');
      const message = 'Ingrese un correo electrónico';
      const modal = createModal(message);
      showModal(modal);
      return; // <-- Corrección: Cambiar "return;" a "return;"
    }

    createUse(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        updateProfile(user, {
          displayName: name, photoURL: generalUser,
        }).then(() => {
          console.log(user.displayName);
          // ...
        }).catch((error) => {
          // An error occurred
          console.log(error);
        });

        emailVerification(user)
          .then(() => {
            const message = 'Correo de verificación enviado. Revisa tu correo, valídalo e ingresa a tu cuenta desde la página de inicio.';
            const modal = createModal(message);
            showModal(modal);
            navigateTo('/login');
          });
      })
      .catch((error) => {
        // console.log(error.message);
        const errorMessage = error.message;
        const modal = createModal(errorMessage);
        showModal(modal);
      });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    googleCount()
      .then(() => {
        navigateTo('/feed');
      });
  });

  // Link a Login
  textLogin.textContent = 'Si ya tienes una cuenta ';
  linkLogin.textContent = 'INGRESA AQUÍ';
  linkLogin.addEventListener('click', () => {
    navigateTo('/login');
  });

  form.append(inputName, inputEmail, inputPass, buttonRegister, buttonSingUpWithGoogle);
  section.append(icon, title, form, textLogin, linkLogin);

  return section;
}

export default userRegister;
