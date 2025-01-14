import * as SQLite from "expo-sqlite";

const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

export const saveActivity = async (
    userId: number,
    activity: {
        name: string;
        description: string;
        calories: number;
        date: string;
    },
) => {
    try {
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");

        await db.withTransactionAsync(async () => {
            await db.runAsync(
                `INSERT INTO Activity (UserId, Name, Description, Calories, Date) VALUES (?, ?, ?, ?, ?)`,
                [
                    userId,
                    activity.name,
                    activity.description,
                    activity.calories,
                    today,
                ],
            );
        });
        console.log("Trying to save activity...");
    } catch (error) {
        console.error("Failed saving activity:", error);
    }

    try {
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        const getActivity = (await db.getFirstAsync(`
            SELECT *
            FROM Activity
            ORDER BY id DESC
            LIMIT 1;
        `)) as {
            Id: number;
            UserId: number;
            Name: string;
            Description: string;
            Calories: number;
            Date: string;
        };

        console.log("Latest activity:", getActivity);
    } catch (error) {
        console.error("Failed getting latest activity:", error);
    }
};

export const deleteActivity = async (activityId: number) => {
    try {
        console.log("Trying to delete activity...");
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        await db.runAsync(`DELETE FROM Activity WHERE Id = ?`, [activityId]);
    } catch (error) {
        console.error("Failed deleting activity:", error);
    }
    console.log("Deleted activity with id:", activityId);
};

export const editActivity = async (
    activityId: number,
    activity: { description: string; calories: number },
) => {
    try {
        console.log("Trying to edit activity...");
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        await db.runAsync(
            `UPDATE Activity SET Description = ?, Calories = ? WHERE Id = ?`,
            [activity.description, activity.calories, activityId],
        );
    } catch (error) {
        console.error("Failed editing activity:", error);
    }
};

export const getTodaysActivities = async () => {
    try {
        const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        const activities = (await db.getAllAsync(`
            SELECT *
            FROM Activity
            WHERE Date = '${today}'
        `)) as {
            UserId: number;
            Id: number;
            Name: string;
            Description: string;
            Calories: number;
            Date: string;
        }[];
        console.log("Todays activities:", activities);
        return activities;
    } catch (error) {
        console.error("Failed getting todays activities:", error);
        return null;
    }
};
