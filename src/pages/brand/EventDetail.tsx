import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, proposalService } from '../../lib/events';
import { Event } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { ArrowLeft, Calendar, MapPin, Users, Target, Gift, Send } from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Omit<Event, 'expectedSponsorshipAmount'> | null>(null);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposedAmount, setProposedAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      const eventData = eventService.getEventById(id);
      if (eventData) {
        // Remove expectedSponsorshipAmount for brands
        const { expectedSponsorshipAmount, ...eventForBrand } = eventData;
        setEvent(eventForBrand);
      }
    }
  }, [id]);

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !event) return;

    proposalService.createProposal({
      eventId: event.id,
      brandId: user.id,
      brandName: user.name,
      proposedAmount: parseFloat(proposedAmount),
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate('/dashboard/brand');
    }, 2000);
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/brand')}
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
              <Badge variant="secondary">{event.status}</Badge>
            </div>
            <CardTitle>{event.title}</CardTitle>
            <CardDescription>Organized by {event.organizerName} at {event.collegeName}</CardDescription>
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

            {/* Sponsorship Benefits */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="h-5 w-5 text-blue-600" />
                <h3 className="text-gray-900">Sponsorship Benefits</h3>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {event.benefits.map((benefit, idx) => (
                  <li key={idx}>{benefit}</li>
                ))}
              </ul>
            </div>

            {/* Note about confidential amount */}
            <div className="bg-gray-100 rounded-lg p-4">
              <p className="text-gray-700">
                <strong>Note:</strong> The organizer has set their sponsorship expectations. 
                Submit your proposal with an amount that works for your brand.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Proposal Form */}
        {!showProposalForm ? (
          <Card>
            <CardContent className="text-center py-8">
              <h3 className="text-gray-900 mb-4">Interested in Sponsoring?</h3>
              <Button onClick={() => setShowProposalForm(true)}>
                <Send className="h-4 w-4 mr-2" />
                Submit Sponsorship Proposal
              </Button>
            </CardContent>
          </Card>
        ) : submitted ? (
          <Card>
            <CardContent className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-gray-900 mb-2">Proposal Submitted!</h3>
              <p className="text-gray-600">
                Your sponsorship proposal has been sent to the event organizer. 
                They will review and respond soon.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Submit Sponsorship Proposal</CardTitle>
              <CardDescription>Provide your sponsorship offer and message to the organizer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitProposal} className="space-y-4">
                <div>
                  <Label htmlFor="amount">Proposed Sponsorship Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={proposedAmount}
                    onChange={(e) => setProposedAmount(e.target.value)}
                    placeholder="10000"
                    required
                    min="100"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message to Organizer</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell the organizer why you're interested and what you can offer..."
                    rows={5}
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit">
                    Submit Proposal
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setShowProposalForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
