import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import {SQLiteProvider} from 'expo-sqlite/next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import * as FileSystem from 'expo-file-system';
import {Asset} from 'expo-asset';

const loadDatabase = async () => {
  const dbName = 'mySQLiteDB.db';
  const dbAsset = "./assets/mySQLiteDB.db";
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);

  if(!fileInfo.exists){
    FileSystem.makeDirectoryAsync(
      `${FileSystem.makeDirectoryAsync}SQLite`,
      {intermediates:true}
    );
    await FileSystem.downloadAsync(dbUri,dbFilePath);

  }
}

export default function App() {

  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(()=> {
    loadDatabase()
    .then(()=> setDbLoaded(true))
    .catch((e)=>console.log(e))
  },[]);

  if(!dbLoaded) return (
  <View style={{flex:1}}>
    <ActivityIndicator size={"large"}/>
    <Text>Loading...</Text>;
    </View>
  );
  
  return (
   <React.Suspense>
    <SQLiteProvider databaseName='mySQLiteDB.db' useSuspense={true}>

    </SQLiteProvider>
   </React.Suspense>
  );
};
