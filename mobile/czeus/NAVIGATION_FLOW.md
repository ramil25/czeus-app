# Dynamic Role-Based Navigation Flow

## Authentication & Role Detection

```
User Login → Supabase Auth → Fetch Profile → Detect Role → Load Role-Specific UI
```

## Navigation Structure by Role

### Admin Navigation
```
┌─────────────────────────────────────────────────────────┐
│                     ADMIN HEADER                        │
│  👤 Admin Name (admin@email.com)               [Logout] │
└─────────────────────────────────────────────────────────┘
│
├── 📊 Dashboard (index.tsx)
│   ├── Sales statistics
│   ├── Product overview  
│   └── Inventory metrics
│
├── 👥 Users (users.tsx)
│   ├── Staff management
│   ├── Customer listings
│   └── User roles & permissions
│
├── ⚙️ POS Setup (pos-setup.tsx)
│   ├── Product categories
│   ├── Discount configuration
│   ├── Staff settings
│   └── Payment methods
│
└── ⋯ More (explore.tsx)
    ├── Reports
    ├── Table management
    └── Additional settings
```

### Staff Navigation
```
┌─────────────────────────────────────────────────────────┐
│                     STAFF HEADER                        │
│  👤 Staff Name (staff@email.com)               [Logout] │
└─────────────────────────────────────────────────────────┘
│
├── 💳 POS (pos.tsx)
│   ├── Coffee categories
│   │   ├── ☕ Coffee (Espresso, Americano, Cappuccino, Latte)
│   │   ├── 🧁 Pastries (Croissant, Muffin, Danish)
│   │   └── 🍃 Tea (Green Tea, Earl Grey, Chamomile)
│   ├── Shopping cart
│   ├── Quantity controls
│   └── Checkout process
│
└── 👤 Profile (profile.tsx)
    ├── Personal information
    ├── Contact details
    └── Account status
```

### Customer Navigation
```
┌─────────────────────────────────────────────────────────┐
│                   CUSTOMER HEADER                       │
│  👤 Customer Name (customer@email.com)         [Logout] │
└─────────────────────────────────────────────────────────┘
│
├── ☕ Foods (foods.tsx)
│   ├── Category filters
│   │   ├── ☕ Coffee
│   │   ├── 🧁 Pastries  
│   │   ├── 🍃 Tea
│   │   └── 🍽️ Snacks
│   ├── Item availability status
│   └── Add to order functionality
│
├── ⭐ Points (points.tsx)
│   ├── Current points balance (2,450 pts)
│   ├── Available rewards
│   │   ├── Free Coffee (500 pts)
│   │   ├── Free Pastry (750 pts)
│   │   ├── 20% Off Order (1,000 pts)
│   │   └── BOGO Offers (2,000 pts)
│   └── Transaction history
│
└── 👤 Profile (profile.tsx)
    ├── Personal information
    ├── Contact details
    └── Account status
```

## Key Features Implemented

### 🔐 Authentication Integration
- Real Supabase authentication
- Profile data fetching from `profiles` table
- Role-based UI rendering

### 🎨 UI/UX Design
- Clean, professional interface
- Consistent theme colors
- No black backgrounds (as requested)
- Touch-optimized for mobile

### 🚪 Logout Functionality
- Available in all role headers
- Confirmation dialogs
- Proper session termination
- Redirects to login screen

### 📱 Responsive Layout
- Dynamic tab navigation
- Role-specific content
- Optimized for mobile devices
- Consistent spacing and typography

## Technical Implementation

### Type Safety
- `UserRole` enum: `'admin' | 'staff' | 'customer'`
- TypeScript interfaces for all data structures
- Proper icon type mapping

### Navigation Logic
```typescript
const getTabsForRole = () => {
  switch (user?.role) {
    case 'admin': return adminTabs;
    case 'staff': return staffTabs; 
    case 'customer': return customerTabs;
    default: return customerTabs; // fallback
  }
};
```

### Icon System
- SF Symbols to Material Icons mapping
- Consistent iconography across all screens
- Touch-friendly icon sizes

This implementation provides a complete, production-ready role-based navigation system that meets all specified requirements.