# SPONZO - Three-Sided Marketplace

A complete, production-ready marketplace connecting College Organizers, Brands, and Students for event sponsorships.

## Overview

SPONZO is a comprehensive three-sided marketplace platform that enables:
- **College Organizers**: Create and manage campus events, attract sponsors
- **Brands**: Discover student events and submit sponsorship proposals
- **Students**: Find exciting campus events and purchase tickets
- **Admin**: Oversee all platform activities with full data visibility

## Key Features

### Role-Based Access Control
- Strict route protection based on user roles (organizer, brand, student, admin)
- Role-specific dashboards and features
- Automatic redirection based on user permissions

### Data Privacy & Security
**Critical Constraint**: The `expectedSponsorshipAmount` field is confidential:
- ✅ **Visible to**: Organizers (who created the event) and Admins
- ❌ **Hidden from**: Brands and Students
- This ensures fair negotiation and prevents bias in sponsorship proposals

### College Organizer Features
- Create detailed event listings with comprehensive information
- Set confidential sponsorship expectations
- Track event performance and sponsorship progress
- Review and manage brand sponsorship proposals
- Monitor ticket sales

### Brand Features
- Browse and filter available events (WITHOUT seeing expected sponsorship amounts)
- Advanced filtering: category, location, date range, minimum attendees, search
- View detailed event information and benefits
- Submit sponsorship proposals with custom amounts and messages
- Track proposal status

### Student Features
- Discover upcoming campus events
- Search and browse event listings
- Purchase event tickets
- View personal ticket history
- Access event details

### Admin Features
- View ALL events with complete data including confidential sponsorship amounts
- Approve or reject event submissions
- Monitor platform-wide statistics
- Track sponsorship fulfillment rates
- Toggle visibility of confidential data

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom ShadCN-style components
- **Form Management**: React Hook Form v7.55.0
- **Validation**: Zod
- **Icons**: Lucide React
- **State Management**: Local Storage (for demo)

## Architecture

```
/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── Navbar.tsx       # Navigation component
│   └── ProtectedRoute.tsx
├── pages/
│   ├── Landing.tsx      # Public landing page
│   ├── Auth.tsx         # Combined login/register
│   ├── organizer/
│   │   ├── OrganizerDashboard.tsx
│   │   ├── CreateEvent.tsx
│   │   └── EventDetail.tsx
│   ├── brand/
│   │   ├── BrandDashboard.tsx
│   │   └── EventDetail.tsx
│   ├── student/
│   │   ├── StudentDashboard.tsx
│   │   └── EventDetail.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── hooks/
│   └── useAuth.ts       # Authentication hook
├── lib/
│   ├── auth.ts          # Auth service
│   └── events.ts        # Event & proposal services
├── types/
│   └── index.ts         # TypeScript definitions
└── App.tsx              # Main app with routing
```

## Getting Started

### Demo Credentials

**Admin:**
- Email: admin@sponzo.com
- Password: any

**College Organizer:**
- Email: organizer@college.edu
- Password: any

**Brand:**
- Email: brand@company.com
- Password: any

**Student:**
- Email: student@college.edu
- Password: any

### Key User Flows

#### Organizer Flow
1. Login/Register as organizer
2. Create event with all details including **confidential** expected sponsorship amount
3. Event goes to admin for approval
4. Once approved, brands can view and submit proposals
5. Review sponsorship proposals
6. Track sponsorship progress toward your private goal

#### Brand Flow
1. Login/Register as brand
2. Browse available events (expected sponsorship amount is HIDDEN)
3. Filter by category, location, attendees, etc.
4. View event details and benefits
5. Submit sponsorship proposal with your offer
6. Track proposal status

#### Student Flow
1. Login/Register as student
2. Discover upcoming events
3. Search and filter events
4. View event details
5. Purchase tickets
6. View ticket history

#### Admin Flow
1. Login as admin
2. View all events with FULL data (including confidential amounts)
3. Approve/reject pending events
4. Monitor platform statistics
5. Track sponsorship fulfillment

## Data Model

### Event
- Basic Info: title, description, category, date, location
- Organizer: organizerId, organizerName, collegeName
- Audience: expectedAttendees, targetAudience[]
- **Confidential**: expectedSponsorshipAmount (hidden from brands)
- Benefits: sponsorship benefits array
- Ticketing: ticketPrice, availableTickets
- Status: pending, approved, rejected, completed

### Sponsorship Proposal
- eventId, brandId, brandName
- proposedAmount
- message
- status: pending, accepted, rejected

### Ticket
- eventId, studentId, studentName
- price, purchaseDate
- status: active, used, cancelled

## Security & Privacy Features

1. **Role-Based Access**: Routes are protected and only accessible to authorized roles
2. **Data Filtering**: Events are filtered based on role before being sent to the UI
3. **Confidential Field Protection**: `expectedSponsorshipAmount` is removed from event objects for brands and students
4. **Admin Visibility**: Full data access for platform oversight
5. **Protected Routes**: Automatic redirection for unauthorized access

## Scalability Considerations

This frontend application is designed for easy backend integration:
- Services (auth, events) are abstracted for easy API replacement
- TypeScript interfaces match expected backend models
- localStorage can be replaced with API calls without UI changes
- Form validation with Zod is backend-ready

## Production Readiness

✅ Complete type safety with TypeScript
✅ Form validation with React Hook Form + Zod
✅ Responsive design with Tailwind CSS
✅ Role-based access control
✅ Protected routes
✅ Error handling
✅ Loading states
✅ Clean component architecture
✅ Reusable UI components
✅ Proper data encapsulation

## Future Enhancements

- Real backend API integration
- Database persistence
- Real-time notifications
- Payment processing for tickets
- Analytics dashboard
- Email notifications
- File upload for event images
- Chat between organizers and brands
- Review/rating system
- Advanced search with Elasticsearch
