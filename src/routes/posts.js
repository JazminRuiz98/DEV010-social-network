import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {
  auth, db, deletePost, updatePost, addLike, removeLike,
} from '../firebase/firebaseConfig';
import iconoNav from '../assets/iconoBlanco.png';
import generalUser from '../assets/general-user.png';
import likeRosa from '../assets/iconos/icono-like-on.png';
import likeGris from '../assets/iconos/icono-like-off.png';
import navHome from '../assets/iconos/icono-home-off.png';
import navLikes from '../assets/iconos/icono-likes-off.png';
import navPosts from '../assets/iconos/icono-post-on.png';
import navProfile from '../assets/iconos/icono-profile-off.png';

// Crear una card que contenga cada post
export function createPostCard(data) { /* cambio de content por data */
  const card = document.createElement('div');
  card.classList.add('post-card');
  const pictureUser = document.createElement('img');
  pictureUser.classList.add('user-img');
  pictureUser.src = data.avatar.includes('example') ? generalUser : data.avatar;
  // pictureUser.src = data.avatar || generalUser;
  const userNameElement = document.createElement('h3');
  userNameElement.classList.add('user-name');
  userNameElement.textContent = data.userName;
  const contentElement = document.createElement('p');
  contentElement.classList.add('post');
  contentElement.textContent = data.content;
  const dateElement = document.createElement('p');
  dateElement.classList.add('date');
  const date = data.createdAt.toDate();
  dateElement.textContent = `${date.toLocaleDateString()}`;
  // Convierte fecha a una cadena legible

  const buttonEdit = document.createElement('button');
  buttonEdit.classList.add('btn-edit');
  buttonEdit.textContent = 'Editar';

  const buttonDelete = document.createElement('button');
  buttonDelete.classList.add('btn-delete');
  buttonDelete.textContent = 'Borrar';
  buttonDelete.addEventListener('click', () => {
    deletePost(data.id);
  });

  let editStatus = false;
  let id = '';

  buttonEdit.addEventListener('click', async () => {
    if (editStatus) {
      return; // Evitar que se inicie otra edición mientras una está en curso
    }

    editStatus = true;
    id = data.id;

    buttonDelete.style.display = 'none';
    buttonEdit.style.display = 'none';

    const originalContent = contentElement.textContent; // Guardar el contenido original

    const textArea = document.createElement('textarea');
    textArea.classList.add('post'); // Añadir la misma clase que el elemento original
    textArea.value = originalContent;
    const newContentElement = card.querySelector('.post');
    // Reemplazar el elemento original con el textarea
    card.replaceChild(textArea, newContentElement);

    const buttonEditSave = document.createElement('button');
    buttonEditSave.classList.add('btn-editSave');
    buttonEditSave.textContent = 'Guardar';

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('btn-cancel');
    buttonCancel.textContent = 'Cancelar';

    // Agregar botones "Save" y "Cancel"
    card.appendChild(buttonEditSave);
    card.appendChild(buttonCancel);

    buttonEditSave.addEventListener('click', async () => {
      const updateContent = textArea.value;
      await updatePost(data.id, { content: updateContent }); /* revisar si es id, o data.id */

      // Restaurar el contenido original
      contentElement.textContent = updateContent;

      // Mostrar los botones "Edit" y "Delete" nuevamente
      buttonDelete.style.display = 'block';
      buttonEdit.style.display = 'block';

      // Remover el textarea y los botones "Save" y "Cancel"
      card.removeChild(textArea);
      card.removeChild(buttonEditSave);
      card.removeChild(buttonCancel);

      editStatus = false; // Finalizar la edición
    });

    buttonCancel.addEventListener('click', () => {
      // Restaurar el contenido original
      contentElement.textContent = originalContent;

      // Crear un nuevo elemento <p> con el contenido original
      const ContentElement = document.createElement('p');
      ContentElement.classList.add('post');
      ContentElement.textContent = originalContent;

      // Reemplazar el <textarea> por el nuevo elemento <p>
      card.replaceChild(ContentElement, textArea);

      // Mostrar los botones "Edit" y "Delete" 
      buttonDelete.style.display = 'block';
      buttonEdit.style.display = 'block';

      // Eliminar los botones "Save" y "Cancel"
      card.removeChild(buttonEditSave);
      card.removeChild(buttonCancel);
      // card.removeChild(textArea);

      editStatus = false; // Cancelar la edición
    });
  });
  const buttonLike = document.createElement('img');
  buttonLike.classList.add('like');
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
  card.append(pictureUser, userNameElement, dateElement, contentElement, buttonLike, likesCount, buttonDelete, buttonEdit);
  // console.log(card); /* muestra el contenido escrito en el posts */
  return card;
}

