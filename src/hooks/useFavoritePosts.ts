import { useEffect, useState } from 'react'
import { database } from '../../firebase'
import { useUser } from '../contexts/UserContext'
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';

export function useFavoritePost() {
  const [favoritePosts, setPosts] = useState<App.Post[]>([])
  const { userId } = useUser()

  useEffect(() => {
    const postsFavoritesRef = collection(database, 'posts_favorites');
    const userPostsFavoritesQuery = query(postsFavoritesRef, where('userId', '==', userId));
  
    // Callback para o posts favorites
    const postsFavoritesCallback = (snapshot) => {
      const postsFavoritesIds = snapshot.docs.map((doc) => doc.data().postId);
  
      // Se houver post favoritado pro usuário atual
      if (postsFavoritesIds.length) {
        postsFavoritesIds.forEach((id) => {
          const postRef = doc(database, 'posts', id);
          
          onSnapshot(postRef, (postSnapshot) => {
            if (postSnapshot.exists()) {
              postCallback(postSnapshot);
            }
          });
        });
      }
    };
  
    // Callback para o post
    const postCallback = (post) => {
      setPosts((oldPosts) => {
        const updatedPosts = [...oldPosts];
  
        if (!updatedPosts.some((p) => p.id === post.id)) {
          updatedPosts.push({
            id: post.id,
            ...post.data(),
          });
        }
  
        return updatedPosts;
      });
    };
  
    const unsubscribe = onSnapshot(userPostsFavoritesQuery, (querySnapshot) => {
      setPosts([]);
      postsFavoritesCallback(querySnapshot);
    });
  
    return () => {
      // Limpe a assinatura quando o componente for desmontado
      unsubscribe();
    };
  }, [userId, database, setPosts]);

  return favoritePosts
}
