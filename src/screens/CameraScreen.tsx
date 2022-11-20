import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView, StyleSheet, Text, Button, Image, View, Alert} from 'react-native'
import {CurrentLocation, Photo} from '../types'

const CameraScreen = () => {
  let cameraObject = useRef<any>();
  let addressCurrentLocation = useRef<CurrentLocation>()
  const [cameraPermission, setCameraPermission] = useState<boolean | undefined>();
  const [mediaLibraryPermission, setMediaLibraryPermission] = useState<boolean | undefined>();
  const [gpsPermission, setGPSPermission] = useState<boolean | undefined>();
  const [photo, setPhoto] = useState<any>();

  useEffect(() => {
    (async () => {
      const cameraPermissionStatus = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermissionStatus = await MediaLibrary.requestPermissionsAsync();
      const geoLocationPermissionStatus = await Location.requestForegroundPermissionsAsync();
      setCameraPermission(cameraPermissionStatus.status === 'granted');
      setMediaLibraryPermission(mediaLibraryPermissionStatus.status === 'granted');
      setGPSPermission(geoLocationPermissionStatus.status === 'granted');
      const location = await Location.getCurrentPositionAsync();
      const address = await Location.reverseGeocodeAsync(location.coords)
      addressCurrentLocation.current = {
        country: address[0].country,
        city: address[0].city,
        region: address[0].region,
        subregion: address[0].subregion,
        district: address[0].district,
        street: address[0].street
      }
      console.log(addressCurrentLocation.current)
    })();
  }, []);

  if (cameraPermission === undefined) {
    return <Text>Requesting permissions...</Text>;
  } else if (!cameraPermission || !mediaLibraryPermission || !gpsPermission) {
    return <Text>Permission not granted.</Text>;
  }

  let takePhoto = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false
    };

    let newPhoto = await cameraObject.current!.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePhoto = () => {
      shareAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let savePhoto = async () => {
      try {
        console.log(addressCurrentLocation.current)
        await MediaLibrary.saveToLibraryAsync(photo.uri);
        const photoLocation: Photo = {
          imageUrl: 'data:image/jpg;base64,' + photo.base64,
          gps: addressCurrentLocation.current
        };
        const photoString = await AsyncStorage.getItem('@photo');
        if (photoString !== null) {
          const photoArray = JSON.parse(photoString);
          const updatePhotoArray = [...photoArray, photoLocation];
          await AsyncStorage.setItem('@photo', JSON.stringify(updatePhotoArray));
        } else {
          let photoArray: Photo[] = [];
          photoArray.push(photoLocation);
          await AsyncStorage.setItem('@photo', JSON.stringify(photoArray));
        }
        setPhoto(undefined);
        return Alert.alert('Successfully Saved')
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image style={styles.preview} source={{ uri: 'data:image/jpg;base64,' + photo.base64 }} />
        <Button title="Share" onPress={sharePhoto} />
        {mediaLibraryPermission ? <Button title="Save" onPress={savePhoto} /> : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  return (
    <Camera ratio="16:9" style={styles.container} ref={cameraObject}>
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
      <StatusBar style="auto" />
    </Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 70
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
});

export default CameraScreen