# SPONZO Testing Guide

## Critical Data Constraint Verification

The most important feature to test is the **confidential sponsorship amount** visibility rule.

### Test Case 1: Organizer Can See Expected Sponsorship Amount

**Steps:**
1. Login as organizer (organizer@college.edu)
2. Navigate to Dashboard → View existing events
3. Click on any event
4. **Expected Result**: You can see "Expected Sponsorship Amount" field in your event details
5. Go to "Create Event"
6. Fill out the form including "Expected Sponsorship Amount ($)"
7. **Expected Result**: You see a blue notice stating this amount is confidential and hidden from brands
8. Submit the event
9. **Expected Result**: Event created successfully with the confidential amount visible to you

### Test Case 2: Brand CANNOT See Expected Sponsorship Amount

**Steps:**
1. Logout and login as brand (brand@company.com)
2. Browse events on the dashboard
3. Click on any event to view details
4. **Expected Result**: Event details show date, location, attendees, benefits, etc., BUT NO "Expected Sponsorship Amount" field
5. Submit a sponsorship proposal with any amount you choose
6. **Expected Result**: You can propose any amount without knowing the organizer's expectations

### Test Case 3: Student CANNOT See Expected Sponsorship Amount

**Steps:**
1. Logout and login as student (student@college.edu)
2. Browse events
3. Click on any event
4. **Expected Result**: Event details show all public information BUT NO sponsorship-related financial data
5. Focus is on ticket price and event details

### Test Case 4: Admin CAN See Expected Sponsorship Amount

**Steps:**
1. Logout and login as admin (admin@sponzo.com)
2. View Admin Dashboard
3. **Expected Result**: All events display with FULL data including "Expected Sponsorship Amount" in a red-highlighted confidential section
4. Toggle "Show/Hide Confidential" button
5. **Expected Result**: Confidential sections appear/disappear but are clearly marked when visible

## Code-Level Verification

### In `/lib/events.ts`

```typescript
// For Brands - removes expectedSponsorshipAmount
getEventsForBrands: (filters?: EventFilters): Omit<Event, 'expectedSponsorshipAmount'>[] => {
  let events = eventService.getAllEvents().filter(e => e.status === 'approved');
  
  // Remove expectedSponsorshipAmount field for brands
  return events.map(({ expectedSponsorshipAmount, ...event }) => event);
}

// For Students - removes expectedSponsorshipAmount
getEventsForStudents: (filters?: EventFilters): Omit<Event, 'expectedSponsorshipAmount'>[] => {
  let events = eventService.getAllEvents().filter(e => e.status === 'approved');
  
  // Remove expectedSponsorshipAmount field for students
  return events.map(({ expectedSponsorshipAmount, ...event }) => event);
}

// For Admin - returns ALL data
getAllEvents: (): Event[] => {
  const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
  return eventsJson ? JSON.parse(eventsJson) : INITIAL_EVENTS;
}
```

### In Component Files

**Brand Event Detail (`/pages/brand/EventDetail.tsx`):**
```typescript
const eventData = eventService.getEventById(id);
if (eventData) {
  // Remove expectedSponsorshipAmount for brands
  const { expectedSponsorshipAmount, ...eventForBrand } = eventData;
  setEvent(eventForBrand);
}
```

**Student Event Detail (`/pages/student/EventDetail.tsx`):**
```typescript
const eventData = eventService.getEventById(id);
if (eventData) {
  // Remove expectedSponsorshipAmount for students
  const { expectedSponsorshipAmount, ...eventForStudent } = eventData;
  setEvent(eventForStudent);
}
```

**Admin Dashboard (`/pages/admin/AdminDashboard.tsx`):**
```typescript
// Admin can see ALL event data including expectedSponsorshipAmount
const allEvents = eventService.getAllEvents();
setEvents(allEvents);

// In the UI:
{showConfidential && (
  <div className="bg-red-50 border border-red-200 rounded-md p-3">
    <Badge variant="destructive">CONFIDENTIAL</Badge>
    <span>Admin Only - Hidden from Brands</span>
    {/* Shows expectedSponsorshipAmount and related metrics */}
  </div>
)}
```

