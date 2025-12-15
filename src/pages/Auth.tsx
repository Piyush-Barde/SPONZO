import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { UserRole } from '../types';
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['student', 'organizer', 'brand']),
  organizationName: z.string().optional(),
  collegeName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register: registerUser } = useAuth();

  const defaultRole = (location.state as { role?: UserRole })?.role || 'student';

  const {
    register: registerField,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: defaultRole,
    },
  });

  const selectedRole = watch('role');

  const onLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const success = login(email, password);
    
    if (success) {
      const user = JSON.parse(localStorage.getItem('sponzo_auth') || '{}');
      navigate(`/dashboard/${user.role}`);
    } else {
      setError('Invalid email or password');
    }
  };

  const onRegisterSubmit = (data: RegisterFormData) => {
    setError('');
    
    const success = registerUser(
      data.email,
      data.password,
      data.name,
      data.role,
      data.organizationName,
      data.collegeName
    );
    
    if (success) {
      navigate(`/dashboard/${data.role}`);
    } else {
      setError('Email already exists');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isLogin ? 'Welcome Back' : 'Create Account'}</CardTitle>
          <CardDescription>
            {isLogin 
              ? 'Enter your credentials to access your account' 
              : 'Sign up to start using SPONZO'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLogin ? (
            <form onSubmit={onLoginSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {error && (
                <p className="text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center mt-4">
                <p className="text-gray-600">
                  Demo credentials:
                </p>
                <p className="text-gray-500 mt-2">
                  Organizer: organizer@college.edu
                </p>
                <p className="text-gray-500">
                  Brand: brand@company.com
                </p>
                <p className="text-gray-500">
                  Student: student@college.edu
                </p>
                <p className="text-gray-500">
                  Admin: admin@sponzo.com
                </p>
                <p className="text-gray-400 mt-1">(any password works)</p>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...registerField('name')}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-600 mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="reg-email">Email</Label>
                <Input
                  id="reg-email"
                  type="email"
                  {...registerField('email')}
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">I am a...</Label>
                <Select id="role" {...registerField('role')}>
                  <option value="student">Student</option>
                  <option value="organizer">College Organizer</option>
                  <option value="brand">Brand Representative</option>
                </Select>
              </div>

              {selectedRole === 'organizer' && (
                <>
                  <div>
                    <Label htmlFor="org-name">Organization Name</Label>
                    <Input
                      id="org-name"
                      {...registerField('organizationName')}
                      placeholder="Tech Events Team"
                    />
                  </div>
                  <div>
                    <Label htmlFor="college">College Name</Label>
                    <Input
                      id="college"
                      {...registerField('collegeName')}
                      placeholder="MIT"
                    />
                  </div>
                </>
              )}

              {selectedRole === 'brand' && (
                <div>
                  <Label htmlFor="brand-org">Company Name</Label>
                  <Input
                    id="brand-org"
                    {...registerField('organizationName')}
                    placeholder="TechCorp Inc."
                  />
                </div>
              )}

              {selectedRole === 'student' && (
                <div>
                  <Label htmlFor="student-college">College Name</Label>
                  <Input
                    id="student-college"
                    {...registerField('collegeName')}
                    placeholder="MIT"
                  />
                </div>
              )}

              <div>
                <Label htmlFor="reg-password">Password</Label>
                <Input
                  id="reg-password"
                  type="password"
                  {...registerField('password')}
                  placeholder="Minimum 6 characters"
                />
                {errors.password && (
                  <p className="text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  {...registerField('confirmPassword')}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <p className="text-red-600 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              {error && (
                <p className="text-red-600">{error}</p>
              )}

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-600 hover:underline"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
