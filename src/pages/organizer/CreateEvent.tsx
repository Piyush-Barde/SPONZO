import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService } from '../../lib/events';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Select } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { useForm } from 'react-hook-form@7.55.0';
import { z } from 'zod';
import { EventCategory } from '../../types';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string(),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(3, 'Location is required'),
  expectedAttendees: z.number().min(10, 'Must expect at least 10 attendees'),
  expectedSponsorshipAmount: z.number().min(100, 'Minimum sponsorship amount is $100'),
  targetAudience: z.string(),
  benefits: z.string(),
  ticketPrice: z.number().min(0, 'Ticket price must be positive'),
  availableTickets: z.number().min(1, 'Must have at least 1 ticket available'),
});

type EventFormData = z.infer<typeof eventSchema>;

export const CreateEvent = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>();

  const onSubmit = (data: EventFormData) => {
    if (!user) return;

    const targetAudienceArray = data.targetAudience
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const benefitsArray = data.benefits
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    eventService.createEvent({
      title: data.title,
      description: data.description,
      organizerId: user.id,
      organizerName: user.name,
      collegeName: user.collegeName || '',
      category: data.category as EventCategory,
      date: data.date,
      location: data.location,
      expectedAttendees: data.expectedAttendees,
      expectedSponsorshipAmount: data.expectedSponsorshipAmount,
      targetAudience: targetAudienceArray,
      benefits: benefitsArray,
      ticketPrice: data.ticketPrice,
      availableTickets: data.availableTickets,
    });

    navigate('/dashboard/organizer');
  };

  const categories: EventCategory[] = [
    'Technical',
    'Cultural',
    'Sports',
    'Workshop',
    'Hackathon',
    'Conference',
    'Fest',
    'Other',
  ];

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

        <Card>
          <CardHeader>
            <CardTitle>Create New Event</CardTitle>
            <CardDescription>Fill in the details to create your event and attract sponsors</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-gray-900">Basic Information</h3>
                
                <div>
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Annual Tech Summit 2025"
                  />
                  {errors.title && (
                    <p className="text-red-600 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe your event in detail..."
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-red-600 mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select id="category" {...register('category')}>
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                    {errors.category && (
                      <p className="text-red-600 mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="date">Event Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                    />
                    {errors.date && (
                      <p className="text-red-600 mt-1">{errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    {...register('location')}
                    placeholder="MIT Campus, Boston"
                  />
                  {errors.location && (
                    <p className="text-red-600 mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>

              {/* Audience & Sponsorship */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-gray-900">Audience & Sponsorship Details</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedAttendees">Expected Attendees *</Label>
                    <Input
                      id="expectedAttendees"
                      type="number"
                      {...register('expectedAttendees', { valueAsNumber: true })}
                      placeholder="500"
                    />
                    {errors.expectedAttendees && (
                      <p className="text-red-600 mt-1">{errors.expectedAttendees.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="expectedSponsorshipAmount">
                      Expected Sponsorship Amount ($) *
                    </Label>
                    <Input
                      id="expectedSponsorshipAmount"
                      type="number"
                      {...register('expectedSponsorshipAmount', { valueAsNumber: true })}
                      placeholder="50000"
                    />
                    {errors.expectedSponsorshipAmount && (
                      <p className="text-red-600 mt-1">{errors.expectedSponsorshipAmount.message}</p>
                    )}
                    <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 rounded-md">
                      <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-blue-800">
                        This amount is confidential and will only be visible to you and administrators. 
                        Brands will not see this figure.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    {...register('targetAudience')}
                    placeholder="Students, Professionals, Startups (comma-separated)"
                  />
                  <p className="text-gray-500 mt-1">Separate multiple audiences with commas</p>
                  {errors.targetAudience && (
                    <p className="text-red-600 mt-1">{errors.targetAudience.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="benefits">Sponsorship Benefits *</Label>
                  <Textarea
                    id="benefits"
                    {...register('benefits')}
                    placeholder="Brand booth space, Logo on materials, Speaking opportunity (comma-separated)"
                    rows={3}
                  />
                  <p className="text-gray-500 mt-1">Separate multiple benefits with commas</p>
                  {errors.benefits && (
                    <p className="text-red-600 mt-1">{errors.benefits.message}</p>
                  )}
                </div>
              </div>

              {/* Ticketing */}
              <div className="space-y-4 pt-6 border-t border-gray-200">
                <h3 className="text-gray-900">Ticketing Information</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ticketPrice">Ticket Price ($) *</Label>
                    <Input
                      id="ticketPrice"
                      type="number"
                      step="0.01"
                      {...register('ticketPrice', { valueAsNumber: true })}
                      placeholder="25"
                    />
                    {errors.ticketPrice && (
                      <p className="text-red-600 mt-1">{errors.ticketPrice.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="availableTickets">Available Tickets *</Label>
                    <Input
                      id="availableTickets"
                      type="number"
                      {...register('availableTickets', { valueAsNumber: true })}
                      placeholder="500"
                    />
                    {errors.availableTickets && (
                      <p className="text-red-600 mt-1">{errors.availableTickets.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" size="lg">
                  Create Event
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/dashboard/organizer')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
