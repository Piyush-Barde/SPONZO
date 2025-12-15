import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, proposalService } from '../../lib/events';
import { Event, SponsorshipProposal } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Plus, Calendar, Users, DollarSign, TrendingUp } from 'lucide-react';

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [proposals, setProposals] = useState<SponsorshipProposal[]>([]);

  useEffect(() => {
    if (user) {
      const userEvents = eventService.getEventsByOrganizer(user.id);
      setEvents(userEvents);

      const allProposals: SponsorshipProposal[] = [];
      userEvents.forEach(event => {
        const eventProposals = proposalService.getProposalsByEvent(event.id);
        allProposals.push(...eventProposals);
      });
      setProposals(allProposals);
    }
  }, [user]);

  const totalExpectedSponsorship = events.reduce((sum, e) => sum + e.expectedSponsorshipAmount, 0);
  const totalReceived = events.reduce((sum, e) => sum + (e.sponsorshipReceived || 0), 0);
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'success',
      rejected: 'destructive',
      completed: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-gray-900 mb-2">Organizer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user?.name}!</p>
          </div>
          <Button onClick={() => navigate('/dashboard/organizer/create-event')}>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Total Events</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {events.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Expected Sponsorship</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                ${totalExpectedSponsorship.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Received</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                ${totalReceived.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Pending Proposals</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                {pendingProposals}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Events List */}
        <Card>
          <CardHeader>
            <CardTitle>Your Events</CardTitle>
            <CardDescription>Manage and track all your events</CardDescription>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No events yet</p>
                <Button onClick={() => navigate('/dashboard/organizer/create-event')}>
                  Create Your First Event
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map(event => (
                  <div 
                    key={event.id} 
                    className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/organizer/event/${event.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                      </div>
                      {getStatusBadge(event.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-600">
                      <div>
                        <span className="block">Date</span>
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="block">Category</span>
                        <span>{event.category}</span>
                      </div>
                      <div>
                        <span className="block">Expected Attendees</span>
                        <span>{event.expectedAttendees}</span>
                      </div>
                      <div>
                        <span className="block">Expected Sponsorship</span>
                        <span className="text-green-600">${event.expectedSponsorshipAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
