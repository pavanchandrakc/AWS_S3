import React, { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface User {
  id: number;
  username: string;
  email: string;
}

const LoginPage: React.FC<{
  onLogin: (user: User, token: string) => void;
}> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const response = await api.login(username, password);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success('Login successful!', {
          description: `Welcome back, ${response.data.user.username}!`,
        });
        onLogin(response.data.user, response.data.token);
      } else {
        if (!email) {
          toast.error('Email required', {
            description: 'Please enter your email address.',
          });
          setLoading(false);
          return;
        }
        await api.register(username, email, password);
        toast.success('Registration successful!', {
          description: 'Please log in with your credentials.',
        });
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
      }
    } catch (err: any) {
      toast.error('Error', {
        description: err.response?.data?.error || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Register'}</CardTitle>
          <CardDescription>
            {isLogin ? 'Sign in to your S3 File Manager' : 'Create a new account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <Button
              type="button"
              variant="link"
              className="p-0 h-auto"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              {isLogin ? 'Register' : 'Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
