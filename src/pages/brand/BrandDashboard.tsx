import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { eventService, proposalService } from '../../lib/events';
import { Event, EventFilters, EventCategory, SponsorshipProposal } from '../../types';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select } from '../../components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Search, Filter, Calendar, MapPin, Users, TrendingUp, DollarSign } from 'lucide-react';

export const BrandDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Omit<Event, 'expectedSponsorshipAmount'>[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Omit<Event, 'expectedSponsorshipAmount'>[]>([]);
  const [proposals, setProposals] = useState<SponsorshipProposal[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<EventFilters>({});

  useEffect(() => {
    // Get events WITHOUT expectedSponsorshipAmount
    const allEvents = eventService.getEventsForBrands();
    setEvents(allEvents);
    setFilteredEvents(allEvents);

    if (user) {
      const userProposals = proposalService.getProposalsByBrand(user.id);
      setProposals(userProposals);
    }
  }, [user]);

  useEffect(() => {
    // Apply filters
    const filtered = events.filter(event => {
      if (filters.category && event.category !== filters.category) return false;
      if (filters.location && !event.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.dateFrom && event.date < filters.dateFrom) return false;
      if (filters.dateTo && event.date > filters.dateTo) return false;
      if (filters.minAttendees && event.expectedAttendees < filters.minAttendees) return false;
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch = 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.collegeName.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }
      return true;
    });
    setFilteredEvents(filtered);
  }, [filters, events]);

  const handleFilterChange = (key: keyof EventFilters, value: string | number) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
    }));
  };

  const clearFilters = () => {
    setFilters({});
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

  const totalProposals = proposals.length;
  const acceptedProposals = proposals.filter(p => p.status === 'accepted').length;
  const pendingProposals = proposals.filter(p => p.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-gray-900 mb-2">Brand Dashboard</h1>
          <p className="text-gray-600">Discover events and connect with student audiences</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
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
              <CardDescription>Total Proposals</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                {totalProposals}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Accepted</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                {acceptedProposals}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardDescription>Pending</CardDescription>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                {pendingProposals}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search events by title, description, or college..."
                      value={filters.searchQuery || ''}
                      onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button
                  variant={showFilters ? 'default' : 'outline'}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {showFilters && (
                <div className="grid md:grid-cols-4 gap-4 pt-4 border-t border-gray-200">
                  <div>
                    <Label htmlFor="category-filter">Category</Label>
                    <Select
                      id="category-filter"
                      value={filters.category || ''}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location-filter">Location</Label>
                    <Input
                      id="location-filter"
                      placeholder="City or region"
                      value={filters.location || ''}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="date-from">Date From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={filters.dateFrom || ''}
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="min-attendees">Min Attendees</Label>
                    <Input
                      id="min-attendees"
                      type="number"
                      placeholder="100"
                      value={filters.minAttendees || ''}
                      onChange={(e) => handleFilterChange('minAttendees', parseInt(e.target.value) || 0)}
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Button variant="outline" onClick={clearFilters}>
                      Clear Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-gray-900">Available Events</h2>
            <p className="text-gray-600">{filteredEvents.length} events found</p>
          </div>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No events found matching your criteria</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Card 
                  key={event.id} 
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => navigate(`/dashboard/brand/event/${event.id}`)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge>{event.category}</Badge>
                      <Badge variant="secondary">{event.status}</Badge>
                    </div>
                    <CardTitle className="line-clamp-1">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
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
                        <span>{event.expectedAttendees.toLocaleString()} expected attendees</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-gray-600 mb-1">Target Audience:</p>
                        <div className="flex flex-wrap gap-1">
                          {event.targetAudience.slice(0, 3).map((audience, idx) => (
                            <Badge key={idx} variant="outline">{audience}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
