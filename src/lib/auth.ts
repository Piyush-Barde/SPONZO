import { User, UserRole } from '../types';

const AUTH_STORAGE_KEY = 'sponzo_auth';
const USERS_STORAGE_KEY = 'sponzo_users';

// Mock users for demonstration
const INITIAL_USERS: User[] = [
  {
    id: 'admin-1',
    email: 'admin@sponzo.com',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'organizer-1',
    email: 'organizer@college.edu',
    name: 'John Organizer',
    role: 'organizer',
    organizationName: 'Tech Events Team',
    collegeName: 'MIT',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'brand-1',
    email: 'brand@company.com',
    name: 'Sarah Brand',
    role: 'brand',
    organizationName: 'TechCorp Inc.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'student-1',
    email: 'student@college.edu',
    name: 'Alex Student',
    role: 'student',
    collegeName: 'MIT',
    createdAt: new Date().toISOString(),
  },
];

// Initialize users if not exists
if (typeof window !== 'undefined' && !localStorage.getItem(USERS_STORAGE_KEY)) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(INITIAL_USERS));
}

export const authService = {
  login: (email: string, password: string): User | null => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : INITIAL_USERS;
    
    // Simple mock authentication - in production, this would be a backend call
    const user = users.find(u => u.email === email);
    
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    
    return null;
  },

  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    organizationName?: string,
    collegeName?: string
  ): User | null => {
    const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : INITIAL_USERS;
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
      return null;
    }
    
    const newUser: User = {
      id: `${role}-${Date.now()}`,
      email,
      name,
      role,
      organizationName,
      collegeName,
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
    
    return newUser;
  },

  logout: (): void => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
    return userJson ? JSON.parse(userJson) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_STORAGE_KEY);
  },

  hasRole: (allowedRoles: UserRole[]): boolean => {
    const user = authService.getCurrentUser();
    return user ? allowedRoles.includes(user.role) : false;
  },
};
