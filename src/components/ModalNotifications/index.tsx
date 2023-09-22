import React, { useEffect, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { database } from '../../../firebase'
import { useModal } from '../../contexts/ModalContext'
import { useUser } from '../../contexts/UserContext'
import { NotificationItem } from '../NotificationItem'
import { collection, onSnapshot } from 'firebase/firestore';

export const ModalNotifications: React.FC = () => {
  const { userId } = useUser()
  const { modalizeRef } = useModal()
  const [notification, setNotifications] = useState<App.Notification[]>()

  // useEffect(() => {
  //   const notificationsRef = collection(database, `users/${userId}/notifications`);

  //   onSnapshot(notificationsRef, (querySnapshot) => {
  //     const data = querySnapshot.docs.map((doc) => {
  //       return { id: doc.id, ...doc.data() };
  //     }) as any;
  //     setNotifications(data);
  //   });
  // }, [])

  return (
    <Modalize FloatingComponent ref={modalizeRef} snapPoint={500}>
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      <NotificationItem title="title" message="message" data="data" id="20" />
      {/* {notification?.map((notification, index) => {
        return (
          <NotificationItem
            key={index}
            title={notification.title}
            message={notification.message}
            data={notification.dataExibicao}
            id={notification.id!}
          />
        )
      })} */}
    </Modalize>
  )
}
