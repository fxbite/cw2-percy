
import { Dimensions, StyleSheet, Animated, TouchableOpacity, Alert } from 'react-native';
import { View, NativeBaseProvider, StatusBar, Image } from 'native-base';
import { CurrentLocation, Photo, RootStackParamList } from '../types';
import { useRef, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused} from '@react-navigation/native';

const ListScreen = () => {

  const isFocused = useIsFocused();
  const { width, height } = Dimensions.get('screen');

  const imageW = width * 0.7;
  const imageH = imageW * 1.54;
  const data: Photo[] = [
    {
      imageUrl: 'https://i.pinimg.com/474x/0a/50/19/0a5019e44bf3b51c9e1b8621824e2248.jpg'
    },
    {
      imageUrl: 'https://i.pinimg.com/474x/a9/5d/1c/a95d1cfea3a621915ef81b8b2556754e.jpg'
    },
    {
      imageUrl: 'https://i.pinimg.com/474x/83/a9/6d/83a96d77d3f1914394972ffa858377a0.jpg'
    }
  ];
  const [photo, setPhoto] = useState(data);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      const photoString = await AsyncStorage.getItem('@photo');
      if (photoString !== null) {
        const photoArray: Photo[] = JSON.parse(photoString);
        setPhoto(data.concat(photoArray));
      } else {
        setPhoto(data);
      }
    })();
  }, [isFocused]);

  const showLocationPhotoDialog = (gps: CurrentLocation | undefined) => () => {
    if (gps) {
      let showAddress = `Country: ${gps.country}`
      showAddress += `\nCity: ${gps.city}`
      showAddress += `\nRegion: ${gps.region}`
      showAddress += `\nSubregion: ${gps.subregion}`
      showAddress += `\nDistrict: ${gps.district}`
      showAddress += `\nStreet: ${gps.street}`

      Alert.alert('Photo Address', showAddress)
    } else {
      alert('No GPS Found');
    }
  };

  return (
    <NativeBaseProvider>
      <View flex={1} backgroundColor="#000">
        <StatusBar hidden />
        <View style={StyleSheet.absoluteFillObject}>
          {photo?.map((image, index) => {
            const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0, 1, 0]
            });
            return (
              <Animated.Image
                key={`image-${index}`}
                source={{ uri: image.imageUrl }}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    opacity
                  }
                ]}
                blurRadius={50}
              />
            );
          })}
        </View>
        <Animated.FlatList
          data={photo}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          renderItem={({ item }) => {
            return (
              <View
                width={width}
                justifyContent="center"
                alignItems="center"
                style={{
                  shadowColor: '#000',
                  shadowOpacity: 1,
                  shadowOffset: {
                    width: 0,
                    height: 0
                  },
                  shadowRadius: 20
                }}
              >
                <TouchableOpacity activeOpacity={0.5} onPress={showLocationPhotoDialog(item.gps)}>
                  <Image source={{ uri: item.imageUrl }} width={imageW} height={imageH} resizeMode="cover" alt="Item Slider" borderRadius="xl" />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </NativeBaseProvider>
  )
}

export default ListScreen