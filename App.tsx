import { useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native';
import { setupDatabase } from './components/Database/SQLite';

export default function App() {
  useEffect(() => {

    const initializeDatabase = async () => {
      try {

        await setupDatabase();
      } catch (error) {
        console.error('Failed:', error)
      }
    };
    initializeDatabase();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
