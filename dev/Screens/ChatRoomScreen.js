import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  Actions,
  GiftedChat,
  ActionsProps,
  Bubble,
  Send,
} from 'react-native-gifted-chat';
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Image,
  DrawerLayoutAndroid,
  FlatList,
  Alert,
  Text,
} from 'react-native';
import {AuthContext} from '../Navigation/AuthProvider';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import windowWidth, {windowHeight} from '../utils/Dimensions';
import {Divider} from 'react-native-paper';
export default function ChatRoomScreen({route}) {
  const {thread} = route.params;
  const {user} = useContext(AuthContext);
  const currentUser = user.toJSON();
  const drawer = useRef(null);
  const [Images, setImages] = useState([]);
  const [messages, setMessages] = useState([
    // example of system message
    {
      _id: 0,
      text: 'New room created.',
      createdAt: new Date().getTime(),
      system: true,
    },
    // example of chat message
    {
      _id: 1,
      text: 'Hello!',
      createdAt: new Date().getTime(),
      user: {
        _id: 2,
        name: 'Test User',
      },
    },
  ]);
  // Set Username
  const atPos = user.email.indexOf('@');
  const UserName = user.email.slice(0, atPos);

  // helper method that is sends a message
  async function handleSend(messages) {
    const text = messages[0].text;

    firestore()
      .collection('Groups')
      .doc(thread.parentID)
      .collection('Topics')
      .doc(thread._id)
      .collection('Messages')
      .add({
        text,
        createdAt: new Date().getTime(),
        user: {
          _id: currentUser.uid,
          email: currentUser.email,
        },
      });
    await firestore()
      .collection('Groups')
      .doc(thread.parentID)
      .set(
        {
          latestMessage: {
            text,
            createdAt: new Date().getTime(),
          },
        },
        {merge: true},
      );
  }
  useEffect(() => {
    // Check database for messages
    // order all data returned by last created
    // map message data into messages
    // Repeat on update
    const messagesListener = firestore()
      .collection('Groups')
      .doc(thread.parentID)
      .collection('Topics')
      .doc(thread._id)
      .collection('Messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((doc) => {
          const firebaseData = doc.data();

          const data = {
            _id: doc.id,
            text: '',
            createdAt: new Date().getTime(),
            ...firebaseData,
          };

          if (!firebaseData.system) {
            data.user = {
              ...firebaseData.user,
              name: firebaseData.user.email,
            };
          }

          return data;
        });

        setMessages(messages);
      });
    return () => {
      messagesListener();
    };
  }, []);
  useEffect(() => {
    const imageListener = firestore()
      .collection('Groups')
      .doc(thread.parentID)
      .collection('Topics')
      .doc(thread._id)
      .collection('Images')
      .onSnapshot((querySnapshot) => {
        const Images = querySnapshot.docs.map((documentSnapshot) => {
          return {
            _id: documentSnapshot.id,
            // give defaults
            downloadUrl: documentSnapshot.downloadUrl,
            ...documentSnapshot.data(),
          };
        });
        setImages(Images);
      });

    // Stop listening for updates whenever the component unmounts
    return () => {
      imageListener();
    };
  }, []);

  function renderBubble(props) {
    return (
      // Step 3: return the component
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: 'green',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: 'white',
          },
        }}
      />
    );
  }
  function renderSend(props) {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <Image
            source={require('../Icons/send.png')}
            style={styles.iconSize}
            resizeMode={'center'}
          />
          {/* Icon made by Becris https://www.flaticon.com/authors/becris */}
        </View>
      </Send>
    );
  }
  function handleFile() {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxHeight: 1080,
        maxWidth: 1080,
      },
      (response) => {
        const photoName = response.fileName;
        const photoUri = response.uri;
        //Firebase storage helpers
        storage()
          .ref(thread._id)
          .child(photoName)
          .putFile(photoUri)
          .then((snapshot) => {
            //You can check the image is now uploaded in the storage bucket
            Alert.alert('Photo has been successfully uploaded.');
            storage()
              .ref(thread._id)
              .child(photoName)
              .getDownloadURL()
              .then((url) => {
                firestore()
                  .collection('Groups')
                  .doc(thread.parentID)
                  .collection('Topics')
                  .doc(thread._id)
                  .collection('Images')
                  .add({
                    downloadUrl: url,
                    GroupId: thread.parentID,
                    TopicId: thread._id,
                    Uploader: {
                      _id: currentUser.uid,
                      email: currentUser.email,
                      UserName: UserName,
                    },
                  });
              });
          })
          .catch((e) => console.log('uploading image error => ', e));
      },
    );
  }
  function handlePhoto() {
    launchCamera({maxHeight: 1080, maxWidth: 1080}, (response) => {
      const photoName = response.fileName;
      const photoUri = response.uri;
      //Firebase storage helpers
      storage()
        .ref(thread._id)
        .child(photoName)
        .putFile(photoUri)
        .then((snapshot) => {
          //You can check the image is now uploaded in the storage bucket
          Alert.alert('Photo has been successfully uploaded.');
          storage()
            .ref(thread._id)
            .child(photoName)
            .getDownloadURL()
            .then((url) => {
              firestore()
                .collection('Groups')
                .doc(thread.parentID)
                .collection('Topics')
                .doc(thread._id)
                .collection('Images')
                .add({
                  downloadUrl: url,
                  GroupId: thread.parentID,
                  TopicId: thread._id,
                  Uploader: {
                    _id: currentUser.uid,
                    email: currentUser.email,
                    UserName: UserName,
                  },
                });
            });
        })
        .catch((e) => console.log('uploading image error => ', e));
    });
  }
  function renderActions(props: Readonly<ActionsProps>) {
    return (
      <Actions
        {...props}
        options={{
          ['Send notes from files']: handleFile,
          ['Take a photo']: handlePhoto,
        }}
        icon={() => (
          <Image
            source={require('../Icons/Picture.png')}
            style={styles.iconSize}
            resizeMode={'center'}
          />
          //Icon made by Freepik https://www.freepik.com
        )}
        onSend={(args) => console.log(args)}
      />
    );
  }
  function scrollToBottomComponent() {
    return (
      <View style={styles.bottomComponentContainer}>
        <Image
          source={require('../Icons/down.png')}
          style={styles.iconSize}
          resizeMode={'center'}
        />
        {/*Icon made by Smashicons https://smashicons.com */}
      </View>
    );
  }
  function renderLoading() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ce784" />
      </View>
    );
  }
  const navigationView = () => (
    <View style={[styles.navigationContainer]}>
      <FlatList
        data={Images}
        keyExtractor={(item) => item._id}
        ItemSeparatorComponent={() => <Divider />}
        renderItem={({item}) => (
          <View
            style={{
              height: 250,
              width: 250,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={{
                height: 230,
                width: 230,
                alignSelf: 'center',
              }}
              source={{uri: item.downloadUrl}}
            />
            <Text>{item.Uploader.UserName}</Text>
          </View>
        )}
      />
    </View>
  );
  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={windowWidth}
      drawerPosition={'right'}
      renderNavigationView={navigationView}>
      <GiftedChat
        messages={messages}
        onSend={(newMessage) => handleSend(newMessage)}
        user={user}
        renderBubble={renderBubble}
        placeholder="Start a conversation..."
        showUserAvatar
        alwaysShowSend
        renderSend={renderSend}
        scrollToBottomComponent={scrollToBottomComponent}
        renderLoading={renderLoading}
        onLongPressAvatar={(user) => alert(JSON.stringify(user.email))}
        renderActions={renderActions}
      />
    </DrawerLayoutAndroid>
  );
}
const styles = StyleSheet.create({
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  iconSize: {
    width: 30,
    height: 30,
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigationContainer: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  backgroundContainer: {
    backgroundColor: '#2ce784',
  },
});
