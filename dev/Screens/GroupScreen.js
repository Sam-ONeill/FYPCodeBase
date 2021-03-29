import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import UploadButton from '../components/UploadButton';
import {AuthContext} from '../Navigation/AuthProvider';
import Loading from '../components/Loading';
import firestore from '@react-native-firebase/firestore';
import {Divider, Title} from 'react-native-paper';
import SignInInput from '../components/SignInInput';
import FlatListButton from '../components/FlatListButton';
import {windowHeight, windowWidth} from '../utils/Dimensions';

export default function GroupScreen({navigation, route}) {
  const {GroupID} = route.params.thread._id;
  const {user, logout} = useContext(AuthContext);
  const [topicName, setTopicName] = useState('');
  const [topicDescr, setTopicDescr] = useState('');
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  function handleButtonPress() {
    if (topicName.length > 0) {
      firestore()
        .collection('Groups')
        .doc(route.params.thread._id)
        .collection('Topics')
        .add({
          topicName: `${topicName} `,
          Description: `${topicDescr} `,
          createdAt: new Date().getTime(),
          system: true,
          subscribedMembers: 1,
          parentID: route.params.thread._id,
        })
        .then((docRef) => {
          docRef.collection('Messages').add({
            text: `You have joined the Topic ${topicName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
        });
    }
  }

  // Webhook
  useEffect(() => {
    // Set Listener
    // Get groups based off parent ID
    // Get all topics within that group in a snapshot
    // Map each topic in snapshot to a thread
    // Set threads globally
    const Listener = firestore()
      .collection('Groups')
      .doc(route.params.thread._id)
      .collection('Topics')
      .onSnapshot((querySnapshot) => {
        const threads = querySnapshot.docs.map((documentSnapshot) => {
          return {
            // Return data to be displayed
            _id: documentSnapshot.id,
            // give defaults
            name: 'Global',
            ...documentSnapshot.data(),
          };
        });
        setThreads(threads);

        //If loading stop
        if (loading) {
          setLoading(false);
        }
      });
    //Return list of topics and update
    return () => Listener();
  }, []);

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
              buttonTitle={item.topicName}
              onPress={() => navigation.navigate('ChatRoom', {thread: item})}>
              <Text>Group Name: {item.name}</Text>
            </FlatListButton>
            <Text style={styles.itemDescription}>{item.Description}</Text>
          </View>
        )}
      />

      <SignInInput
        placeholder="New topic name"
        placeholderTextColor="#000"
        value={topicName}
        onChangeText={(text) => setTopicName(text)}
        clearButtonMode="while-editing"
      />
      <SignInInput
        placeholder="New topic description"
        placeholderTextColor="#000"
        value={topicDescr}
        onChangeText={(text) => setTopicDescr(text)}
        clearButtonMode="while-editing"
      />
      <View style={styles.subContainer}>
        <UploadButton
          buttonTitle="Create"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={() => {
            handleButtonPress();
            setTopicName('');
            setTopicDescr('');
          }}
          disabled={topicName.length === 0}
        />
        <UploadButton buttonTitle="Logout" onPress={() => logout()} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
  },
  listTitle: {
    color: '#000000',
    fontSize: 22,
  },
  listDescription: {
    color: '#000000',
    fontSize: 16,
  },
  text: {
    textAlign: 'center',
    fontSize: 20,
    color: '#333333',
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
