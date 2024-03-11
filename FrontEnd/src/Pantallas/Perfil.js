import React from 'react';
import { View, Text, StyleSheet, Image, Linking ,TouchableWithoutFeedback} from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";


const ProfileScreen = () => {

  const twitter = <Icon name={'twitter'} size={30} color={'black'}/>
const facebook = <Icon name={'facebook'} size={30} color={'black'}/>
const instagram = <Icon name={'instagram'} size={30} color={'black'}/>
const linkedin = <Icon name={'linkedin'} size={30} color={'black'}/>
const kwai = <Icon name={'video-camera'} size={30} color={'black'}/>
const discord = <Icon name={'simplybuilt'} size={30} color={'black'}/>

 
  const handleOpenURL = async (url) => {

    const supported = await Linking.canOpenURL(url);
    if (supported) {

      await Linking.openURL(url);
    } else {
      console.log(`No se puede abrir el enlace: ${url}`);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../images/berserk.jpg')}
        style={styles.coverImage}
      />

      <View style={styles.profileImageContainer}>
        <Image
          source={require('../../images/daniel2.jpeg')}
          style={styles.profileImage}
        />
      </View>

      <Text style={styles.userName}>Daniel Obstancias</Text>


<View style={styles.buttonContainer}>

<TouchableWithoutFeedback style={{color: 'blue'}} onPress={() => {
    Linking.openURL('https://facebook.com/')
}}>
    {facebook}
</TouchableWithoutFeedback>
<TouchableWithoutFeedback style={{color: 'blue'}} onPress={() => {
    Linking.openURL('https://twitter.com/')
}}>
    {twitter}
</TouchableWithoutFeedback>
<TouchableWithoutFeedback style={{color: 'blue'}} onPress={() => {
    Linking.openURL('https://instagram.com/')
}}>
    {instagram}
</TouchableWithoutFeedback>
<TouchableWithoutFeedback onPress={()=>Linking.openURL('https://linkedin.com/')}>
    {linkedin}
</TouchableWithoutFeedback>

<TouchableWithoutFeedback onPress={()=>Linking.openURL('https://discord.com/')}>
    {discord}
</TouchableWithoutFeedback>

</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  profileImageContainer: {
    position: 'absolute',
    top: 150,
    left: '50%',
    marginLeft: -50, 
    borderRadius: 50, 
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white',
    elevation: 5, 
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    marginTop: 120,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
}
});

export default ProfileScreen;
