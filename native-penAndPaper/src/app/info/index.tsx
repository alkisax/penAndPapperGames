import Navbar from '@/layout/Navbar'
import { Text, View } from 'react-native'

const Info = () => {
  return (

    <>
      <Navbar
        minimal
        roomId=''
        setRoomId={() => { }}
        handleConnectSocket={async () => { }}
        isConnected={false}
        hasPeer={false}
      />
      <View>
        <Text>Info</Text>
      </View>
    </>

  )
}

export default Info