// Cargar posts de Firestore
function loadUserPosts(myPosts) {
  // console.log(auth.currentUser.user.uid);
  const postsCollection = collection(db, 'posts');
  onSnapshot(postsCollection, (querySnapshot) => {
    myPosts.innerHTML = '';
    querySnapshot.forEach((doc) => {
      const data = doc.data(); // Transforma objeto de Firebase a objeto de JS
      if (data.userID === auth.currentUser.uid) {
        const postCard = createPostCard({ ...data, id: doc.id });
        myPosts.appendChild(postCard);
      }
    });
  });
}

// Añadir un post a Firestore
export function addPost({
  content,
}) {
  return new Promise((resolve, reject) => {
  // al resolver la promesa resolve indica que la promesa se resuelve correctamente,
  // reject  indica que la promesa ha sido rechazada

    addDoc(collection(db, 'posts'), {
    // Añade un documento a la colección posts en la base de datos en firestore
    // El primer arg es la ref a post a partir de la bd y el segundo arg es un objeto
    // que contiene los datos del doc que agregaremos
      avatar: auth.currentUser.photoURL ? auth.currentUser.photoURL : generalUser,
      content,
      userID: auth.currentUser.uid,
      userName: auth.currentUser.displayName,
      createdAt: new Date(), // Fecha y hora de creación del post
      likesCount: 0, // likes en el post
      sharedCount: 0, // cuántas veces se compartió
      likes: [],
    })
      .then((docRef) => {
        console.log('Publicación agregada con ID: ', docRef.id);
        resolve(docRef.id);
      })
      .catch((error) => {
        console.error('Error al agregar la publicación: ', error);
        reject(error);
      });
  });
}

function posts(navigateTo) {
  const section = document.createElement('section');

  const header = document.createElement('div');
  const name = document.createElement('h3');
  const profileName = document.createElement('h4');
  const pictureUser = document.createElement('img');

  const main = document.createElement('main');

  const postContainer = document.createElement('div');
  const postTitle = document.createElement('p');
  const postInput = document.createElement('input');
  const buttonPost = document.createElement('button');

  const myPostsContainer = document.createElement('div');
  const myPostsTitle = document.createElement('p');
  const myPosts = document.createElement('div');

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

  section.id = 'postsSection';
  header.id = 'header';
  name.classList.add('userName');
  profileName.classList.add('profileName');
  pictureUser.classList.add('pictureUser');
  main.id = 'main';
  postContainer.id = 'postContainer';
  postTitle.classList.add('titles');
  postInput.classList.add('inputPost');
  buttonPost.id = 'btnPost';

  myPostsContainer.id = 'myPostsContainer';
  myPostsTitle.classList.add('titles');

  menuContainer.id = 'navbar';
  buttonHome.classList.add('imgNav');
  buttonLikes.classList.add('imgNav');
  buttonPosts.classList.add('imgNav');
  buttonProfile.classList.add('imgNav');
  // buttonProfile.src = iconoProfile;
  iconElement.src = iconoNav;
  iconElement.alt = 'New Wave Icon';
  iconElement.classList.add('iconNav');

  name.textContent = getAuth().currentUser?.displayName;
  profileName.textContent = getAuth().currentUser?.email;
  pictureUser.src = auth.currentUser?.photoURL ? auth.currentUser?.photoURL : generalUser;

  postTitle.textContent = 'CREAR UN POST:';
  postInput.placeholder = 'Escribe tu publicación aquí';
  buttonPost.textContent = 'POST';

  myPostsTitle.textContent = 'TUS POSTS:';

  // Llama a la función loadPosts y pásale myPosts como argumento
  loadUserPosts(myPosts);

  buttonPost.addEventListener('click', () => {
    const content = postInput.value;
    if (content) {

      addPost({
        avatar: auth.currentUser.photoURL, // ? auth.currentUser.photoURL : 'https://img.freepik.com/vector-gratis/ilustracion-icono-avatar-usuario_53876-5907.jpg?w=826&t=st=1695778431~exp=1695779031~hmac=d4122e27770a7ad67f3ab2561940aeaed1aefd69914d149cf76a9928d1f5bd8c',
        // auth.currentUser.photoURL ? auth.currentUser.photoURL : generalUser;
        content,
        userID: 'ID_DEL_USUARIO', // se usa??
        userName: 'Nombre de usuario',
      })
        .then((postId) => {
          // myPosts.innerHTML = '';
          console.log('Publicación agregada con ID: ', postId);
          // Borra el contenido del input después de publicar
          postInput.value = '';
        })
        .catch((error) => {
          console.error('Error al agregar la publicación: ', error);
        });
    }
  });

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
  main.append(postContainer, myPostsContainer);
  postContainer.append(postTitle, postInput, buttonPost);
  myPostsContainer.append(myPostsTitle, myPosts);
  menuContainer.append(buttonHome, buttonLikes, iconElement, buttonPosts, buttonProfile);
  nav.appendChild(menuContainer);

  section.append(header, main, menuContainer);
  return section;
}
export default posts;