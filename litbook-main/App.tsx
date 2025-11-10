import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import BookDetailScreen from './screens/BookDetailScreen';
import LandingScreen from './screens/LandingScreen';
import ReaderScreen from './screens/ReaderScreen';
import SearchScreen from './screens/SearchScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import CommunityScreen from './screens/CommunityScreen';
import FollowingScreen from './screens/FollowingScreen';
import NewPublicationScreen from './screens/NewPublicationScreen';
import CommentsScreen from './screens/CommentsScreen';
import BottomNav from './components/BottomNav';
import SideNav from './components/SideNav';
import HomeScreenRightSidebar from './components/HomeScreenRightSidebar';
import LibraryScreen from './screens/LibraryScreen';
import { User } from '@prisma/client';

type Screen = 'home' | 'search' | 'library' | 'profile' | 'community' | 'settings';

interface NavigationState {
  page: string;
  params?: any;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([{ page: 'home' }]);

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
    sessionStorage.setItem('litbook_userId', user.id.toString());
    setCurrentUser(user);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('litbook_userId');
    setCurrentUser(null);
    setNavigationStack([{ page: 'home' }]);
  };

  if (!currentUser) {
    return <LandingScreen onLoginSuccess={handleLogin} />;
  }

  const currentNavigationState = navigationStack[navigationStack.length - 1];
  const currentPage = currentNavigationState.page;

  const renderScreen = () => {
    switch (currentPage) {
      case 'home':
        return <HomeScreen navigate={navigate} currentUser={currentUser} />;
      case 'search':
        return <SearchScreen navigate={navigate} />;
      case 'library':
        return <LibraryScreen navigate={navigate} />;
      case 'profile':
        return <ProfileScreen navigate={navigate} />;
      case 'community':
        return <CommunityScreen navigate={navigate} />;
      case 'settings':
        return <SettingsScreen onLogout={handleLogout} />;
      case 'bookDetail':
        const book = null; // MOCK_BOOKS.find(b => b.id === currentNavigationState.params.bookId);
        return book ? <BookDetailScreen book={book} goBack={goBack} navigate={navigate} /> : <div>Book not found</div>;
      case 'reader':
         const readerBook = null; // MOCK_BOOKS.find(b => b.id === currentNavigationState.params.bookId);
        return readerBook ? <ReaderScreen book={readerBook} chapter={currentNavigationState.params.chapter} paragraph={currentNavigationState.params.paragraph} goBack={goBack} /> : <div>Book not found</div>;
      case 'following':
        return <FollowingScreen goBack={goBack} navigate={navigate} />;
      case 'newPublication':
        return <NewPublicationScreen goBack={goBack} />;
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

  const bottomNavScreens = ['home', 'search', 'profile', 'community', 'library', 'settings'];
  const showBottomNav = bottomNavScreens.includes(currentPage);
  
  const CommunityFab = () => (
    <div className="fixed bottom-0 left-0 right-0 z-20 mx-auto max-w-lg pointer-events-none h-dvh lg:hidden">
      <button onClick={() => navigate('newPublication')} className="absolute bottom-24 right-4 flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-primary shadow-lg transition-transform hover:scale-105 active:scale-95 pointer-events-auto">
        <span className="material-symbols-outlined text-3xl text-white">add</span>
      </button>
    </div>
  );

  return (
    <div className="h-dvh w-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      <div className="mx-auto flex h-dvh max-w-screen-2xl">
        {/* Side Nav (Desktop) */}
        <aside className="hidden lg:flex lg:w-64 xl:w-72 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
          <SideNav navigate={navigate} changeTab={changeTab} activeTab={getActiveTab()} />
        </aside>
        
        <div className="flex flex-1 min-w-0">
          {/* Main Content */}
          <div className="flex flex-col h-dvh flex-1">
            <main className={`flex-grow overflow-y-auto ${showBottomNav ? 'pb-20' : ''} lg:pb-0`}>
              {renderScreen()}
            </main>
            {currentPage === 'community' && <CommunityFab />}
            <div className="lg:hidden">
              {showBottomNav && <BottomNav activeTab={getActiveTab()} setActiveTab={changeTab} />}
            </div>
          </div>

          {/* Right Sidebar (Desktop) */}
          <aside className="hidden xl:block xl:w-80 shrink-0 border-l border-zinc-200 dark:border-zinc-800">
             {currentPage === 'home' && <HomeScreenRightSidebar />}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default App;