## UI/UX Testing

### Organizer UI
- ✅ Event creation form includes "Expected Sponsorship Amount" field
- ✅ Clear warning that this amount is confidential
- ✅ Dashboard shows sponsorship tracking with expected vs. received
- ✅ Progress bar showing how close to sponsorship goal

### Brand UI
- ✅ NO mention of "expected sponsorship" anywhere
- ✅ Can propose any amount freely
- ✅ Focus is on event benefits and reach
- ✅ Clean event cards without financial details

### Student UI
- ✅ NO sponsorship information visible
- ✅ Focus on event details, tickets, and attendance
- ✅ Simple, clean interface for event discovery

### Admin UI
- ✅ Confidential data clearly marked in RED
- ✅ Toggle to show/hide confidential information
- ✅ Shows "Expected Sponsorship Amount" for all events
- ✅ Calculates gaps and fulfillment percentages

## Role-Based Access Testing

### Test Protected Routes

**As Unauthenticated User:**
- Navigate to `/dashboard/organizer` → Redirects to `/auth`
- Navigate to `/dashboard/brand` → Redirects to `/auth`
- Navigate to `/dashboard/student` → Redirects to `/auth`
- Navigate to `/dashboard/admin` → Redirects to `/auth`

**As Organizer:**
- Can access `/dashboard/organizer` ✅
- Navigate to `/dashboard/brand` → Redirects to `/dashboard/organizer`
- Navigate to `/dashboard/student` → Redirects to `/dashboard/organizer`
- Navigate to `/dashboard/admin` → Redirects to `/dashboard/organizer`

**As Brand:**
- Navigate to `/dashboard/organizer` → Redirects to `/dashboard/brand`
- Can access `/dashboard/brand` ✅
- Navigate to `/dashboard/student` → Redirects to `/dashboard/brand`
- Navigate to `/dashboard/admin` → Redirects to `/dashboard/brand`

**As Student:**
- Navigate to `/dashboard/organizer` → Redirects to `/dashboard/student`
- Navigate to `/dashboard/brand` → Redirects to `/dashboard/student`
- Can access `/dashboard/student` ✅
- Navigate to `/dashboard/admin` → Redirects to `/dashboard/student`

**As Admin:**
- Can access all routes ✅
- Primary route is `/dashboard/admin`

## Form Validation Testing

### Event Creation (Organizer)

**Required Fields:**
- Title (min 5 chars)
- Description (min 20 chars)
- Category
- Date
- Location (min 3 chars)
- Expected Attendees (min 10)
- Expected Sponsorship Amount (min $100) ← **CONFIDENTIAL**
- Target Audience
- Benefits
- Ticket Price (min $0)
- Available Tickets (min 1)

**Test Invalid Inputs:**
- Empty title → Shows error
- Short description → Shows error
- Expected Attendees < 10 → Shows error
- Expected Sponsorship < $100 → Shows error
- All validations use Zod schema

### Registration (All Roles)

**Required Fields:**
- Full Name (min 2 chars)
- Email (valid format)
- Password (min 6 chars)
- Confirm Password (must match)
- Role selection
- Role-specific fields (organization name, college name)

**Test Invalid Inputs:**
- Mismatched passwords → Shows error
- Invalid email → Shows error
- Short password → Shows error

## Browser Testing Checklist

- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop & Mobile)
- [ ] Mobile responsive design
- [ ] Tablet view
- [ ] Different screen sizes

## Performance Testing

- [ ] Page load times
- [ ] Navigation speed
- [ ] Form submission responsiveness
- [ ] Search/filter performance with many events

## Accessibility Testing

- [ ] Keyboard navigation
- [ ] Screen reader compatibility
- [ ] Color contrast
- [ ] Focus indicators
- [ ] Form labels and ARIA attributes
