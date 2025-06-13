import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import * as SQLite from "expo-sqlite";
import setupDatabase from "./Database/SQLite";

type User = {
    id?: number;
    username?: string;
    birthdate?: string;
    height?: number;
    gender?: string;
    weight?: number;
};

type UserContextType = {
    user: User | null;
    saveUser: (newUser: User) => Promise<void>;
    calories: number;
    setCalories: React.Dispatch<React.SetStateAction<number>>;
    getDailyCalories: () => Promise<number | null | undefined>;
    calorieBaseRate: number;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

interface Props {
    children: ReactNode;
}

export const UserProvider = ({ children }: Props) => {
    const [user, setUser] = useState<User | null>(null);
    const [calories, setCalories] = useState(0);
    const [calorieBaseRate, setCalorieBaseRate] = useState(0);
    const verbose = false;

    // Calculate BMR from user data
    const calculateBMR = (userData: User | null): number => {
        if (!userData) return 0;
        const { weight, height, gender, birthdate } = userData;
        if (!weight || !height || !birthdate) return 0;

        const birth = new Date(birthdate);
        if (!(birth instanceof Date) || isNaN(birth.valueOf())) return 0;

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age <= 0) return 0;

        // Mifflin-St Jeor Equation
        return Math.round(
            10 * weight + 6.25 * height - 5 * age + (gender === "M" ? 5 : -161)
        );
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                await setupDatabase();

                const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
                await db.withTransactionAsync(async () => {
                    const resultUser = await db.getFirstAsync<User>(`
                        SELECT ID AS id, Username AS username, Birthdate AS birthdate,
                               Height_cm AS height, Gender AS gender
                        FROM User WHERE ID = 1
                    `);

                    let weight: number | undefined;
                    const resultWeight = await db.getFirstAsync<{ weight?: string | number }>(`
                        SELECT Weight AS weight FROM Weight
                        WHERE UserID = 1 ORDER BY Date DESC LIMIT 1
                    `);

                    if (resultWeight?.weight !== undefined) {
                        const raw = resultWeight.weight;
                        weight = typeof raw === "number"
                            ? raw
                            : !isNaN(Number(raw))
                            ? Number(raw)
                            : undefined;
                    }

                    const combinedUser = resultUser
                        ? { ...resultUser, weight }
                        : weight !== undefined
                        ? { weight }
                        : null;

                    if (verbose) console.log("Loaded user from DB:", combinedUser);
                    setUser(combinedUser);

                    // Update BMR when user loads
                    setCalorieBaseRate(calculateBMR(combinedUser));
                });
            } catch (error) {
                console.error("Database init failed:", error);
            }
        };
        initialize();
    }, []);

    const saveUser = async (newUser: User): Promise<void> => {
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
                        newUser.username ?? "",
                        newUser.birthdate ?? "",
                        newUser.height ?? 0,
                        newUser.gender ?? "",
                    ]
                );

                let weightValue: number | null = null;
                if (typeof newUser.weight === "number") {
                    weightValue = newUser.weight;
                } else if (typeof newUser.weight === "string") {
                    const parsed = Number(newUser.weight);
                    weightValue = isNaN(parsed) ? null : parsed;
                }

                if (weightValue !== null) {
                    await db.runAsync(
                        `INSERT INTO Weight (UserID, Weight, Date)
                         VALUES (1, ?, datetime('now'))`,
                        weightValue
                    );
                }

                const latestWeight = await db.getFirstAsync<{ weight?: number }>(`
                    SELECT Weight AS weight FROM Weight
                    WHERE UserID = 1 ORDER BY Date DESC LIMIT 1
                `);

                const updatedUser: User = {
                    id: 1,
                    ...newUser,
                    weight: latestWeight?.weight ?? weightValue ?? undefined,
                };

                if (verbose) console.log("Saved user:", updatedUser);
                setUser(updatedUser);

                // Update BMR after saving user
                setCalorieBaseRate(calculateBMR(updatedUser));
            });
        } catch (error) {
            console.error("Error in saveUser:", error);
        }
    };

    const getDailyCalories = async (): Promise<number | null | undefined> => {
        try {
            const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
            const today = new Date().toISOString().split("T")[0];

            const result = await db.getFirstAsync<{ totalCalories?: number }>(`
                SELECT SUM(Calories) AS totalCalories
                FROM Activity
                WHERE Date = '${today}'
            `);

            const total = result?.totalCalories ?? 0;

            if (verbose) console.log("Today's calories:", total);
            setCalories(total);
            return total;
        } catch (error) {
            console.error("Error in getDailyCalories:", error);
            return undefined;
        }
    };

    return (
        <UserContext.Provider
            value={{ user, saveUser, calories, setCalories, getDailyCalories, calorieBaseRate }}
        >
            {children}
        </UserContext.Provider>
    );
};
