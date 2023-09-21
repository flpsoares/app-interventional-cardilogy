import { Feather, FontAwesome } from '@expo/vector-icons'
import I18n from 'i18n-js'
import React, { useState } from 'react'
import { Alert } from 'react-native'
import { database } from '../../../firebase'
import { useNavigate } from '../../contexts/NavigateContext'
import { useNotification } from '../../contexts/NotificationContext'
import { useUser } from '../../contexts/UserContext'
import { Container, Icon, Item, Text } from './style'
import { getDocs, doc, collection, where, query, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';

interface PostDropdownProps {
  name: string
  postId: string
  isFavorited: boolean
  isFollower: boolean
  autorId: string
  favorites: number
}

export const PostDropdown: React.FC<PostDropdownProps> = ({
  name,
  postId,
  isFavorited,
  isFollower,
  autorId,
  favorites
}) => {
  const { userId, user } = useUser()

  const { navigateToHome } = useNavigate()

  const { sendRemoteNotification } = useNotification()

  const [favorited, setFavorited] = useState(isFavorited)
  const [follower, setFollower] = useState(isFollower)

  const firstName = name.split(' ')[0]

  const handleFavorite = async () => {
    const favoriteQuery = collection(database, '/posts_favorites');
    const favoriteSnapshot = await getDocs(
      query(favoriteQuery, where('userId', '==', userId), where('postId', '==', postId))
    );

    if (favoriteSnapshot.empty) {
      try {
        const newFavorite = await addDoc(favoriteQuery, { postId, userId });
        const postDoc = doc(database, '/posts', postId);
        await updateDoc(postDoc, { favorites: favorites + 1 });
        setFavorited(true);
      } catch (error) {
        Alert.alert(I18n.t('error'), I18n.t('errorOccurred'));
      }
    } else {
      try {
        const favoriteDoc = favoriteSnapshot.docs[0];
        await deleteDoc(favoriteDoc.ref);
        const postDoc = doc(database, '/posts', postId);
        await updateDoc(postDoc, { favorites: favorites - 1 });
        setFavorited(false);
      } catch (error) {
        Alert.alert(I18n.t('error'), I18n.t('errorOccurred'));
      }
    }
  }

  // Função para lidar com seguir
  const handleFollow = async () => {
    const followerQuery = collection(database, `/users/${autorId}/followers`);
    const followerSnapshot = await getDocs(
      query(followerQuery, where('userId', '==', userId))
    );

    if (followerSnapshot.empty) {
      try {
        const newFollower = await addDoc(followerQuery, {
          userName: user?.name,
          userId: userId
        });
        const followingQuery = collection(database, `/users/${userId}/following`);
        await addDoc(followingQuery, {
          userName: name,
          userId: autorId
        });

        const autorDoc = doc(database, '/users', autorId);
        const autorData = await getDoc(autorDoc);

        const token = autorData.data().notificationToken;
        sendRemoteNotification(
          I18n.t('newFollower'),
          `${user?.name} ${I18n.t('justFollowed')}`,
          token
        );
        setFollower(true);
      } catch (error) {
        Alert.alert(I18n.t('error'), I18n.t('errorOccurred'));
      }
    } else {
      try {
        const followerDoc = followerSnapshot.docs[0];
        await deleteDoc(followerDoc.ref);

        const followingQuery = collection(database, `/users/${userId}/following`);
        const followingSnapshot = await getDocs(
          query(followingQuery, where('userId', '==', autorId))
        );

        if (!followingSnapshot.empty) {
          const followingDoc = followingSnapshot.docs[0];
          await deleteDoc(followingDoc.ref);
        }

        setFollower(false);
      } catch (error) {
        Alert.alert(I18n.t('error'), I18n.t('errorOccurred'));
      }
    }
  }

  // Função para excluir post
  const deletePost = async () => {
    navigateToHome();

    try {
      const postDoc = doc(database, '/posts', postId);
      await deleteDoc(postDoc);

      const favoriteQuery = collection(database, '/posts_favorites');
      const favoriteSnapshot = await getDocs(
        query(favoriteQuery, where('postId', '==', postId))
      );

      favoriteSnapshot.docs.forEach(async (favoriteDoc) => {
        await deleteDoc(favoriteDoc.ref);
      });
    } catch (error) {
      Alert.alert(I18n.t('error'), I18n.t('errorOccurred'));
    }
  }

  I18n.translations = {
    pt: {
      favorite: 'Favoritar',
      disfavor: 'Desfavoritar',
      delete: 'Excluir',
      follow: 'Seguir',
      unfollow: 'Deixar de seguir',
      error: 'Erro',
      errorOccurred: 'Ocurreu um erro',
      newFollower: 'Você tem um novo seguidor',
      justFollowed: 'acabou de te seguir'
    },
    en: {
      favorite: 'Favorite',
      disfavor: 'Disfavor',
      delete: 'Delete',
      follow: 'Follow',
      unfollow: 'Unfollow',
      error: 'Error',
      errorOccurred: 'An error has occurred',
      newFollower: 'You have a new follower',
      justFollowed: 'just followed you'
    },
    es: {
      favorite: 'Favorito',
      disfavor: 'Desfavorecer',
      delete: 'Borrar',
      follow: 'Seguir',
      unfollow: 'Dejar de seguir',
      error: 'Error',
      errorOccurred: 'Ocurrio un error',
      newFollower: 'Tienes un nuevo seguidor',
      justFollowed: 'solo te seguí'
    }
  }

  return (
    <Container>
      {autorId === userId ? (
        <>
          <Item
            onPress={() => {
              handleFavorite()
            }}
          >
            <Icon>
              <FontAwesome name="bookmark" size={20} color="#fff" />
            </Icon>
            <Text>{favorited ? I18n.t('disfavor') : I18n.t('favorite')}</Text>
          </Item>
          <Item onPress={deletePost} style={{ marginTop: 22 }}>
            <Icon>
              <Feather name="delete" size={22} color="#fff" />
            </Icon>
            <Text>{I18n.t('delete')}</Text>
          </Item>
        </>
      ) : (
        <>
          <Item
            onPress={() => {
              handleFavorite()
            }}
          >
            <Icon>
              <FontAwesome name="bookmark" size={20} color="#fff" />
            </Icon>
            <Text>{favorited ? I18n.t('disfavor') : I18n.t('favorite')}</Text>
          </Item>
          <Item onPress={handleFollow} style={{ marginTop: 20 }}>
            <Icon>
              <FontAwesome name="plus" size={20} color="#fff" />
            </Icon>
            <Text>
              {follower ? I18n.t('unfollow') : I18n.t('follow')} {firstName}
            </Text>
          </Item>
        </>
      )}
    </Container>
  )
}
