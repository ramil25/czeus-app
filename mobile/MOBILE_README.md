# CZEUS Mobile POS App

A React Native mobile version of the CZEUS web POS system, built with Expo and optimized for mobile devices.

## Features

### 📱 Mobile-First Design
- **Tab Navigation**: Easy access to 5 main sections
- **Touch-Optimized UI**: Large touch targets and mobile-friendly interactions
- **Responsive Cards**: Clean card-based layout for all data displays
- **Loading States**: Smooth loading indicators and error handling

### 🏠 Dashboard
- **Real-time Statistics**: Sales, orders, products, and inventory value
- **Inventory Overview**: Available products, low stock alerts, categories
- **Visual Cards**: Color-coded statistics with icons
- **Dynamic Data**: Stats calculated from actual product data

### 📦 Products Management
- **Product Listing**: All products with status, price, and stock
- **Stock Monitoring**: Visual indicators for low stock and out-of-stock items
- **Category Organization**: Products grouped by categories
- **Add/Edit Products**: Form interface for product management
- **Real-time Updates**: Data synced with React Query

### 💰 Sales Tracking
- **Sales Summary**: Total sales, transactions, items sold
- **Transaction History**: Recent sales with details
- **Customer Information**: Customer names and purchase details
- **New Sale Button**: Quick access to create new sales

### 📊 Inventory Management
- **Stock Levels**: Current stock vs minimum stock tracking
- **Low Stock Alerts**: Visual warnings for items running low
- **Inventory Cards**: Detailed view of each product's stock status
- **Update Tracking**: Last updated timestamps

### ⚙️ More Features
- **User Management**: Access to user controls
- **Points Management**: Customer loyalty system
- **POS Setup**: Categories, discounts, staff management
- **Table Management**: Restaurant table controls
- **Reports**: Sales and analytics
- **Settings**: App configuration

## Technical Stack

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe development
- **React Navigation**: Tab and stack navigation

### Data Management
- **React Query (@tanstack/react-query)**: Server state management
- **Supabase**: Database and authentication (ready for integration)
- **Local Demo Data**: Sample data for development/testing

### UI Components
- **Custom Themed Components**: Consistent theming across light/dark modes
- **SF Symbols**: Native iOS icons with fallbacks
- **Responsive Design**: Optimized for various screen sizes
- **Accessibility**: ARIA labels and screen reader support

## Project Structure

```
mobile/czeus/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard screen
│   │   ├── products.tsx       # Products management
│   │   ├── sales.tsx          # Sales tracking
│   │   ├── inventory.tsx      # Inventory management
│   │   ├── explore.tsx        # More features
│   │   └── _layout.tsx        # Tab navigation
│   ├── _layout.tsx            # Root layout with React Query
│   └── +not-found.tsx         # 404 page
├── components/
│   ├── StatCard.tsx           # Statistics display cards
│   ├── TrendCard.tsx          # Trend information cards
│   ├── ThemedText.tsx         # Themed text component
│   ├── ThemedView.tsx         # Themed view component
│   └── ui/
├── hooks/
│   ├── useProducts.ts         # Product data hooks
│   ├── useColorScheme.ts      # Theme detection
│   └── useThemeColor.ts       # Color theming
├── lib/
│   ├── products.ts            # Product data layer
│   └── supabaseClient.ts      # Database client
└── constants/
    └── Colors.ts              # Theme colors
```

## Development Setup

1. **Install Dependencies**
   ```bash
   cd mobile/czeus
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Run on Device/Simulator**
   ```bash
   npm run ios     # iOS simulator
   npm run android # Android emulator
   npm run web     # Web browser
   ```

## Data Integration

The app is designed to work with the same backend as the web version:

### Current State (Demo Mode)
- Uses local sample data for demonstration
- Simulates API calls with delays
- Includes realistic POS data (coffee shop products)

### Production Ready
- Supabase client configured
- React Query for caching and synchronization
- Error handling and offline support
- Real-time updates capability

## Mobile Optimizations

### Performance
- **React Query Caching**: Reduces API calls and improves responsiveness
- **Lazy Loading**: Components load on demand
- **Optimized Renders**: Minimal re-renders with proper state management

### User Experience
- **Pull-to-Refresh**: Refresh data with native gesture
- **Loading States**: Skeleton screens and spinners
- **Error Boundaries**: Graceful error handling
- **Touch Feedback**: Visual feedback for all interactions

### Accessibility
- **Screen Reader Support**: Proper ARIA labels
- **High Contrast**: Support for accessibility settings
- **Large Touch Targets**: Minimum 44px touch areas
- **Keyboard Navigation**: Full keyboard support

## Future Enhancements

### Planned Features
- [ ] Authentication flow
- [ ] Push notifications for low stock
- [ ] Barcode scanning for products
- [ ] Offline mode with sync
- [ ] Sales analytics charts
- [ ] Receipt printing
- [ ] Multi-language support

### Integration Opportunities
- [ ] Payment gateway integration
- [ ] Customer management system
- [ ] Accounting software sync
- [ ] Inventory alerts via SMS/email
- [ ] Staff scheduling integration

This mobile app provides a complete POS system experience optimized for mobile devices, maintaining feature parity with the web version while leveraging mobile-specific capabilities.