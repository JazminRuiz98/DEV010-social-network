import {
  collection, getDocs, addDoc, serverTimestamp,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db, auth } from '../firebase/firebaseConfig';
import iconoNav from '../assets/iconoBlanco.png';
import generalUser from '../assets/general-user.png';
// import iconoEditar from '../assets/iconos/icono-editar.png';
import navHome from '../assets/iconos/icono-home-off.png';
import navLikes from '../assets/iconos/icono-likes-off.png';
import navPosts from '../assets/iconos/icono-post-off.png';
import navProfile from '../assets/iconos/icono-profile-on.png';

const user = auth.currentUser;
console.log(user);
if (user !== null) {
  // The user object has basic properties such as display name, email, etc.
  const displayName = user.displayName;
  const email = user.email;
  const photoURL = user.photoURL;
  const emailVerified = user.emailVerified;

  // The user's ID, unique to the Firebase project. Do NOT use
  // this value to authenticate with your backend server, if
  // you have one. Use User.getToken() instead.
  const uid = user.uid;
}

function profile(navigateTo) {
  const section = document.createElement('section');

  const header = document.createElement('div');
  const name = document.createElement('h3');
  const profileName = document.createElement('h4');
  const pictureUser = document.createElement('img');

  const main = document.createElement('main');

  const profileContainer = document.createElement('div');
  const profileTitle = document.createElement('p');
  // const nameTitle = document.createElement('div');
  // const name = document.createElement('div');
  // const nameInput = document.createElement('input');

  const nav = document.createElement('nav');
  const menuContainer = document.createElement('div');
  const buttonHome = document.createElement('img');
  buttonHome.src = navHome;
  const buttonLikes = document.createElement('img');
  buttonLikes.src = navLikes;
  const iconElement = document.createElement('img');
  const buttonPosts = document.createElement('img');
  buttonPosts.src = navPosts;
  const buttonProfile = document.createElement('img');
  buttonProfile.src = navProfile;

  section.id = 'profileSection';
  header.id = 'header';
  name.classList.add('userName');
  profileName.classList.add('profileName');
  pictureUser.classList.add('pictureUser');
  main.id = 'main';
  profileContainer.id = 'postContainer';
  profileTitle.classList.add('titles');

  menuContainer.id = 'navbar';
  buttonHome.classList.add('imgNav');
  buttonLikes.classList.add('imgNav');
  buttonPosts.classList.add('imgNav');
  buttonProfile.classList.add('imgNav');
  iconElement.src = iconoNav;
  iconElement.alt = 'New Wave Icon';
  iconElement.classList.add('iconNav');

  name.textContent = getAuth().currentUser?.displayName;
  profileName.textContent = getAuth().currentUser?.email;
  pictureUser.src = auth.currentUser?.photoURL ? auth.currentUser?.photoURL : generalUser;
  // buttonEdit.src = iconoEditar;

  profileTitle.textContent = 'PERFIL DE USUARIA:';

  // NAV BAR
  buttonHome.textContent = 'Home';
  buttonHome.addEventListener('click', () => {
    navigateTo('/feed');
  });

  buttonLikes.textContent = 'Likes';
  buttonLikes.addEventListener('click', () => {
    navigateTo('/likes');
  });

  iconElement.textContent = 'icon';

  buttonPosts.textContent = 'Post';
  buttonPosts.addEventListener('click', () => {
    navigateTo('/posts');
  });

  buttonProfile.textContent = 'Profile';
  buttonProfile.addEventListener('click', () => {
    navigateTo('/profile');
  });

  // ORGANIZAR CONTENIDOS
  header.append(name, pictureUser, profileName);
  main.append(profileContainer);
  profileContainer.append(profileTitle);
  menuContainer.append(buttonHome, buttonLikes, iconElement, buttonPosts, buttonProfile);
  nav.appendChild(menuContainer);

  section.append(header, main, menuContainer);
  return section;
}

export default profile;
