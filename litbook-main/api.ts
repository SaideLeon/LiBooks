import { User, Comment } from './types';

// This is the shape of the data as stored in localStorage/db.json
interface StoredComment {
  id: number;
  userId: number;
  timestamp: string;
  text: string;
  likes: number;
}

interface Database {
  users: User[];
  comments: Record<number, StoredComment[]>; // postId -> comments array
}

let db: Database | null = null;
const DB_KEY = 'litbook_db';

// --- Internal Functions ---

const saveDb = () => {
  if (db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
};

const getDb = (): Database => {
  if (!db) {
    throw new Error("Database not initialized. Call initApi() first.");
  }
  return db;
};

// --- Public API ---

export const initApi = async (): Promise<void> => {
  if (db) return;

  const localData = localStorage.getItem(DB_KEY);
  if (localData) {
    db = JSON.parse(localData);
    return;
  }

  try {
    const response = await fetch('/db.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const initialDb = await response.json();
    db = initialDb;
    saveDb();
  } catch (error) {
    console.error("Failed to initialize database from db.json:", error);
    // Initialize with empty structure if fetch fails
    db = { users: [], comments: {} };
  }
};

export const login = (email: string, password: string): User | null => {
  const user = getDb().users.find(u => u.email === email && u.password === password);
  return user || null;
};

export const register = (newUser: Pick<User, 'name'|'email'|'password'|'avatarUrl'>): User | Error => {
  const db = getDb();
  const existingUser = db.users.find(u => u.email === newUser.email);
  if (existingUser) {
    return new Error("User with this email already exists.");
  }
  const user: User = {
    ...newUser,
    id: Date.now(), // simple id generation
  };
  db.users.push(user);
  saveDb();
  return user;
};

export const getUserById = (id: number): User | undefined => {
  return getDb().users.find(u => u.id === id);
};

export const getCommentsForPost = (postId: number): Comment[] => {
  const comments = getDb().comments[postId] || [];
  
  return comments.map(comment => {
    const user = getUserById(comment.userId) || { id: 0, name: 'Unknown User', avatarUrl: '' };
    return { ...comment, user };
  }).sort((a,b) => b.id - a.id); // Show newest first
};

export const addComment = (postId: number, userId: number, text: string): Comment => {
  const db = getDb();
  if (!db.comments[postId]) {
    db.comments[postId] = [];
  }
  
  const newComment: StoredComment = {
    id: Date.now(),
    userId,
    text,
    timestamp: 'agora mesmo',
    likes: 0
  };
  
  db.comments[postId].push(newComment);
  saveDb();

  const user = getUserById(userId)!;
  return { ...newComment, user };
};
