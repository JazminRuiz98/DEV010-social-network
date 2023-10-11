import icono from '../assets/icono.png';

import {
  signIn, resetEmail, googleCount,
} from '../firebase/firebaseConfig.js';
import { createModal, showModal } from './modal';

// import { loadUserPosts } from './posts.js';

function login(navigateTo) {
  const section = document.createElement('section');
  const icon = document.createElement('img');
  const title = document.createElement('h2');
  const form = document.createElement('form');
  const inputEmail = document.createElement('input');
  const inputPass = document.createElement('input');
  const linkResetEmail = document.createElement('span');
  const buttonLogin = document.createElement('button');
  const textRegister = document.createElement('span');
  const linkRegister = document.createElement('span');
  const buttonLogInWithGoogle = document.createElement('button');
  buttonLogInWithGoogle.setAttribute('type', 'submit');
  inputPass.setAttribute('type', 'password');

  section.id = 'loginSection';
  icon.src = icono;
  icon.alt = 'New Wave Icon';
  icon.classList.add('icon');
  title.classList.add('titles');
  form.id = 'loginForm';
  inputEmail.classList.add('input');
  inputPass.classList.add('input');
  buttonLogin.id = 'btnLogin';
  textRegister.classList.add('text');
  linkRegister.classList.add('link');
  linkResetEmail.classList.add('linkReset');
  buttonLogInWithGoogle.classList.add('googleButton');
  buttonLogInWithGoogle.id = 'btnGoogle';

  title.textContent = 'INGRESA A TU CUENTA:';
  buttonLogin.textContent = 'ENTRAR';

  inputEmail.placeholder = 'Correo electrónico';
  inputPass.placeholder = 'Contraseña';

  // Login users
  buttonLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const email = inputEmail.value;
    const password = inputPass.value;

    signIn(email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        // alert('Acceso exitoso');
        navigateTo('/feed');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorMessage);
        console.log(errorCode);
        const modal = createModal(errorMessage);
        showModal(modal);
      });
  });

  // Botón acceso con Google
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    googleCount()
      .then(() => {
        navigateTo('/feed');
      });
  });

  // Link a registro
  textRegister.textContent = 'Si aún no tienes cuenta regístrate ';
  linkRegister.textContent = 'AQUÍ';
  linkRegister.addEventListener('click', () => {
    navigateTo('/userRegister');
  });

  // Recuperar contraseña
  linkResetEmail.textContent = '¿Olvidaste tu contraseña?';
  linkResetEmail.addEventListener('click', (e) => {
    e.preventDefault();

    const email = inputEmail.value;

    resetEmail(email)
      .then(() => {
        // console.log('Password reset email sent');
        // alert('Password reset email sent');
        const message = 'Revisa tu correo para restablecer tu contraseña';
        const modal = createModal(message);
        showModal(modal);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorMessage);
        console.log(errorCode);
        const modal = createModal(errorMessage);
        showModal(modal);
      });
  });

  form.append(inputEmail, inputPass, linkResetEmail, buttonLogin, buttonLogInWithGoogle);
  section.append(icon, title, form, textRegister, linkRegister);

  return section;
}

export default login;
