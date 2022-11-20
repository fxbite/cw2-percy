import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { RootStackParamList} from '../types'
import { Color} from '../constant'
import TabBarIcon from '../components/TabBarIcon'

import FormInputScreen from '../screens/FormInputScreen'
import CameraScreen from '../screens/CameraScreen'
import ListScreen from '../screens/ListScreen'


const Tab = createBottomTabNavigator<RootStackParamList>()

const BottomTabs = () => {
  return (
    <Tab.Navigator
        screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                position: 'absolute',
                bottom: 10, 
                left: 10,
                right: 10,
                height: 60,
                backgroundColor: Color.navBackground,
                borderRadius: 10
            },
            headerShown: false
        }}>

        <Tab.Screen
            name="FromInput"
            component={FormInputScreen}
            options={{
                unmountOnBlur: true,
                tabBarIcon: ({focused}) => (
                    <TabBarIcon 
                        imagePath={require('../../assets/square-plus-solid.png')} 
                        focusedColor={Color.focusedLabel}
                        defaultColor={Color.defaultLabel}
                        status={focused}
                    />
                )
        }}/>

        <Tab.Screen
            name="Camera"
            component={CameraScreen}
            options={{
                unmountOnBlur: true,
                tabBarIcon: ({focused}) => (
                    <TabBarIcon 
                        imagePath={require('../../assets/camera-solid.png')} 
                        focusedColor={Color.focusedLabel}
                        defaultColor={Color.defaultLabel}
                        status={focused}
                    />
                )
        }}/>

        <Tab.Screen
            name="List"
            component={ListScreen}
            options={{
                unmountOnBlur: true,
                tabBarIcon: ({focused}) => (
                    <TabBarIcon 
                        imagePath={require('../../assets/list-ul-solid.png')} 
                        focusedColor={Color.focusedLabel}
                        defaultColor={Color.defaultLabel}
                        status={focused}
                    />
                )
        }}/>

    </Tab.Navigator>
  )
}

export default BottomTabs
