// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import loadPosts from '../src/routes/feed';

describe('loadPosts', () => {
  it('Mostrar un post', async () => {
    const mockPosts = [
      { avatar: 'https://foto.jpg', content: 'Contenido del post 1', userId: 'user123' },
    ];

    const post = loadPosts(mockPosts);

    expect(post).toBeDefined();
  });
});
