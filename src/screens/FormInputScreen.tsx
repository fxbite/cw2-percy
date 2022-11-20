import {FormControl, Input, Stack, Text, Box, Center, Button, KeyboardAvoidingView, NativeBaseProvider} from 'native-base'
import {Platform, Alert} from 'react-native'
import validUrl from 'valid-url'
import {useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const FormInputScreen = () => {

  const [link, setLink] = useState('')
  const uploadURLLink = async() => {
    if(!link) {
      return alert('Required Field')
    }

    if(!validUrl.isUri(link)) {
      return alert('Invalid URL')
    }
  }

  const resetAllPhoto = async() => {
    await AsyncStorage.removeItem('@photo');
    return Alert.alert('Reset Successfully');
  }

  return (
    <NativeBaseProvider>
        <KeyboardAvoidingView
        h={{
          base: '400px',
          lg: 'auto'
        }}
        behavior={Platform.OS === 'ios' ? 'padding': 'height'}
      >
        <Center w="100%" flex={1}>
          <Stack
            space={2.5}
            alignSelf="center"
            px="4"
            w={{
              base: '100%',
              md: '25%'
            }}
          >
            <Box>
              <Text bold fontSize="xl" mb="4">Upload Link Image Form</Text>
              <FormControl mb="5">
                <FormControl.Label>URL Image</FormControl.Label>
                <Input onChangeText={(text) => setLink(text)} value={link}/>
                <Button mt="3" onPress={uploadURLLink} colorScheme="green" >Submit</Button>
                <Button mt="3" onPress={resetAllPhoto} colorScheme="red" >Reset Data</Button>
              </FormControl>
            </Box>
          </Stack>
        </Center>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  )
}

export default FormInputScreen