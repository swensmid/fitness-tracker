import * as SQLite from "expo-sqlite";

export const logActivity = async (
  userId: number,
  activity: {
    name: string;
    description: string;
    durationMinutes: number;
    distanceKm: number | null;
    calories: number;
    date: Date;
  }
) => {
  const { name, description, durationMinutes, distanceKm, calories, date } =
    activity;
  const db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
  const result = await db.runAsync(
    `
    INSERT INTO Aktivitaet (UserId, Name, Beschreibung, Dauer_Minuten, Distanz_Km, Kalorien, Datum)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `,
    [
      userId,
      name,
      description,
      durationMinutes,
      distanceKm,
      calories,
      date.toISOString(),
    ]
  );
  return result;
};
