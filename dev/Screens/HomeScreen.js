import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import UploadButton from '../components/UploadButton';
import {AuthContext} from '../Navigation/AuthProvider';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import { Divider} from 'react-native-paper';
import FlatListButton from '../components/FlatListButton';
import {windowHeight, windowWidth} from '../utils/Dimensions';
export default function HomeScreen({navigation}) {
  const {user, logout} = useContext(AuthContext);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Groups')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: 'Global',
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);

        if (loading) {
          setLoading(false);
        }
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);
  // Creating username in database
  const atPos = user.email.indexOf('@');
  const UserName = user.email.slice(0, atPos);
  firestore()
    .collection('users')
    .doc(user.uid)
    .get({
      UserName: UserName,
    })
    .then((documentSnapshot) => {
      if (documentSnapshot.data().Username !== UserName) {
        firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            Username: UserName,
          })
          .then(() => {
            console.log('User updated!');
          });
      }
    });

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={threads}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <View style={styles.flatListContainer}>
            <FlatListButton
              buttonTitle={item.name}
              onPress={() => navigation.navigate('GroupPage', {thread: item})}>
              <Text>Group Name: {item.name}</Text>
            </FlatListButton>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        )}
      />
      <UploadButton buttonTitle="Logout" onPress={() => logout()} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    fontSize: 24,
  },
  listTitle: {
    color: '#000000',
    fontSize: 30,
  },
  listDescription: {
    color: '#000000',
    fontSize: 24,
  },
  text: {
    textAlign: 'center',
    fontSize: 24,
    color: '#333333',
  },
  selectButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#8ac6d1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadButton: {
    borderRadius: 5,
    width: 150,
    height: 50,
    backgroundColor: '#ffb6b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContainer: {
    height: windowHeight / 5,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
  },
  itemDescription: {
    marginRight: windowWidth / 2,
    marginLeft: windowWidth / 25,
    justifyContent: 'space-evenly',
  },
});
