# Points Management Database Integration

This document describes the database integration for the Points Management feature.

## Database Setup

### 1. Supabase Configuration

Make sure your Supabase environment variables are set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Schema

Run the SQL commands in `database-schema.sql` in your Supabase SQL editor to create the customers table:

```sql
-- Creates the customers table with proper indexes and triggers
-- See database-schema.sql for the complete schema
```

## Features

### Customer Management
- **View Customers**: Display all customers with their points in a paginated table
- **Search**: Real-time search by customer name or email with debouncing
- **Add Points**: Add points to customers through a modal interface
- **Loading States**: Proper loading indicators for async operations
- **Error Handling**: User-friendly error messages with toast notifications

### Database Operations
- **getCustomers()**: Fetch all customers ordered by name
- **searchCustomers(searchTerm)**: Search customers by name or email
- **addPointsToCustomer({id, pointsToAdd})**: Add points to a specific customer
- **initializeSampleData()**: Initialize the table with sample data if empty

## Implementation Details

### Service Layer
The `customerService.ts` provides a clean API layer for database operations:
- Uses Supabase client for database interactions
- Implements proper error handling and logging
- Provides TypeScript interfaces for type safety

### React Integration
The Points Management page (`page.tsx`) integrates with the service layer:
- Uses React hooks for state management
- Implements search debouncing (300ms delay)
- Provides real-time UI updates
- Shows loading states and error messages

### Data Flow
1. Component mounts → Load customers from database
2. User searches → Debounced search query to database
3. User adds points → Update database → Update local state
4. All operations include proper error handling and user feedback

## Security

- Row Level Security (RLS) is enabled on the customers table
- Only authenticated users can access customer data
- All database operations are validated on the server side

## Future Enhancements

Potential improvements for the points management system:
- Add customer creation/editing functionality
- Implement points history/audit trail
- Add bulk operations for multiple customers
- Include customer analytics and reporting
- Add export functionality for customer data