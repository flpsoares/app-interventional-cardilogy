import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer } from '@react-navigation/native'
import { AuthRoutes } from './src/routes/AuthRoutes';
import { auth } from './firebase'
import { LanguageProvider } from './src/contexts/LanguageContext';
import { NavigateProvider } from './src/contexts/NavigateContext';
import { ModalProvider } from './src/contexts/ModalContext';
import { UserProvider } from './src/contexts/UserContext';
import { onAuthStateChanged } from 'firebase/auth'
import { primary } from './src/styles/globalCssVar';
import { NotificationProvider } from './src/contexts/NotificationContext';
import { Routes } from './src/routes';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  const [user, setUser] = useState<boolean>()
  const [isLoading, setIsLoading] = useState(true)

  const verifyLanguage = async () => {
    const local_language = AsyncStorage.getItem('language')
    if ((await local_language) === null) {
      AsyncStorage.setItem('language', 'pt')
    }
  }

  useEffect(() => {
    const subscriber = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(true)
        setIsLoading(false)
        verifyLanguage()
      } else {
        setUser(false)
        setIsLoading(false)
        verifyLanguage()
      }
    })

    return subscriber
  }, [])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <NavigateProvider>
        <LanguageProvider>
          <ModalProvider>
            <UserProvider>
              <NotificationProvider>
                <StatusBar barStyle={'dark-content'} backgroundColor="#fff" />
                <GestureHandlerRootView style={{ flex: 1 }}>
                  {user ? <Routes /> : <AuthRoutes />}
                </GestureHandlerRootView>
              </NotificationProvider>
            </UserProvider>
          </ModalProvider>
        </LanguageProvider>
      </NavigateProvider>
    </NavigationContainer>
  );
}