import { AntDesign } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { database } from '../../../firebase'
import { useUser } from '../../contexts/UserContext'
import { Container, Left, Text } from './style'
import { doc, deleteDoc } from 'firebase/firestore';

interface NotificationItemProps {
  title: string
  message: string
  data: string
  id: string
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  title,
  message,
  data,
  id
}) => {
  const { userId } = useUser()

  const deleteNotification = () => {
    const notificationsRef = doc(database, `users/${userId}/notifications`, id);

    deleteDoc(notificationsRef)
      .then(() => {
        console.log('Notificação excluída com sucesso');
      })
      .catch((error) => {
        console.error('Erro ao excluir notificação:', error);
      });
  }

  return (
    <Container>
      <Left>
        <Text numberOfLines={1}>{title}</Text>
        <Text numberOfLines={1}>{message}</Text>
        <Text numberOfLines={1}>{data}</Text>
      </Left>
      <TouchableOpacity onPress={deleteNotification}>
        <AntDesign name="delete" color="#8b0003" size={28} />
      </TouchableOpacity>
    </Container>
  )
}
