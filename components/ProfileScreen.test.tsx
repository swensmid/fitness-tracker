// ProfileScreen.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileScreen from './ProfileScreen';
import { UserProvider } from './UserContext';
import * as SQLite from 'expo-sqlite';
import setupDatabase from './Database/SQLite';

jest.mock('expo-sqlite');
jest.mock('./Database/SQLite');

describe('ProfileScreen', () => {
  beforeEach(() => {
    // Reset mocks for each test
    (SQLite.openDatabaseAsync as jest.Mock).mockClear();
    (SQLite.openDatabaseAsync as jest.Mock).mockReturnValue(Promise.resolve({
      execAsync: jest.fn(async (sql: string) => {}),
      withTransactionAsync: jest.fn(async (callback: (tx: any) => Promise<void>) => {
        await callback({
          executeSql: (sql: string, params: any[], callback: (tx: any, result: any) => void) => {
            callback(null, {
              rows: {
                length: 1,
                item: (index: number) => ({
                  id: 1,
                  username: 'Max Mustermann',
                  birthdate: '2004-03-20',
                  height: 180,
                  gender: 'M',
                }),
              },
            });
          },
        });
      }),
      getFirstAsync: jest.fn(async (sql: string) => {
        return {
          id: 1,
          username: 'Max Mustermann',
          birthdate: '2004-03-20',
          height: 180,
          gender: 'M',
          weight: 72,
        };
      }),
      runAsync: jest.fn(async (sql: string, params: any[]) => {}),
    }));
    (setupDatabase as jest.Mock).mockClear();
    (setupDatabase as jest.Mock).mockReturnValue(Promise.resolve());
  });

  test('fills the form fields correctly', async () => {
    const { getByPlaceholderText } = render(
      <UserProvider>
        <ProfileScreen />
      </UserProvider>
    );

    // Fill out the form with Testdaten01
    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'Max Mustermann');
    fireEvent.changeText(getByPlaceholderText('YYYY-MM-DD'), '2004-03-20');
    fireEvent.changeText(getByPlaceholderText('Enter your weight'), '72');
    fireEvent.changeText(getByPlaceholderText('Enter your height'), '180');
    fireEvent.changeText(getByPlaceholderText('M/F'), 'M');

    // Check if the fields hold the correct values
    expect(getByPlaceholderText('Enter your name').props.value).toBe('Max Mustermann');
    expect(getByPlaceholderText('YYYY-MM-DD').props.value).toBe('2004-03-20');
    expect(getByPlaceholderText('Enter your weight').props.value).toBe('72');
    expect(getByPlaceholderText('Enter your height').props.value).toBe('180');
    expect(getByPlaceholderText('M/F').props.value).toBe('M');
  });
});
