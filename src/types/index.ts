// User Roles
export type UserRole = 'student' | 'organizer' | 'brand' | 'admin';

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationName?: string; // For brands and organizers
  collegeName?: string; // For students and organizers
  createdAt: string;
}

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId: string;
  organizerName: string;
  collegeName: string;
  category: EventCategory;
  date: string;
  location: string;
  expectedAttendees: number;
  expectedSponsorshipAmount: number; // CONFIDENTIAL - Only visible to Admin and Organizer
  targetAudience: string[];
  benefits: string[];
  imageUrl?: string;
  status: EventStatus;
  createdAt: string;
  sponsorshipReceived?: number;
  sponsoredBy?: string[]; // Brand IDs
  ticketPrice?: number;
  availableTickets?: number;
}

export type EventCategory = 
  | 'Technical' 
  | 'Cultural' 
  | 'Sports' 
  | 'Workshop' 
  | 'Hackathon' 
  | 'Conference' 
  | 'Fest'
  | 'Other';

export type EventStatus = 'pending' | 'approved' | 'rejected' | 'completed';

// Sponsorship Types
export interface SponsorshipProposal {
  id: string;
  eventId: string;
  brandId: string;
  brandName: string;
  proposedAmount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

// Ticket Types
export interface Ticket {
  id: string;
  eventId: string;
  studentId: string;
  studentName: string;
  purchaseDate: string;
  price: number;
  status: 'active' | 'used' | 'cancelled';
}

// Filter Types
export interface EventFilters {
  category?: EventCategory;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  minAttendees?: number;
  targetAudience?: string[];
  searchQuery?: string;
}
