// ProfileScreen.test.tsx
import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import ProfileScreen from "./ProfileScreen";
import { UserProvider } from "./UserContext";
import * as SQLite from "expo-sqlite";
import setupDatabase from "./Database/SQLite";

jest.mock("expo-sqlite");
jest.mock("./Database/SQLite");

describe("ProfileScreen", () => {
    beforeEach(() => {
        const mockDB = {
            execAsync: jest.fn(),
            withTransactionAsync: jest.fn(async (callback: any) => {
                await callback({
                    executeSql: (
                        sql: string,
                        params: any[],
                        cb: (tx: any, result: any) => void
                    ) => {
                        cb(null, {
                            rows: {
                                length: 1,
                                item: () => ({
                                    id: 1,
                                    username: "Max Mustermann",
                                    birthdate: "2004-03-20",
                                    height: 180,
                                    gender: "M",
                                    weight: 72,
                                }),
                            },
                        });
                    },
                });
            }),
            getFirstAsync: jest.fn(async () => ({
                id: 1,
                username: "Max Mustermann",
                birthdate: "2004-03-20",
                height: 180,
                gender: "M",
                weight: 72,
            })),
            runAsync: jest.fn(),
        };

        (SQLite.openDatabaseAsync as jest.Mock).mockClear();
        (SQLite.openDatabaseAsync as jest.Mock).mockReturnValue(Promise.resolve(mockDB));
        (setupDatabase as jest.Mock).mockClear();
        (setupDatabase as jest.Mock).mockResolvedValue(undefined);
    });

    test("fills the form fields correctly", async () => {
        const { getByPlaceholderText } = render(
            <UserProvider>
                <ProfileScreen />
            </UserProvider>
        );

        const nameInput = getByPlaceholderText("Enter your name");
        const birthdateInput = getByPlaceholderText("YYYY-MM-DD");
        const weightInput = getByPlaceholderText("Enter your weight");
        const heightInput = getByPlaceholderText("Enter your height");
        const genderInput = getByPlaceholderText("M/F");

        await act(async () => {
            fireEvent.changeText(nameInput, "Max Mustermann");
            fireEvent.changeText(birthdateInput, "2004-03-20");
            fireEvent.changeText(weightInput, "72");
            fireEvent.changeText(heightInput, "180");
            fireEvent.changeText(genderInput, "M");
        });

        expect(nameInput.props.value).toBe("Max Mustermann");
        expect(birthdateInput.props.value).toBe("2004-03-20");
        expect(weightInput.props.value).toBe("72");
        expect(heightInput.props.value).toBe("180");
        expect(genderInput.props.value).toBe("M");
    });
});
