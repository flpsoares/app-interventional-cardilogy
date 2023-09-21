import { useEffect, useState } from 'react'
import { database } from '../../firebase'
import { collection, onSnapshot, query, limit, where } from 'firebase/firestore';

type DataProps = Partial<{ id: string; favoriteCounts: number; post: App.Post }>

export function usePopularPost() {
  const [popularPosts, setPopularPosts] = useState<DataProps[]>([])

  useEffect(() => {
    const postsRef = collection(database, 'posts');
    const popularPostsRef = collection(database, 'posts_favorites');
    const popularPosts = [];
  
    const unsubscribe = onSnapshot(
      query(postsRef, limit(100)),
      (querySnapshot) => {
        popularPosts.length = 0; // Limpa o array de posts populares
  
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const postIds = posts.map((post) => post.id);
  
        if (postIds.length) {
          setPopularPosts([]);
          postIds.forEach((id) => {
            const postFavoritesQuery = query(
              popularPostsRef,
              where('postId', '==', id)
            );
  
            onSnapshot(postFavoritesQuery, (postFavoritesSnapshot) =>
              postCallback(id, postFavoritesSnapshot, posts)
            );
          });
        }
      }
    );
  
    const postCallback = (id, postFavoritesSnapshot, posts) => {
      if (postFavoritesSnapshot.empty) return;
  
      for (const postFavorite of postFavoritesSnapshot.docs) {
        setPopularPosts((oldPopularPosts) => {
          const updatedPopularPosts = [...oldPopularPosts];
          const favoritesCount = posts.find((p) => p.id === postFavorite.data().postId);
  
          if (!updatedPopularPosts.some((p) => p.id === id)) {
            updatedPopularPosts.push({
              id,
              favoriteCounts: favoritesCount.favorites,
              post: posts.find((p) => p.id === postFavorite.data().postId),
            });
          }
  
          return updatedPopularPosts;
        });
      }
    };
  
    return () => {
      // Limpe a assinatura quando o componente for desmontado
      unsubscribe();
    };
  }, [database, setPopularPosts]);

  return popularPosts.slice(0, 9).sort((a, b) => {
    return b.favoriteCounts! - a.favoriteCounts!
  })
}
