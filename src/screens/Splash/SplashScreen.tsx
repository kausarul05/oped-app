import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Image, View } from 'react-native';

export default function SplashScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    // Navigate to Login after 5 seconds
    const timer = setTimeout(() => {
      navigation.navigate('login' as never);
    }, 5000);

    // Clean up timer
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={{
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center", 
      flex: 1, 
      backgroundColor: "#fff"
    }}>
      <Image 
        source={require('../../../assets/images/logo.png')} 
        // style={{ width: 200, height: "auto" }} 
      />
      <Image 
        source={require('../../../assets/images/logo-icon.png')} 
        style={{ position: "absolute", bottom: 50, right: 50 }} 
      />
    </View>
  );
}