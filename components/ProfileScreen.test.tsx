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
      getFirstAsync: jest.fn(async (sql: string) => {
        return {
          id: 1,
          username: 'TestUser',
          birthdate: '1990-01-01',
          height: 180,
          gender: 'M',
        };
      }),
      runAsync: jest.fn(async (sql: string, params: any[]) => {}),
    }));
    (setupDatabase as jest.Mock).mockClear();
    (setupDatabase as jest.Mock).mockReturnValue(Promise.resolve());
  });

  test('displays the user name correctly', async () => {
    const { getByPlaceholderText, getByText, getByDisplayValue } = render(
      <UserProvider>
        <ProfileScreen />
      </UserProvider>
    );

    // Fill out the form
    fireEvent.changeText(getByPlaceholderText('Enter your name'), 'TestUser');
    fireEvent.changeText(getByPlaceholderText('YYYY-MM-DD'), '1990-01-01');
    fireEvent.changeText(getByPlaceholderText('Enter your weight'), '70');
    fireEvent.changeText(getByPlaceholderText('Enter your height'), '180');

    // Simulate pressing the confirm button
    fireEvent.press(getByText('Confirm'));

    // Simulate pressing the Show User button
    fireEvent.press(getByText('Show User'));

    // Wait for the username to be displayed in the TextInput
    await waitFor(() => {
      expect(getByDisplayValue('TestUser')).toBeTruthy();
    });
  });
});
