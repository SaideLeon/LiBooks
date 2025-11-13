'use client';
import React, { useState, useEffect } from 'react'; // Added this line
import LandingScreen from '@/screens/LandingScreen';
import HomeScreen from '@/screens/HomeScreen';
import SearchScreen from '@/screens/SearchScreen';
import LibraryScreen from '@/screens/LibraryScreen';
import CommunityScreen from '@/screens/CommunityScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import SettingsScreen from '@/screens/SettingsScreen';
import BookDetailScreen from '@/screens/BookDetailScreen';
import ReaderScreen from '@/screens/ReaderScreen';
import CommentsScreen from '@/screens/CommentsScreen';
import FollowingScreen from '@/screens/FollowingScreen';
import NewPublicationScreen from '@/screens/NewPublicationScreen';
import NewBookScreen from '@/screens/NewBookScreen';
import BottomNav from '@/components/BottomNav';
import SideNav from '@/components/SideNav';
import { Spinner } from '@/components/Spinner';
import { User, Book as BookType, CommunityPost as CommunityPostType } from '@/lib/prisma/definitions';
import { Screen, NavigationState } from '@/lib/definitions';
import { useUser, UserProvider } from '@/hooks/use-user';
import { getBookById, getUserById } from '@/lib/actions'; // Added getUserById

const MainApp: React.FC = () => {
  const { user, isLoading, login } = useUser();
  const [navigation, setNavigation] = useState<NavigationState>({ screen: 'home' });
  const [activeTab, setActiveTab] = useState<Screen>('home');
  const [book, setBook] = useState<BookType | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null); // New state

  useEffect(() => {
    if (navigation.screen !== activeTab && !['bookDetail', 'reader', 'comments', 'following', 'newPublication', 'newBook'].includes(navigation.screen)) {
      setNavigation({ screen: activeTab });
    }
  }, [activeTab, navigation.screen]);

  const navigate = async (screen: Screen, params?: any) => {
    if (screen === 'bookDetail' && params?.bookId) {
      const fetchedBook = await getBookById(params.bookId);
      setBook(fetchedBook);
    } else if(screen === 'reader' && params?.bookId && !params?.book) {
        const fetchedBook = await getBookById(params.bookId);
        params.book = fetchedBook;
    } else if (screen === 'profile' && params?.userId) { // New logic for profile screen
        const fetchedUser = await getUserById(params.userId);
        setProfileUser(fetchedUser);
    }
    setNavigation({ screen, params });
  };
  
  const goBack = () => {
     if (['bookDetail', 'reader', 'comments', 'following', 'newPublication', 'newBook'].includes(navigation.screen)) {
       setNavigation({ screen: activeTab });
     }
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    login(loggedInUser);
    setActiveTab('home');
    setNavigation({ screen: 'home' });
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <Spinner />
      </div>
    );
  }
  
  if (!user) {
    return <LandingScreen onLoginSuccess={handleLoginSuccess} />;
  }
  
  let content;
  switch (navigation.screen) {
    case 'home':
      content = <HomeScreen navigate={navigate} currentUser={user} />;
      break;
    case 'search':
      content = <SearchScreen navigate={navigate} />;
      break;
    case 'library':
      content = <LibraryScreen navigate={navigate} />;
      break;
    case 'community':
      content = <CommunityScreen navigate={navigate} currentUser={user} />;
      break;
    case 'profile':
      content = <ProfileScreen navigate={navigate} user={profileUser || user} />; // Use profileUser if available, otherwise current user
      break;
    case 'settings':
      content = <SettingsScreen />;
      break;
    case 'bookDetail':
        content = book ? <BookDetailScreen book={book} goBack={goBack} navigate={navigate} /> : <div className="h-full w-full flex items-center justify-center"><Spinner /></div>;
        break;
    case 'reader':
        content = navigation.params?.book ? <ReaderScreen {...navigation.params} goBack={goBack} /> : <div className="h-full w-full flex items-center justify-center"><Spinner /></div>;
        break;
    case 'comments':
        content = <CommentsScreen {...navigation.params} goBack={goBack} navigate={navigate} currentUser={user} />;
        break;
    case 'following':
        content = <FollowingScreen {...navigation.params} goBack={goBack} navigate={navigate} />;
        break;
    case 'newPublication':
        content = <NewPublicationScreen goBack={goBack} currentUser={user} />;
        break;
    case 'newBook':
        const { bookId } = navigation.params || {};
        content = <NewBookScreen goBack={goBack} navigate={navigate} existingBook={book} />;
        break;
    default:
      content = <HomeScreen navigate={navigate} currentUser={user} />;
  }

  return (
    <div className="h-dvh w-full lg:grid lg:grid-cols-[280px_1fr]">
      <div className="hidden lg:block border-r border-gray-200/80 dark:border-gray-800/80">
        <SideNav activeTab={activeTab} changeTab={setActiveTab} navigate={navigate} currentUser={user} />
      </div>
      <main className="h-full overflow-y-auto pb-20 lg:pb-0">
        {content}
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default function Home() {
    return (
        <UserProvider>
            <MainApp />
        </UserProvider>
    )
}