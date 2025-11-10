
'use client';

import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from '@/screens/HomeScreen';
import BookDetailScreen from '@/screens/BookDetailScreen';
import LandingScreen from '@/screens/LandingScreen';
import ReaderScreen from '@/screens/ReaderScreen';
import SearchScreen from '@/screens/SearchScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import CommunityScreen from '@/screens/CommunityScreen';
import FollowingScreen from '@/screens/FollowingScreen';
import NewPublicationScreen from '@/screens/NewPublicationScreen';
import BookFormScreen from '@/screens/BookFormScreen';
import CommentsScreen from '@/screens/CommentsScreen';
import BottomNav from '@/components/BottomNav';
import SideNav from '@/components/SideNav';
import LibraryScreen from '@/screens/LibraryScreen';
import { User, Book } from '@/lib/prisma/definitions';
import { getBookById } from '@/lib/actions';
import { useUser } from '@/hooks/use-user';
import { Spinner } from '@/components/Spinner';

type Screen = 'home' | 'search' | 'library' | 'profile' | 'community' | 'settings';

interface NavigationState {
  page: string;
  params?: any;
}

export default function Home() {
  const { user: currentUser, isLoading: isUserLoading, login, logout } = useUser();
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([{ page: 'home' }]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [isBookLoading, setIsBookLoading] = useState(false);

  const navigate = useCallback((page: string, params?: any) => {
    setNavigationStack(prev => [...prev, { page, params }]);
  }, []);

  const goBack = useCallback(() => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1));
    }
  }, [navigationStack.length]);

  const changeTab = useCallback((tab: Screen) => {
    setNavigationStack([{ page: tab }]);
  }, []);

  const handleLogin = (user: User) => {
    login(user);
  };

  const handleLogout = () => {
    logout();
    setNavigationStack([{ page: 'home' }]);
  };

  const currentNavigationState = navigationStack[navigationStack.length - 1];
  const currentPage = currentNavigationState.page;

  useEffect(() => {
    const fetchBook = async () => {
      if ((currentPage === 'bookDetail' || currentPage === 'reader' || currentPage === 'editBook') && currentNavigationState.params?.bookId) {
        setIsBookLoading(true);
        const book = await getBookById(currentNavigationState.params.bookId);
        if (book) {
          setCurrentBook(book);
        }
        setIsBookLoading(false);
      } else if (currentPage === 'editBook' && currentNavigationState.params?.book) {
        setCurrentBook(currentNavigationState.params.book);
      } else {
        setCurrentBook(null);
      }
    };

    fetchBook();
  }, [currentPage, currentNavigationState.params]);

  if (isUserLoading) {
    return (
        <div className="h-dvh w-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
            <Spinner />
        </div>
    );
  }

  if (!currentUser) {
    return <LandingScreen onLoginSuccess={handleLogin} />;
  }

  const renderScreen = () => {
    if (isBookLoading) {
        return <div className="h-full w-full flex items-center justify-center"><Spinner /></div>;
    }

    switch (currentPage) {
      case 'home':
        return <HomeScreen navigate={navigate} currentUser={currentUser} />;
      case 'search':
        return <SearchScreen navigate={navigate} />;
      case 'library':
        return <LibraryScreen navigate={navigate} />;
      case 'profile':
        return <ProfileScreen navigate={navigate} user={currentNavigationState.params?.user || currentUser} />;
      case 'community':
        return <CommunityScreen navigate={navigate} currentUser={currentUser} />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      case 'bookDetail':
        return currentBook ? <BookDetailScreen book={currentBook} goBack={goBack} navigate={navigate} /> : <div>Book not found</div>;
      case 'reader':
        return currentBook ? <ReaderScreen book={currentBook} chapterId={currentNavigationState.params.chapterId} paragraph={currentNavigationState.params.paragraph} goBack={goBack} /> : <div>Book not found</div>;
      case 'following':
        return <FollowingScreen goBack={goBack} navigate={navigate} />;
      case 'newPublication':
        return <NewPublicationScreen goBack={goBack} currentUser={currentUser} />;
      case 'newBook':
        return <BookFormScreen goBack={goBack} navigate={navigate} />;
      case 'editBook':
        return <BookFormScreen goBack={goBack} navigate={navigate} existingBook={currentBook} />;
      case 'comments':
        return <CommentsScreen goBack={goBack} navigate={navigate} post={currentNavigationState.params.post} currentUser={currentUser} />;
      default:
        return <HomeScreen navigate={navigate} currentUser={currentUser} />;
    }
  };
  
  const getActiveTab = (): Screen => {
    const rootPage = navigationStack[0].page;
    if (['home', 'search', 'library', 'profile', 'community', 'settings'].includes(rootPage)) {
        return rootPage as Screen;
    }
    return 'home';
  }

  const bottomNavScreens = ['home', 'search', 'profile', 'community', 'library'];
  const showBottomNav = bottomNavScreens.includes(currentPage);
  
  return (
    <div className="h-dvh w-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="mx-auto flex h-dvh max-w-screen-2xl">
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
          <SideNav navigate={navigate} changeTab={changeTab} activeTab={getActiveTab()} currentUser={currentUser} />
        </aside>
        
        <div className="flex flex-1 min-w-0">
          <div className="flex flex-col h-dvh flex-1">
            <main className={`flex-grow overflow-y-auto ${showBottomNav ? 'pb-20' : ''} lg:pb-0`}>
              {renderScreen()}
            </main>
            <div className="lg:hidden">
              {showBottomNav && <BottomNav activeTab={getActiveTab()} setActiveTab={changeTab} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
