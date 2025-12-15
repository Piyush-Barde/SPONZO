import { Event, EventFilters, SponsorshipProposal, Ticket } from '../types';

const EVENTS_STORAGE_KEY = 'sponzo_events';
const PROPOSALS_STORAGE_KEY = 'sponzo_proposals';
const TICKETS_STORAGE_KEY = 'sponzo_tickets';

// Mock initial events
const INITIAL_EVENTS: Event[] = [
  {
    id: 'event-1',
    title: 'Tech Summit 2025',
    description: 'Annual technology summit featuring industry leaders and innovative startups. Join us for keynotes, workshops, and networking opportunities.',
    organizerId: 'organizer-1',
    organizerName: 'John Organizer',
    collegeName: 'MIT',
    category: 'Conference',
    date: '2025-03-15',
    location: 'MIT Campus, Boston',
    expectedAttendees: 500,
    expectedSponsorshipAmount: 50000, // CONFIDENTIAL
    targetAudience: ['Students', 'Professionals', 'Startups'],
    benefits: ['Brand booth space', 'Logo on materials', 'Speaking opportunity'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    ticketPrice: 25,
    availableTickets: 500,
  },
  {
    id: 'event-2',
    title: 'Cultural Fest 2025',
    description: 'Three-day cultural extravaganza with music, dance, drama, and fashion shows.',
    organizerId: 'organizer-1',
    organizerName: 'John Organizer',
    collegeName: 'MIT',
    category: 'Cultural',
    date: '2025-04-20',
    location: 'MIT Auditorium',
    expectedAttendees: 1000,
    expectedSponsorshipAmount: 75000, // CONFIDENTIAL
    targetAudience: ['Students', 'Young Adults'],
    benefits: ['Prime branding location', 'Product placement', 'Social media promotion'],
    status: 'approved',
    createdAt: new Date().toISOString(),
    ticketPrice: 15,
    availableTickets: 1000,
  },
];

if (typeof window !== 'undefined' && !localStorage.getItem(EVENTS_STORAGE_KEY)) {
  localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(INITIAL_EVENTS));
}

export const eventService = {
  getAllEvents: (): Event[] => {
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    return eventsJson ? JSON.parse(eventsJson) : INITIAL_EVENTS;
  },

  getEventById: (id: string): Event | null => {
    const events = eventService.getAllEvents();
    return events.find(e => e.id === id) || null;
  },

  getEventsByOrganizer: (organizerId: string): Event[] => {
    const events = eventService.getAllEvents();
    return events.filter(e => e.organizerId === organizerId);
  },

  // Returns events WITHOUT expectedSponsorshipAmount for brands
  getEventsForBrands: (filters?: EventFilters): Omit<Event, 'expectedSponsorshipAmount'>[] => {
    let events = eventService.getAllEvents().filter(e => e.status === 'approved');
    
    if (filters) {
      events = eventService.filterEvents(events, filters);
    }
    
    // Remove expectedSponsorshipAmount field for brands
    return events.map(({ expectedSponsorshipAmount, ...event }) => event);
  },

  // Returns events WITHOUT expectedSponsorshipAmount for students
  getEventsForStudents: (filters?: EventFilters): Omit<Event, 'expectedSponsorshipAmount'>[] => {
    let events = eventService.getAllEvents().filter(e => e.status === 'approved');
    
    if (filters) {
      events = eventService.filterEvents(events, filters);
    }
    
    // Remove expectedSponsorshipAmount field for students
    return events.map(({ expectedSponsorshipAmount, ...event }) => event);
  },

  filterEvents: (events: Event[], filters: EventFilters): Event[] => {
    return events.filter(event => {
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
      if (filters.targetAudience && filters.targetAudience.length > 0) {
        const hasMatchingAudience = filters.targetAudience.some(audience =>
          event.targetAudience.includes(audience)
        );
        if (!hasMatchingAudience) return false;
      }
      return true;
    });
  },

  createEvent: (event: Omit<Event, 'id' | 'createdAt' | 'status'>): Event => {
    const events = eventService.getAllEvents();
    const newEvent: Event = {
      ...event,
      id: `event-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    events.push(newEvent);
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return newEvent;
  },

  updateEvent: (id: string, updates: Partial<Event>): Event | null => {
    const events = eventService.getAllEvents();
    const index = events.findIndex(e => e.id === id);
    
    if (index === -1) return null;
    
    events[index] = { ...events[index], ...updates };
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    return events[index];
  },

  deleteEvent: (id: string): boolean => {
    const events = eventService.getAllEvents();
    const filtered = events.filter(e => e.id !== id);
    
    if (filtered.length === events.length) return false;
    
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(filtered));
    return true;
  },
};

export const proposalService = {
  getAllProposals: (): SponsorshipProposal[] => {
    const proposalsJson = localStorage.getItem(PROPOSALS_STORAGE_KEY);
    return proposalsJson ? JSON.parse(proposalsJson) : [];
  },

  getProposalsByBrand: (brandId: string): SponsorshipProposal[] => {
    const proposals = proposalService.getAllProposals();
    return proposals.filter(p => p.brandId === brandId);
  },

  getProposalsByEvent: (eventId: string): SponsorshipProposal[] => {
    const proposals = proposalService.getAllProposals();
    return proposals.filter(p => p.eventId === eventId);
  },

  createProposal: (proposal: Omit<SponsorshipProposal, 'id' | 'createdAt' | 'status'>): SponsorshipProposal => {
    const proposals = proposalService.getAllProposals();
    const newProposal: SponsorshipProposal = {
      ...proposal,
      id: `proposal-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    proposals.push(newProposal);
    localStorage.setItem(PROPOSALS_STORAGE_KEY, JSON.stringify(proposals));
    return newProposal;
  },
};

export const ticketService = {
  getAllTickets: (): Ticket[] => {
    const ticketsJson = localStorage.getItem(TICKETS_STORAGE_KEY);
    return ticketsJson ? JSON.parse(ticketsJson) : [];
  },

  getTicketsByStudent: (studentId: string): Ticket[] => {
    const tickets = ticketService.getAllTickets();
    return tickets.filter(t => t.studentId === studentId);
  },

  purchaseTicket: (ticket: Omit<Ticket, 'id' | 'purchaseDate' | 'status'>): Ticket | null => {
    const event = eventService.getEventById(ticket.eventId);
    
    if (!event || !event.availableTickets || event.availableTickets <= 0) {
      return null;
    }
    
    const tickets = ticketService.getAllTickets();
    const newTicket: Ticket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      purchaseDate: new Date().toISOString(),
      status: 'active',
    };
    
    tickets.push(newTicket);
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
    
    // Update available tickets
    eventService.updateEvent(ticket.eventId, {
      availableTickets: event.availableTickets - 1,
    });
    
    return newTicket;
  },
};
