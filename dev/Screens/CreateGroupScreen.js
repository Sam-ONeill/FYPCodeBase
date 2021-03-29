import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import UploadButton from '../components/UploadButton';
import SignInInput from '../components/SignInInput';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../Navigation/AuthProvider';

export default function CreateGroupScreen({navigation}) {
  const [groupName, setgroupName] = useState('');
  const [groupDescr, setgroupDescr] = useState('');
  const {user} = useContext(AuthContext);
  const [selectedUser, setSelectedUser] = useState();
  /**
   * Create a new Firestore collection to save threads
   */
  function handleButtonPress() {
    if (groupName.length > 0) {
      firestore()
        .collection('Groups')
        .add({
          name: groupName,
          amountOfMembers: 1,
          description: groupDescr,
        })
        .then((docRef) => {
          let parentID = docRef._documentPath._parts[1];
          docRef
            .collection('Topics')
            .add({
              topicName: `${groupName} General`,
              createdAt: new Date().getTime(),
              system: true,
              subscribedMembers: 1,
              parentID: parentID,
              Description: ` This is the General topic for the ${groupName} group`,
            })
            .then((docRef) => {
              docRef.collection('Messages').add({
                text: `You have joined the Topic ${groupName} General.`,
                createdAt: new Date().getTime(),
                system: true,
              });
              navigation.navigate('Home');
            });
          firestore()
            .collection('users')
            .doc(user.uid)
            .update({
              ListOfGroupID: firestore.FieldValue.arrayUnion(parentID),
              ListOfGroupNames: firestore.FieldValue.arrayUnion(groupName),
            });
        });

      /*
      firestore()
        .collection('Groups')
        .add({
          name: groupName,
          latestMessage: {
            text: `You have joined the room ${groupName}.`,
            createdAt: new Date().getTime(),
          },
        })
        .then((docRef) => {
          docRef.collection('MESSAGES').add({
            text: `You have joined the room ${groupName}.`,
            createdAt: new Date().getTime(),
            system: true,
          });
          navigation.navigate('Home');
        });
      */
    }
  }
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('users')
      .onSnapshot((querySnapshot) => {
        const selectedUser = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            name: 'defaultUser',
            ...documentSnapshot.data(),
          };
        });
        setSelectedUser(selectedUser);
      });

    /**
     * unsubscribe listener
     */
    return () => unsubscribe();
  }, []);
  return (
    <View style={styles.rootContainer}>
      <View style={styles.closeButtonContainer}>
        {/* <UploadButton
          buttonTitle="Go back"
          color="#6646ee"
          onPress={() => navigation.goBack()}
        /> */}
      </View>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Name Your Group and Add a Description</Text>
        <SignInInput
          placeholder="Group Name"
          placeholderTextColor="#000"
          value={groupName}
          onChangeText={(text) => setgroupName(text)}
          clearButtonMode="while-editing"
        />
        <SignInInput
          placeholder="Group Description"
          placeholderTextColor="#000"
          value={groupDescr}
          onChangeText={(text) => setgroupDescr(text)}
          clearButtonMode="while-editing"
        />
        <UploadButton
          buttonTitle="Create"
          modeValue="contained"
          labelStyle={styles.buttonLabel}
          onPress={() => handleButtonPress()}
          disabled={groupName.length === 0}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 30,
    right: 0,
    zIndex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  buttonLabel: {
    fontSize: 22,
  },
});
