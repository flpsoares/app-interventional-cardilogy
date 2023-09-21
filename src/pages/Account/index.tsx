import { Ionicons } from '@expo/vector-icons'
import I18n from 'i18n-js'
import moment from 'moment'
import 'moment-timezone'
import React, { useEffect, useState } from 'react'
import { database } from '../../../firebase'
import { LanguageDropdown } from '../../components/LanguageDropdown'
import { ModalNotifications } from '../../components/ModalNotifications'
import { Post } from '../../components/Post'
import { SettingsDropdown } from '../../components/SettingsDropdown'
import { useModal } from '../../contexts/ModalContext'
import { useUser } from '../../contexts/UserContext'
import { useFollowingPosts } from '../../hooks/useFollowingPosts'
import { onSnapshot, collection, query, doc, where, orderBy } from 'firebase/firestore';
import {
  Banner,
  Container,
  Email,
  Header,
  Info,
  Name,
  Notification,
  PostArea,
  Profile,
  UserPhoto,
  UserPhotoBack
} from './style'

export const Account: React.FC = () => {
  const { user, userId } = useUser()
  const { openNotificationModal } = useModal()

  const followingPosts = useFollowingPosts()

  const [posts, setPosts] = useState<App.Post[]>()
  const [countFollowers, setCountFollowers] = useState(0)
  const [countFollowings, setCountFollowings] = useState(0)
  const [remainingDays, setRemainingDays] = useState(0)

  const [dropdownIsOpen, setDropdownIsOpen] = useState(false)

  I18n.translations = {
    pt: {
      follower: 'Seguidor',
      followers: 'Seguidores',
      following: 'Seguindo',
      day: 'dia de assinatura restante',
      days: 'dias de assinatura restantes'
    },
    en: {
      follower: 'Follower',
      followers: 'Followers',
      following: 'Following',
      day: 'subscription day remaining',
      days: 'days of subscription remaining'
    },
    es: {
      follower: 'Seguidor',
      followers: 'Seguidores',
      following: 'Siguiendo',
      day: 'día de suscripción restante',
      days: 'días de suscripción restante'
    }
  }

  let unsubscribePosts;
  let unsubscribeFollowers;
  let unsubscribeFollowings;
  let unsubscribePlansDays;

  useEffect(() => {
    // posts
    if (user?.isDoctor) {
      const postsQuery = query(
        collection(database, 'posts'),
        where('autorId', '==', userId),
        orderBy('dataCriacao', 'desc')
      );

      unsubscribePosts = onSnapshot(postsQuery, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as App.Post[];
        setPosts(data);
      });
    }

    // followers
    const followersQuery = collection(database, `/users/${userId}/followers`);
    unsubscribeFollowers = onSnapshot(followersQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        setCountFollowers(0);
      } else {
        setCountFollowers(querySnapshot.size);
      }
    });

    // followings
    const followingsQuery = collection(database, `/users/${userId}/following`);
    unsubscribeFollowings = onSnapshot(followingsQuery, (querySnapshot) => {
      if (querySnapshot.empty) {
        setCountFollowings(0);
      } else {
        setCountFollowings(querySnapshot.size);
      }
    });

    // plans days
    const userDoc = doc(database, `/users/${userId}`);
    unsubscribePlansDays = onSnapshot(userDoc, (docSnapshot) => {
      const dateNow = moment().tz('America/Sao_Paulo');
      const remainingDays = docSnapshot.data()?.expiration_date;
      setRemainingDays(moment(remainingDays).diff(dateNow, 'days'));
    });

    return () => {
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeFollowers) unsubscribeFollowers();
      if (unsubscribeFollowings) unsubscribeFollowings();
      if (unsubscribePlansDays) unsubscribePlansDays();
    };
  }, []);

  return (
    <Container>
      <ModalNotifications />
      <LanguageDropdown isOpen={false} />
      <Profile onPress={() => setDropdownIsOpen(false)}>
        <Banner>
          <Header>
            <Notification onPress={() => setDropdownIsOpen(!dropdownIsOpen)}>
              <Ionicons name="settings-outline" size={22} color="#fff" />
            </Notification>
            <Notification onPress={openNotificationModal}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </Notification>
          </Header>
        </Banner>
        {dropdownIsOpen && <SettingsDropdown />}
        <UserPhotoBack>
          {user?.userPhoto ? (
            <UserPhoto source={{ uri: user.userPhoto }} />
          ) : (
            <UserPhoto source={require('../../../assets/default-user.png')} />
          )}
        </UserPhotoBack>
        <Info>
          <Name>{user?.name}</Name>
          <Email>{user?.email}</Email>
          {countFollowers === 1 ? (
            <Email>
              {countFollowers} {I18n.t('follower')}
            </Email>
          ) : (
            <Email>
              {countFollowers} {I18n.t('followers')}
            </Email>
          )}
          <Email>
            {countFollowings} {I18n.t('following')}
          </Email>
          {remainingDays === 1 ? (
            <Email>
              {remainingDays} {I18n.t('day')}
            </Email>
          ) : (
            <Email>
              {remainingDays} {I18n.t('days')}
            </Email>
          )}
        </Info>
      </Profile>
      <PostArea>
        {user?.isDoctor ? (
          <>
            {posts?.map((post) => {
              return <Post key={post.id} data={post} />
            })}
          </>
        ) : (
          <>
            {followingPosts?.map((post) => {
              return <Post key={post.id} data={post} />
            })}
          </>
        )}
      </PostArea>
    </Container>
  )
}
