import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, ticketService } from '../../lib/events';
import { Event, Ticket } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Calendar, MapPin, Users, Ticket as TicketIcon, DollarSign } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Omit<Event, 'expectedSponsorshipAmount'>[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Omit<Event, 'expectedSponsorshipAmount'>[]>([]);
  const [myTickets, setMyTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'discover' | 'my-tickets'>('discover');

  useEffect(() => {
    // Get events WITHOUT expectedSponsorshipAmount
    const allEvents = eventService.getEventsForStudents();
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    if (user) {
      const tickets = ticketService.getTicketsByStudent(user.id);
      setMyTickets(tickets);
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = events.filter(event => 
        event.title.toLowerCase().includes(query) ||
        event.description.toLowerCase().includes(query) ||
        event.collegeName.toLowerCase().includes(query) ||
        event.category.toLowerCase().includes(query)
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchQuery, events]);

  const getEventById = (eventId: string) => {
    return eventService.getEventById(eventId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Discover amazing campus events and get your tickets</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardDescription>Available Events</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                {events.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>My Tickets</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TicketIcon className="h-5 w-5 text-purple-600" />
                {myTickets.length}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Total Spent</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                ${myTickets.reduce((sum, t) => sum + t.price, 0).toFixed(2)}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <Button
            variant={activeTab === 'discover' ? 'default' : 'outline'}
            onClick={() => setActiveTab('discover')}
          >
            Discover Events
          </Button>
          <Button
            variant={activeTab === 'my-tickets' ? 'default' : 'outline'}
            onClick={() => setActiveTab('my-tickets')}
          >
            My Tickets
          </Button>
        </div>

        {activeTab === 'discover' ? (
          <>
            {/* Search */}
            <Card className="mb-6">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Events Grid */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-gray-900">Upcoming Events</h2>
                <p className="text-gray-600">{filteredEvents.length} events</p>
              </div>

              {filteredEvents.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No events found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(event => (
                    <Card 
                      key={event.id} 
                      className="hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => navigate(`/dashboard/student/event/${event.id}`)}
                    >
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <Badge>{event.category}</Badge>
                          {event.ticketPrice !== undefined && (
                            <Badge variant="outline">
                              ${event.ticketPrice}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                        <CardDescription className="line-clamp-2">
                          {event.collegeName}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{event.expectedAttendees} expected</span>
                          </div>
                          {event.availableTickets !== undefined && (
                            <div className="pt-2 border-t border-gray-200">
                              <p className="text-gray-600">
                                {event.availableTickets > 0 
                                  ? `${event.availableTickets} tickets available` 
                                  : 'Sold out'}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className="text-gray-900 mb-4">My Tickets</h2>
            {myTickets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">You haven't purchased any tickets yet</p>
                  <Button onClick={() => setActiveTab('discover')}>
                    Discover Events
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myTickets.map(ticket => {
                  const event = getEventById(ticket.eventId);
                  if (!event) return null;

                  return (
                    <Card key={ticket.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{event.title}</CardTitle>
                            <CardDescription>
                              {new Date(event.date).toLocaleDateString()} • {event.location}
                            </CardDescription>
                          </div>
                          <Badge variant={ticket.status === 'active' ? 'success' : 'secondary'}>
                            {ticket.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-gray-600">
                          <div>
                            <p>Ticket ID</p>
                            <p className="text-gray-900">{ticket.id}</p>
                          </div>
                          <div>
                            <p>Price</p>
                            <p className="text-gray-900">${ticket.price}</p>
                          </div>
                          <div>
                            <p>Purchase Date</p>
                            <p className="text-gray-900">
                              {new Date(ticket.purchaseDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p>Category</p>
                            <p className="text-gray-900">{event.category}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
