import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, ticketService } from '../../lib/events';
import { Event } from '../../types';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Target, Ticket as TicketIcon, CheckCircle } from 'lucide-react';

export const StudentEventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Omit<Event, 'expectedSponsorshipAmount'> | null>(null);
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = eventService.getEventById(id);
      if (eventData) {
        // Remove expectedSponsorshipAmount for students
        const { expectedSponsorshipAmount, ...eventForStudent } = eventData;
        setEvent(eventForStudent);
      }
    }
  }, [id]);

  const handlePurchaseTicket = () => {
    if (!user || !event || !event.ticketPrice) return;

    const ticket = ticketService.purchaseTicket({
      eventId: event.id,
      studentId: user.id,
      studentName: user.name,
      price: event.ticketPrice,
    });

    if (ticket) {
      setPurchased(true);
      // Refresh event data to show updated available tickets
      const updatedEvent = eventService.getEventById(event.id);
      if (updatedEvent) {
        const { expectedSponsorshipAmount, ...eventForStudent } = updatedEvent;
        setEvent(eventForStudent);
      }
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  const canPurchase = event.availableTickets && event.availableTickets > 0 && !purchased;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/student')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Event Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start mb-2">
              <Badge>{event.category}</Badge>
              {event.ticketPrice !== undefined && (
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    ${event.ticketPrice}
                  </Badge>
                </div>
              )}
            </div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>
              Organized by {event.organizerName} at {event.collegeName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-gray-900 mb-2">About This Event</h3>
              <p className="text-gray-600">{event.description}</p>
            </div>

            {/* Key Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">Date</p>
                  <p className="text-gray-600">{new Date(event.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
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
                  <p className="text-gray-600">{event.expectedAttendees.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-gray-900">Target Audience</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {event.targetAudience.map((audience, idx) => (
                      <Badge key={idx} variant="outline">{audience}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Information */}
            {event.availableTickets !== undefined && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-gray-900">Ticket Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="text-gray-900">${event.ticketPrice}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Available Tickets</p>
                    <p className={`${event.availableTickets > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {event.availableTickets > 0 ? event.availableTickets : 'Sold Out'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase Section */}
        {purchased ? (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-gray-900 mb-2">Ticket Purchased!</h3>
              <p className="text-gray-600 mb-4">
                Your ticket has been confirmed. Check "My Tickets" to view details.
              </p>
              <Button onClick={() => navigate('/dashboard/student')}>
                View My Tickets
              </Button>
            </CardContent>
          </Card>
        ) : canPurchase ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-gray-900 mb-2">Ready to Attend?</h3>
              <p className="text-gray-600 mb-4">
                Get your ticket now for ${event.ticketPrice}
              </p>
              <Button onClick={handlePurchaseTicket} size="lg">
                <TicketIcon className="h-4 w-4 mr-2" />
                Purchase Ticket
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">
                {event.availableTickets === 0 ? 'This event is sold out' : 'Tickets are not available'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
