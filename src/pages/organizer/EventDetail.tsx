import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, proposalService } from '../../lib/events';
import { Event, SponsorshipProposal } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

export const OrganizerEventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [proposals, setProposals] = useState<SponsorshipProposal[]>([]);

  useEffect(() => {
    if (id) {
      const eventData = eventService.getEventById(id);
      if (eventData && user && eventData.organizerId === user.id) {
        setEvent(eventData);
        const eventProposals = proposalService.getProposalsByEvent(id);
        setProposals(eventProposals);
      }
    }
  }, [id, user]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found or access denied</p>
      </div>
    );
  }

  const totalProposed = proposals.reduce((sum, p) => sum + p.proposedAmount, 0);
  const acceptedProposals = proposals.filter(p => p.status === 'accepted');
  const totalAccepted = acceptedProposals.reduce((sum, p) => sum + p.proposedAmount, 0);
  const gap = event.expectedSponsorshipAmount - totalAccepted;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/organizer')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Event Overview */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge>{event.category}</Badge>
              <Badge variant={event.status === 'approved' ? 'success' : 'secondary'}>
                {event.status}
              </Badge>
            </div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>{event.collegeName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">{event.description}</p>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">Date</p>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">Expected Attendees</p>
                  <p className="text-gray-600">{event.expectedAttendees}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsorship Tracking */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Sponsorship Tracking</CardTitle>
            <CardDescription>Your confidential sponsorship goals and progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Financial Overview */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <p className="text-blue-900">Expected Sponsorship</p>
                </div>
                <p className="text-blue-900">${event.expectedSponsorshipAmount.toLocaleString()}</p>
                <div className="flex items-start gap-2 mt-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-blue-800">This amount is confidential and hidden from brands</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <p className="text-green-900">Accepted Sponsorships</p>
                </div>
                <p className="text-green-900">${totalAccepted.toLocaleString()}</p>
                <p className="text-green-700 mt-2">
                  {((totalAccepted / event.expectedSponsorshipAmount) * 100).toFixed(1)}% of goal
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div className="flex justify-between text-gray-600 mb-2">
                <span>Progress to Goal</span>
                <span>${gap.toLocaleString()} remaining</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${Math.min((totalAccepted / event.expectedSponsorshipAmount) * 100, 100)}%` }}
                />
              </div>
            </div>

            {/* Proposals Summary */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <p className="text-gray-600">Total Proposals</p>
                <p className="text-gray-900">{proposals.length}</p>
              </div>
              <div>
                <p className="text-gray-600">Total Proposed</p>
                <p className="text-gray-900">${totalProposed.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Pending</p>
                <p className="text-gray-900">{proposals.filter(p => p.status === 'pending').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sponsorship Proposals */}
        <Card>
          <CardHeader>
            <CardTitle>Sponsorship Proposals</CardTitle>
            <CardDescription>Review and manage brand proposals for your event</CardDescription>
          </CardHeader>
          <CardContent>
            {proposals.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sponsorship proposals yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map(proposal => (
                  <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-gray-900">{proposal.brandName}</h3>
                        <p className="text-gray-600">
                          Proposed: ${proposal.proposedAmount.toLocaleString()}
                        </p>
                      </div>
                      <Badge variant={
                        proposal.status === 'accepted' ? 'success' :
                        proposal.status === 'rejected' ? 'destructive' : 'secondary'
                      }>
                        {proposal.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{proposal.message}</p>
                    
                    <p className="text-gray-500">
                      Submitted: {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
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
