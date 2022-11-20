import { ImageSourcePropType, Image, View } from 'react-native'

interface Props {
  imagePath: ImageSourcePropType
  focusedColor: string
  defaultColor: string
  status: boolean
}

const TabBarIcon: React.FC<Props> = ({imagePath, focusedColor, defaultColor, status}) => {
  return (
    <View>
        <Image
            source={imagePath}
            resizeMode="contain"
            style={{
              width: 25,
              height: 25,
              tintColor: status ? focusedColor : defaultColor
            }}
            />
    </View>
   
  )
}

export default TabBarIcon