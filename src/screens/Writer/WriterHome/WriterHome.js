import { View } from 'react-native'
import WriterContent from './WriterContent.js'
import WriterNavbar from './WriterNavbar.js'

export default function WriterHome() {
  return (
    <View>
      <WriterNavbar/>
      <WriterContent/>
    </View>
  )
}