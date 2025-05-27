import React, { createContext, useContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import setupDatabase from "./Database/SQLite";

type User = {
    id?: number;
    username?: string;
    birthdate?: string;
    height?: number;
    gender?: string;
    weight?: string | number;
};

type UserContextType = {
    user: User | null;
    saveUser: (newUser: User) => Promise<void>;
    calories: number;
    setCalories: React.Dispatch<React.SetStateAction<number>>;
    getDailyCalories: () => Promise<number | null | undefined>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => useContext(UserContext)!;

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [calories, setCalories] = useState(0);

    useEffect(() => {
        const initializeDatabase = async () => {
            try {
                await setupDatabase();
            } catch (error) {
                console.error("Failed:", error);
            }
        };
        initializeDatabase();
        async function getDatabase() {
            const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");

            await db.withTransactionAsync(async () => {
                const resultUser = await db.getFirstAsync(`SELECT
                                                                     ID AS id,
                                                                     Username AS username,
                                                                     Birthdate AS birthdate,
                                                                     Height_cm AS height,
                                                                     Gender AS gender
                                                                  FROM User WHERE ID = 1`);
                const resultWeight = await db.getFirstAsync<{ weight?: string | number }>(
                    `SELECT Weight AS weight FROM Weight WHERE UserID = 1 ORDER BY Date DESC`,
                );
                let weight = resultWeight?.weight;
                if (typeof weight === "string") {
                    try {
                        weight = JSON.parse(weight);
                        if (Array.isArray(weight)) {
                            weight = weight[0];
                        }
                    } catch (error) {
                        console.error("Error parsing weight:", error);
                        weight = undefined;
                    }
                }
                const userWithWeight = resultUser ? { ...resultUser, weight } : { weight };
                console.log(userWithWeight);
                setUser(userWithWeight);
            });
        }
        getDatabase();
    }, []);

    interface SaveUserParams {
        id?: number;
        username?: string;
        birthdate?: string;
        height?: number;
        gender?: string;
        weight?: string | number;
    }

    const saveUser = async (newUser: SaveUserParams): Promise<void> => {
        try {
            const db: SQLite.SQLiteDatabase = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
            await db.withTransactionAsync(async () => {
                await db.runAsync(
                    `INSERT INTO User (ID, Username, Birthdate, Height_cm, Gender)
                     VALUES (1, ?, ?, ?, ?)
                     ON CONFLICT(ID) DO UPDATE SET
                         Username=excluded.Username,
                         Birthdate=excluded.Birthdate,
                         Height_cm=excluded.Height_cm,
                         Gender=excluded.Gender`,
                    [
                        newUser.username !== undefined ? newUser.username : "",
                        newUser.birthdate !== undefined ? newUser.birthdate : "",
                        newUser.height !== undefined ? newUser.height : 0,
                        newUser.gender !== undefined ? newUser.gender : "",
                    ],
                );
                console.log("User saved successfully!");

                // Ensure weight is a number or null
                let weightValue: number | null = null;
                if (typeof newUser.weight === "number") {
                    weightValue = newUser.weight;
                } else if (typeof newUser.weight === "string") {
                    const parsed = Number(newUser.weight);
                    weightValue = isNaN(parsed) ? null : parsed;
                } else {
                    weightValue = null;
                }
                await db.runAsync(
                    `INSERT INTO Weight (UserID, Weight, Date)
                     VALUES (1, ?, datetime('now'))`,
                    weightValue !== null && weightValue !== undefined ? weightValue : 0,
                );
                console.log("Weight saved successfully!");

                const resultWeight: { weight?: string | number } | undefined = (await db.getFirstAsync(
                    `SELECT Weight AS weight FROM Weight
                     WHERE UserID = 1
                     ORDER BY Date DESC
                     LIMIT 1`,
                )) ?? undefined;

                let weight: string | number | undefined = resultWeight?.weight;
                if (typeof weight === "string") {
                    weight = JSON.parse(weight)[0];
                }

                setUser({
                    id: 1,
                    ...newUser,
                    weight,
                });

                console.log("User and weight updated in context:", {
                    id: 1,
                    ...newUser,
                    weight,
                });
            });
        } catch (error) {
            console.error("Error in saveUser:", error);
        }
    };

    const getDailyCalories = async () => {
        try {
            const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
            const today = new Date().toISOString().split("T")[0];

            const checkForActivityToday = await db.getFirstAsync(`
                SELECT EXISTS (SELECT * FROM Activity WHERE Date = '${today}');
            `);

            if (!checkForActivityToday) {
                console.log("No activity for today");
                return null;
            } else {
                const dailyCalories = (await db.getFirstAsync(`
                SELECT SUM(Calories) AS totalCalories
                FROM Activity
                WHERE Date = '${today}'
            `)) as { totalCalories: number };

                const totalCalories = dailyCalories.totalCalories;
                console.log("Todays total calories:", totalCalories);
                setCalories(totalCalories);
                return totalCalories;
            }
        } catch (error) {
            console.error("Error in getDailyCalories:", error);
        }
    };

    return (
        <UserContext.Provider
            value={{ user, saveUser, calories, setCalories, getDailyCalories }}
        >
            {children}
        </UserContext.Provider>
    );
};
