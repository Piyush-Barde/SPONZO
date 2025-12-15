import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Calendar, Building2, Users, Shield, TrendingUp, Sparkles } from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'For College Organizers',
      description: 'Create and manage events, attract sponsors, and make your campus events successful.',
      cta: 'Start Organizing',
      role: 'organizer',
    },
    {
      icon: Building2,
      title: 'For Brands',
      description: 'Discover student events, connect with young audiences, and build brand presence on campuses.',
      cta: 'Explore Events',
      role: 'brand',
    },
    {
      icon: Users,
      title: 'For Students',
      description: 'Find exciting campus events, purchase tickets, and be part of amazing experiences.',
      cta: 'Discover Events',
      role: 'student',
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Enterprise-grade security for all transactions and data.',
    },
    {
      icon: TrendingUp,
      title: 'Grow Together',
      description: 'Connect organizers, brands, and students in one ecosystem.',
    },
    {
      icon: Sparkles,
      title: 'Easy to Use',
      description: 'Intuitive interface designed for seamless experience.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-gray-900 mb-6">
            Welcome to SPONZO
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto mb-8">
            The ultimate three-sided marketplace connecting college organizers, brands, and students. 
            Create unforgettable campus events with the perfect sponsorships.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')}>
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center text-gray-900 mb-12">
          Who is SPONZO For?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card key={feature.role} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/auth', { state: { role: feature.role } })}
                  >
                    {feature.cta}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-gray-900 mb-12">
            Why Choose SPONZO?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-blue-600 rounded-2xl p-12 text-center">
          <h2 className="text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of organizers, brands, and students already using SPONZO to create amazing campus experiences.
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate('/auth')}>
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};
