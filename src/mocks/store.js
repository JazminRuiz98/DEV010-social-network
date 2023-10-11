export const getFirestore = () => {};
export const query = () => {};
export const collection = () => {};

export const getDocs = () => Promise.resolve(
  [
    {
      data: () => ({
        title: 'X',
        description: 'Y',
      }),
    },
  ],
);
