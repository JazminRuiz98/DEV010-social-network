import {
  collection, onSnapshot,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { auth, db, addLike, removeLike } from '../firebase/firebaseConfig';
import iconoNav from '../assets/iconoBlanco.png';
import iconoCerrar from '../assets/iconos/icono-cerrar.png';
import generalUser from '../assets/general-user.png';
import likeRosa from '../assets/iconos/icono-like-on.png';
import likeGris from '../assets/iconos/icono-like-off.png';
import navHome from '../assets/iconos/icono-home-on.png';
import navLikes from '../assets/iconos/icono-likes-off.png';
import navPosts from '../assets/iconos/icono-post-off.png';
import navProfile from '../assets/iconos/icono-profile-off.png';

// Crear una card que contenga cada post
export function createPostCard(data) {
  const card = document.createElement('div');
  card.classList.add('post-card');
  const userNameElement = document.createElement('h3');
  userNameElement.classList.add('user-name');
  userNameElement.textContent = data.userName;
  const pictureUser = document.createElement('img');
  pictureUser.classList.add('user-img');
  pictureUser.src = data.avatar.includes('example') ? generalUser : data.avatar;
  const contentElement = document.createElement('p');
  contentElement.classList.add('post');
  contentElement.textContent = data.content;
  const dateElement = document.createElement('p');
  dateElement.classList.add('date');
  const date = data.createdAt.toDate();
  dateElement.textContent = `${date.toLocaleDateString()}`;

  const buttonLike = document.createElement('img');
  buttonLike.classList.add('like');
  // buttonLike.src = data.likes.includes(auth.currentUser.uid) ? likeRosa : likeGris;
  // Verifica si 'likes' está definido y es un arreglo antes de usarlo
  if (Array.isArray(data.likes)) {
    // Comprueba si el usuario actual (auth.currentUser.uid) está en el arreglo 'likes'
    if (data.likes.includes(auth.currentUser?.uid)) {
      buttonLike.src = likeRosa; // Usuario actual dio like, muestra el ícono de like activo
    } else {
      buttonLike.src = likeGris; // Usuario actual no dio like, muestra el ícono de like inactivo
    }
  } else {
    buttonLike.src = likeGris; // En caso de que 'likes' no esté definido o no sea un arreglo
  }
  
  const likesCount = document.createElement('span');
  likesCount.classList.add('likesCount');
  // likesCount.textContent = data.likesCount /* `${doc[0].likes.length}` */;
  
  // Actualiza likesCount en el elemento HTML
  /* const updateLikesCount = (count) => {
    likesCount.textContent = count;
  }; */

  // Verifica si data.likesCount tiene un valor válido
  if (typeof data.likesCount === 'number') {
    likesCount.textContent = data.likesCount;
  } else {
    likesCount.textContent = '0'; // Mostrar '0' si no hay un valor válido
  }

  buttonLike.addEventListener('click', async () => {
  // Implementa aquí la lógica para manejar el "Me gusta"
  try {
    const likes = data.likes || [];
    // Comprueba si el usuario actual ya dio "Me gusta"
    const userLiked = data.likes.includes(auth.currentUser?.uid);

    if (userLiked) {
      // Si el usuario ya dio "Me gusta", quita el "Me gusta"
      await removeLike(data.id, auth.currentUser.uid);
      // Actualiza el conteo de likes en el elemento HTML
      likesCount.textContent = likes.length - 1;
    } else {
      // Si el usuario no ha dado "Me gusta", agrégalo
      await addLike(data.id, auth.currentUser.uid);
      // Actualiza el conteo de likes en el elemento HTML
      likesCount.textContent = likes.length + 1;
    }
  } catch (error) {
    console.error('Error al manejar "Me gusta":', error);
  }
});
  
  card.append(pictureUser, userNameElement, dateElement, contentElement,buttonLike, likesCount);
  return card;
}

// Cargar posts de Firestore
function loadPosts(muro) {
  const postsCollection = collection(db, 'posts');
  onSnapshot(postsCollection, (querySnapshot) => {
    muro.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data(); // Transforma objeto de Firebase a objeto de JS
      // console.log(data.userID);
      const postCard = createPostCard({ ...data, id: doc.id });
      muro.appendChild(postCard);
    });
  });
}

function feed(navigateTo) {
  const section = document.createElement('section');

  const header = document.createElement('div');
  const name = document.createElement('h3');
  const profileName = document.createElement('h4');
  const pictureUser = document.createElement('img');
  const textSignoff = document.createElement('span');
  // const buttonSignoff = document.createElement('img');

  const main = document.createElement('main');

  const postContainer = document.createElement('div');
  const postTitle = document.createElement('p');
  const muro = document.createElement('div');

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

  section.id = 'feedSection';
  header.id = 'header';
  name.classList.add('userName');
  profileName.classList.add('profileName');
  pictureUser.classList.add('pictureUser');
  main.id = 'main';
  postContainer.id = 'postContainer';
  postTitle.classList.add('titles');

  menuContainer.id = 'navbar';
  buttonHome.classList.add('imgNav');
  buttonLikes.classList.add('imgNav');
  buttonPosts.classList.add('imgNav');
  buttonProfile.classList.add('imgNav');
  iconElement.src = iconoNav;
  iconElement.alt = 'New Wave Icon';
  iconElement.classList.add('iconNav');

  // console.log(getAuth().currentUser);
  name.textContent = getAuth().currentUser?.displayName;
  profileName.textContent = getAuth().currentUser?.email;
  pictureUser.src = auth.currentUser?.photoURL ? auth.currentUser?.photoURL : generalUser;

  // generalUser;

  postTitle.textContent = 'LO QUE SE DICE EN NEW WAVE:';

  // buttonSignoff.src = iconoCerrar;
  // buttonSignoff.classList.add('buttonSignoff');
  textSignoff.textContent = 'Cerrar sesión';
  textSignoff.classList.add('specialText');
  textSignoff.addEventListener('click', () => {
    navigateTo('/login');
  });

  loadPosts(muro);

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
  header.append(name, pictureUser, profileName, textSignoff);
  main.append(postContainer);
  postContainer.append(postTitle, muro);
  menuContainer.append(buttonHome, buttonLikes, iconElement, buttonPosts, buttonProfile);
  nav.appendChild(menuContainer);

  section.append(header, main, menuContainer);
  return section;
}

export default feed;
