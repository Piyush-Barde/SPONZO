import { useState, useEffect } from 'react';
import { eventService, proposalService } from '../../lib/events';
import { Event, SponsorshipProposal } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Calendar, DollarSign, TrendingUp, Eye, EyeOff } from 'lucide-react';

export const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [proposals, setProposals] = useState<SponsorshipProposal[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showConfidential, setShowConfidential] = useState(true);

  useEffect(() => {
    // Admin can see ALL event data including expectedSponsorshipAmount
    const allEvents = eventService.getAllEvents();
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    const allProposals = proposalService.getAllProposals();
    setProposals(allProposals);
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.organizerName.toLowerCase().includes(query) ||
        event.collegeName.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const totalExpectedSponsorship = events.reduce((sum, e) => sum + e.expectedSponsorshipAmount, 0);
  const totalProposedAmount = proposals.reduce((sum, p) => sum + p.proposedAmount, 0);
  const totalReceived = events.reduce((sum, e) => sum + (e.sponsorshipReceived || 0), 0);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'success' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'success',
      rejected: 'destructive',
      completed: 'default',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const handleApproveEvent = (eventId: string) => {
    eventService.updateEvent(eventId, { status: 'approved' });
    const updatedEvents = eventService.getAllEvents();
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
  };

  const handleRejectEvent = (eventId: string) => {
    eventService.updateEvent(eventId, { status: 'rejected' });
    const updatedEvents = eventService.getAllEvents();
    setEvents(updatedEvents);
    setFilteredEvents(updatedEvents);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage all events and view confidential data</p>
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
              <CardDescription>Proposed Amount</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                ${totalProposedAmount.toLocaleString()}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Proposals</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                {proposals.length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button
                variant={showConfidential ? 'default' : 'outline'}
                onClick={() => setShowConfidential(!showConfidential)}
              >
                {showConfidential ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showConfidential ? 'Hide' : 'Show'} Confidential
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Events</CardTitle>
            <CardDescription>
              Complete event data including confidential sponsorship amounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No events found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredEvents.map(event => {
                  const eventProposals = proposals.filter(p => p.eventId === event.id);
                  
                  return (
                    <div 
                      key={event.id} 
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-gray-900">{event.title}</h3>
                            {getStatusBadge(event.status)}
                            <Badge variant="outline">{event.category}</Badge>
                          </div>
                          <p className="text-gray-600 mb-1">{event.description}</p>
                          <p className="text-gray-500">
                            By {event.organizerName} • {event.collegeName}
                          </p>
                        </div>
                        {event.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveEvent(event.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleRejectEvent(event.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-gray-600 mb-3">
                        <div>
                          <span className="block">Date</span>
                          <span className="text-gray-900">
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="block">Location</span>
                          <span className="text-gray-900">{event.location}</span>
                        </div>
                        <div>
                          <span className="block">Expected Attendees</span>
                          <span className="text-gray-900">{event.expectedAttendees}</span>
                        </div>
                        <div>
                          <span className="block">Ticket Price</span>
                          <span className="text-gray-900">${event.ticketPrice}</span>
                        </div>
                        <div>
                          <span className="block">Available Tickets</span>
                          <span className="text-gray-900">{event.availableTickets}</span>
                        </div>
                        <div>
                          <span className="block">Proposals</span>
                          <span className="text-gray-900">{eventProposals.length}</span>
                        </div>
                      </div>

                      {/* CONFIDENTIAL DATA - Only visible to Admin */}
                      {showConfidential && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="destructive">CONFIDENTIAL</Badge>
                            <span className="text-red-900">Admin Only - Hidden from Brands</span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <span className="block text-red-700">Expected Sponsorship</span>
                              <span className="text-red-900">
                                ${event.expectedSponsorshipAmount.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="block text-red-700">Received</span>
                              <span className="text-red-900">
                                ${(event.sponsorshipReceived || 0).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="block text-red-700">Gap</span>
                              <span className="text-red-900">
                                ${(event.expectedSponsorshipAmount - (event.sponsorshipReceived || 0)).toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="block text-red-700">Fulfillment</span>
                              <span className="text-red-900">
                                {((event.sponsorshipReceived || 0) / event.expectedSponsorshipAmount * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Proposals for this event */}
                      {eventProposals.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-gray-700 mb-2">Sponsorship Proposals:</p>
                          <div className="space-y-2">
                            {eventProposals.map(proposal => (
                              <div key={proposal.id} className="bg-gray-50 rounded p-2 flex justify-between items-center">
                                <div>
                                  <span className="text-gray-900">{proposal.brandName}</span>
                                  <span className="text-gray-600"> - ${proposal.proposedAmount.toLocaleString()}</span>
                                </div>
                                <Badge variant={
                                  proposal.status === 'accepted' ? 'success' : 
                                  proposal.status === 'rejected' ? 'destructive' : 'secondary'
                                }>
                                  {proposal.status}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
