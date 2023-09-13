function home(navigateTo) {
  const section = document.createElement('section');
  const title = document.createElement('h2');
  const button = document.createElement('button');

  button.textContent = 'ENTRAR';
  button.addEventListener('click', () => {
    navigateTo('/login');
  });
  title.textContent = 'Bienvenidas a New Wave';

  section.append(title, button);
  return section;
}

export default home;
