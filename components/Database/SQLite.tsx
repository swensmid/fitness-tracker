import * as SQLite from 'expo-sqlite';
import 'setimmediate';


let db: any;

// create user



export const setupDatabase = async () => {
    db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
    try {
        await db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS User (
    ID INT PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Birthdate DATE,
    Height_cm DECIMAL(5,2),
    Gender CHAR(1)
);

CREATE TABLE IF NOT EXISTS Food (
    Id INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    Calories_100g DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS Weight (
    ID INT PRIMARY KEY,
    UserID INT,
    Weight DECIMAL(5,2) NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (UserID) REFERENCES User(ID)
);

CREATE TABLE IF NOT EXISTS Activity (
    Id INT PRIMARY KEY,
    UserId INT,
    Date DATE NOT NULL,
    Calories DECIMAL(10,2) NOT NULL,
    Name VARCHAR(255),
    FOREIGN KEY (UserId) REFERENCES User(ID)
);

CREATE TABLE IF NOT EXISTS ConsumedFood (
    Id INT PRIMARY KEY,
    UserId INT,
    Name VARCHAR(255) NOT NULL,
    Calories DECIMAL(10,2) NOT NULL,
    Date DATE NOT NULL,
    FOREIGN KEY (UserId) REFERENCES User(ID)
);

       `)
        console.log(db)
    } catch (error) {
        console.error("Error setting up database:", error);
    }
}

export default setupDatabase;

/*
export default function Sqlite() {

    useEffect(() => {
        console.log('Test2')
        setupDatabase();
    }, []);

    const setupDatabase = async () => {
        db = await SQLite.openDatabaseAsync("DatabaseFitnessTracker");
        try {
            await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS User (
            ID INT PRIMARY KEY,
            Username VARCHAR(255) NOT NULL,
            Geburtsdatum DATE,
            Groesse_cm DECIMAL(5,2),
            Geschlecht CHAR(1)
            );

            CREATE TABLE IF NOT EXISTS Food (
            Id INT PRIMARY KEY,
            Name VARCHAR(255) NOT NULL,
            Kalorien_100g DECIMAL(10,2) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS Gewicht (
            ID INT PRIMARY KEY,
            UserID INT,
            Gewicht DECIMAL(5,2) NOT NULL,
            Datum DATE NOT NULL,
            FOREIGN KEY (UserID) REFERENCES User(ID)
            );

            CREATE TABLE IF NOT EXISTS Aktivitaet (
            Id INT PRIMARY KEY,
            UserId INT,
            Datum DATE NOT NULL,
            Kalorien DECIMAL(10,2) NOT NULL,
            Name VARCHAR(255),
            FOREIGN KEY (UserId) REFERENCES User(ID)
            );

            CREATE TABLE IF NOT EXISTS EatenFood (
            Id INT PRIMARY KEY,
            UserId INT,
            Name VARCHAR(255) NOT NULL,
            Kalorien DECIMAL(10,2) NOT NULL,
            Datum DATE NOT NULL,
            FOREIGN KEY (UserId) REFERENCES User(ID)
            );
           `)
            console.log(db)
        } catch (error) {
            console.error("Error setting up database:", error);
        }
    }
}


*/