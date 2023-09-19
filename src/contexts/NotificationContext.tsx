import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Notifications from 'expo-notifications'
import { collection, query, where, getDocs, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import moment from 'moment'
import 'moment-timezone'
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { database } from '../../firebase'

interface NotificationContextData {
  expoPushToken: string | null
  setExpoPushToken: React.Dispatch<React.SetStateAction<string | null>>
  sendLocalNotification: (title: string, body: string) => void
  sendRemoteNotification: (title: string, body: string, token: string) => void
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationContext = createContext({} as NotificationContextData)

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>('')

  const getToken = async () => {
    const token = await AsyncStorage.getItem('@ExpoPushToken')
    setExpoPushToken(token)
  }

  useEffect(() => {
    getToken()
  }, [])

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false
    })
  })

  const sendLocalNotification = async (title: string, body: string) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' }
      },
      trigger: { seconds: 2 }
    })
  }

  const sendRemoteNotification = async (
    title: string,
    body: string,
    token: string
  ) => {
    const message = {
      to: token,
      sound: 'default',
      title,
      body
    }

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    })

    const userQuery = query(collection(database, 'users'), where('notificationToken', '==', token));

    getDocs(userQuery)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            console.log(doc.data().email);
            const notificationsRef = collection(database, `users/${doc.id}/notifications`);
            addDoc(notificationsRef, {
              title,
              message: body,
              dataCriacao: serverTimestamp(),
              dataExibicao: moment().tz('America/Sao_Paulo').format('DD/MM/YYYY H:mm:ss'),
            })
              .catch((error) => {
                console.error('Erro ao adicionar notificação:', error);
              });
          });
        }
      })
      .catch((error) => {
        console.error('Erro ao consultar usuários por token:', error);
      });
  }

  return (
    <NotificationContext.Provider
      value={{
        expoPushToken,
        setExpoPushToken,
        sendLocalNotification,
        sendRemoteNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  return useContext(NotificationContext)
}
