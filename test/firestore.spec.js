import {
  signInWithPopup,
} from 'firebase/auth';

import {
  deleteDoc, onSnapshot, updateDoc,
} from 'firebase/firestore';

import {
  onGetPosts,
  deletePost,
  updatePost,
  addLike,
  removeLike,
} from '../src/firebase/firebaseConfig';

jest.mock('firebase/auth');
jest.mock('firebase/firestore');

describe('deletePost', () => {
  it('debería ser una función', () => {
    expect(typeof deletePost).toBe('function');
  });

  it('Deberia llamar a la funcion deleteDoc cuando es ejecutada', async () => {
    await deletePost('bjidjg');
    expect(deleteDoc).toHaveBeenCalled();
  });
});

describe('updatePost', () => {
  test('debería editar post', async () => {
    updateDoc.mockReturnValueOnce({ constainer: 'newText' });
    const response = await updatePost('12345', 'newText');
    expect(response.constainer).toBe('newText');
  });

  test('debería llamar a la función updateDoc cuando es ejecutada', async () => {
    await updatePost('12345', 'newText');
    expect(updateDoc).toHaveBeenCalled();
  });
});

describe('addLike', () => {
  test('debería llamar a la función updateDoc cuando es ejecutada', async () => {
    await addLike('add', 'like');
    expect(updateDoc).toHaveBeenCalled();
  });
});

describe('removeLike', () => {
  test('debería llamar a la función updateDoc cuando es ejecutada', async () => {
    await removeLike('add', 'removelike');
    expect(updateDoc).toHaveBeenCalled();
  });
});

describe('onGetPosts', () => {
  it('debería ser una función', () => {
    expect(typeof onGetPosts).toBe('function');
  });

  it('Deberia llamar a la funcion onSnapshot cuando es ejecutada', async () => {
    onGetPosts('bjidjg');
    expect(onSnapshot).toHaveBeenCalled();
  });
});

describe('inicioGoogle', () => {
  it('debería ser una funciónn que crea cuenta con google', () => {
    expect(typeof signInWithPopup).toBe('function');
  });
});
