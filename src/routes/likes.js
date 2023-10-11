import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { auth, db } from '../firebase/firebaseConfig';
import { createPostCard } from './feed';
import iconoNav from '../assets/iconoBlanco.png';
import generalUser from '../assets/general-user.png';
import navHome from '../assets/iconos/icono-home-off.png';
import navLikes from '../assets/iconos/icono-likes-on.png';
import navPosts from '../assets/iconos/icono-post-off.png';
import navProfile from '../assets/iconos/icono-profile-off.png';

// Cargar posts de Firestore y filtrar por likesCount
function loadPopularPosts(myPopularPosts) {
  const postsCollection = collection(db, 'posts');
  onSnapshot(postsCollection, (querySnapshot) => {
    myPopularPosts.innerHTML = '';
    const popularPosts = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data(); // Transforma objeto de Firebase a objeto de JS
      if (data.userID === auth.currentUser.uid && data.likesCount >= 1) {
        popularPosts.push({ ...data, id: doc.id });
      }
    });

    // Ordenar los posts por likesCount de mayor a menor
    popularPosts.sort((a, b) => b.likesCount - a.likesCount);

    // Crear y agregar las tarjetas de los posts populares
    popularPosts.forEach((postData) => {
      const postCard = createPostCard(postData);
      myPopularPosts.appendChild(postCard);
    });
  });
}

function likes(navigateTo) {
  const section = document.createElement('section');

  const header = document.createElement('div');
  const name = document.createElement('h3');
  const profileName = document.createElement('h4');
  const pictureUser = document.createElement('img');

  const main = document.createElement('main');

  const likesContainer = document.createElement('div');
  const likesTitle = document.createElement('p');
  const likesFeed = document.createElement('div');
  const myPopularPosts = document.createElement('div');

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

  section.id = 'likesSection';
  header.id = 'header';
  name.classList.add('userName');
  profileName.classList.add('profileName');
  pictureUser.classList.add('pictureUser');
  main.id = 'main';
  likesContainer.id = 'postContainer';
  likesTitle.classList.add('titles');

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

  likesTitle.textContent = 'TUS POSTS MAS POPULARES:';

  loadPopularPosts(myPopularPosts);

  // NAV BAR
  buttonHome.textContent = 'Home';
  buttonHome.addEventListener('click', () => {
    navigateTo('/feed');
  });

  buttonLikes.textContent = 'Likes';
  buttonLikes.addEventListener('click', () => {
    navigateTo('/likes');
  });

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
  main.append(likesContainer);
  likesContainer.append(likesTitle, likesFeed, myPopularPosts);
  menuContainer.append(buttonHome, buttonLikes, iconElement, buttonPosts, buttonProfile);
  nav.appendChild(menuContainer);

  section.append(header, main, menuContainer);
  return section;
}

export default likes;
