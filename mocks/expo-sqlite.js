// __mocks__/expo-sqlite.js
const mockDB = {
    withTransactionAsync: jest.fn(async (callback) => {
      await callback({
        executeSql: (sql, params, callback) => {
          callback({
            rows: {
              length: 1,
              item: () => ({
                id: 1,
                username: 'TestUser',
                birthdate: '1990-01-01',
                height: 180,
                gender: 'M',
              }),
            },
          });
        },
      });
    }),
    getFirstAsync: jest.fn(async (sql) => {
      return {
        id: 1,
        username: 'TestUser',
        birthdate: '1990-01-01',
        height: 180,
        gender: 'M',
      };
    }),
    runAsync: jest.fn(async (sql, params) => {}),
  };
  
  const openDatabaseAsync = jest.fn(() => Promise.resolve(mockDB));
  
  export { openDatabaseAsync };
  