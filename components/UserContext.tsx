import React, { createContext, useContext, useState, useEffect } from "react";
import * as SQLite from "expo-sqlite";
import setupDatabase from "./Database/SQLite";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: any) => {
    const [user, setUser] = useState(null);
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
                const resultWeight = await db.getFirstAsync(
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
                        weight = null;
                    }
                }
                const userWithWeight = { ...resultUser, weight };
                console.log(userWithWeight);
                setUser(userWithWeight);
            });
        }
        getDatabase();
    }, []);

    const saveUser = async (newUser) => {
        try {
            const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
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
                        newUser.username,
                        newUser.birthdate,
                        newUser.height,
                        newUser.gender,
                    ],
                );
                console.log("User saved successfully!");

                await db.runAsync(
                    `INSERT INTO Weight (UserID, Weight, Date)
                     VALUES (1, ?, datetime('now'))`,
                    [newUser.weight],
                );
                console.log("Weight saved successfully!");

                const resultWeight = await db.getFirstAsync(
                    `SELECT Weight AS weight FROM Weight
                     WHERE UserID = 1
                     ORDER BY Date DESC
                     LIMIT 1`,
                );

                let weight = resultWeight?.weight;
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
                WHERE UserId = 1 AND Date = '${today}'
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
