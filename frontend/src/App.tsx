import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import LoginPage from './LoginPage';
import FileManager from './FileManager';

interface User {
  id: number;
  username: string;
  email: string;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (loggedInUser: User, token: string) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <Toaster position="top-right" />
      {user ? (
        <FileManager onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
};

export default App;
