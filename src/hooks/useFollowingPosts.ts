import { useEffect, useState } from 'react'
import { database } from '../../firebase'
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { useUser } from '../contexts/UserContext'

export function useFollowingPosts() {
  const [followingPosts, setFollowingPosts] = useState<App.Post[]>([])
  const { userId } = useUser()

  useEffect(() => {
    const followingRef = collection(database, `users/${userId}/following`);
    const followingPosts = [];
  
    const unsubscribe = onSnapshot(followingRef, async (querySnapshot) => {
      followingPosts.length = 0; // Limpa o array de posts seguidos
  
      const followingUserIds = querySnapshot.docs.map((doc) => doc.data().userId);
  
      for (const userId of followingUserIds) {
        const postsQuery = query(collection(database, 'posts'), where('autorId', '==', userId));
        const postsSnapshot = await getDocs(postsQuery);
  
        postsSnapshot.forEach((postDoc) => {
          followingPosts.push({
            id: postDoc.id,
            ...postDoc.data(),
          });
        });
      }
  
      setFollowingPosts(followingPosts);
    });
  
    return () => {
      // Limpe a assinatura quando o componente for desmontado
      unsubscribe();
    };
  }, [userId, database, setFollowingPosts]);

  return followingPosts
}
