# Testing Guide: Basket & Orders Feature

## Quick Start

### Prerequisites
1. Node.js installed
2. Expo CLI installed (`npm install -g expo-cli`)
3. Supabase account with credentials in `.env` file
4. Mobile device or emulator

### Installation
```bash
cd mobile/czeus
npm install
```

### Run Tests
```bash
# Run unit tests
node test/test-basket-orders.js

# Run linter
npm run lint
```

### Run App
```bash
# Start development server
npm run dev

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Manual Testing Checklist

### Test 1: Add Items to Basket
**Scenario**: Customer adds items from menu

**Steps**:
1. Login as a customer
2. Navigate to "Foods" tab
3. Select a category (Coffee, Pastries, Tea)
4. Tap on an item
5. Verify "Added to Basket" alert appears

**Expected Result**:
- ✓ Item is added to basket
- ✓ Alert shows item name
- ✓ Basket persists if app is closed and reopened

**Test Data**:
- Item: Espresso (₱2.50)
- Expected points: 25 (price × 10)

---

### Test 2: View Basket
**Scenario**: Customer views basket items

**Steps**:
1. Add 2-3 items to basket
2. Navigate to "Basket" tab
3. Verify all items are displayed

**Expected Result**:
- ✓ All added items visible
- ✓ Images displayed correctly
- ✓ Prices shown accurately
- ✓ Quantities correct
- ✓ Total calculated correctly

---

### Test 3: Update Quantity
**Scenario**: Customer changes item quantity

**Steps**:
1. In basket, tap + button on an item
2. Observe quantity increase
3. Tap - button
4. Observe quantity decrease
5. Tap - when quantity is 1

**Expected Result**:
- ✓ + increases quantity by 1
- ✓ - decreases quantity by 1
- ✓ Item removed when quantity reaches 0
- ✓ Subtotal updates correctly

---

### Test 4: Select Items
**Scenario**: Customer selects items for checkout

**Steps**:
1. Add 3+ items to basket
2. Tap checkbox on first item
3. Tap "Select All" button
4. Tap "Deselect All" button
5. Manually select 2 items

**Expected Result**:
- ✓ Individual checkboxes toggle correctly
- ✓ "Select All" selects all items
- ✓ "Deselect All" clears selection
- ✓ Selected count updates
- ✓ Total shows only selected items

---

### Test 5: Delete Item
**Scenario**: Customer removes item from basket

**Steps**:
1. Add item to basket
2. Navigate to Basket tab
3. Tap trash icon on item
4. Confirm deletion in alert

**Expected Result**:
- ✓ Confirmation alert appears
- ✓ Item removed from basket
- ✓ Total recalculated
- ✓ Empty state shown if last item

---

### Test 6: Checkout - Success
**Scenario**: Customer successfully checks out

**Steps**:
1. Add 2-3 items to basket
2. Select items with checkboxes
3. Tap "Checkout" button
4. Confirm in alert dialog

**Expected Result**:
- ✓ Confirmation dialog shows total
- ✓ Loading indicator during processing
- ✓ Success message appears
- ✓ Selected items removed from basket
- ✓ Remaining items stay in basket

**Database Verification**:
```sql
-- Check order was created
SELECT * FROM orders 
WHERE customer_id = [your_profile_id] 
ORDER BY created_at DESC LIMIT 1;

-- Check order items
SELECT po.*, p.product_name 
FROM product_order po
JOIN products p ON p.id = po.product_id
WHERE po.order_id = [order_id];
```

---

### Test 7: Checkout - No Selection
**Scenario**: Customer tries to checkout without selecting items

**Steps**:
1. Add items to basket
2. Don't select any items
3. Tap "Checkout" button

**Expected Result**:
- ✓ Alert: "No Items Selected"
- ✓ Checkout does not proceed

---

### Test 8: Checkout - Not Logged In
**Scenario**: User tries to checkout without login

**Steps**:
1. Sign out
2. Add items to basket (if possible)
3. Navigate to basket
4. Try to checkout

**Expected Result**:
- ✓ Alert: "You must be logged in to checkout"
- ✓ Order not created

---

### Test 9: Basket Persistence
**Scenario**: Basket items persist across app restarts

**Steps**:
1. Add 2-3 items to basket
2. Close app completely
3. Reopen app
4. Navigate to basket

**Expected Result**:
- ✓ All items still in basket
- ✓ Quantities preserved
- ✓ Selection state reset (expected)

---

### Test 10: Empty Basket State
**Scenario**: Display empty basket message

**Steps**:
1. Ensure basket is empty
2. Navigate to Basket tab

**Expected Result**:
- ✓ Basket icon displayed
- ✓ "Your basket is empty" message
- ✓ Helpful subtext shown
- ✓ No error states

---

## Database Testing

### Check Order Structure
```sql
-- View order with items
SELECT 
  o.id as order_id,
  o.status,
  o.payment_status,
  o.created_at,
  po.product_id,
  po.qty,
  po.price,
  po.points,
  p.product_name
FROM orders o
JOIN product_order po ON po.order_id = o.id
JOIN products p ON p.id = po.product_id
WHERE o.customer_id = [your_profile_id]
ORDER BY o.created_at DESC;
```

### Verify Foreign Keys
```sql
-- Check customer exists
SELECT id, email, first_name, last_name 
FROM profiles 
WHERE id = [customer_id];

-- Check products exist
SELECT id, product_name, price 
FROM products 
WHERE id IN ([product_ids]);
```

### Check Constraints
```sql
-- Orders should have valid status
SELECT DISTINCT status FROM orders;
-- Expected: pending, completed, cancelled

-- Orders should have valid payment_status
SELECT DISTINCT payment_status FROM orders;
-- Expected: unpaid, paid, refunded
```

## Error Testing

### Test Error Handling

1. **Network Error**
   - Turn off WiFi
   - Try to checkout
   - Verify error message

2. **Invalid Customer**
   - Mock user.profileId = 0
   - Try to checkout
   - Verify error handling

3. **Invalid Product**
   - Add item with non-existent product_id
   - Try to checkout
   - Verify error handling

## Performance Testing

### Load Testing
1. Add 20+ items to basket
2. Check UI responsiveness
3. Test checkout with many items

### Expected Performance:
- ✓ Basket loads < 1 second
- ✓ Add item < 200ms
- ✓ Checkout < 3 seconds
- ✓ No UI freezing

## Edge Cases

### Test Edge Cases

1. **Very Large Quantity**
   - Set quantity to 999
   - Verify total calculates correctly

2. **Decimal Prices**
   - Items with prices like ₱2.99
   - Verify rounding correct

3. **Special Characters**
   - Product names with emojis or special chars
   - Verify display correct

4. **Long Product Names**
   - Very long product names
   - Verify text wrapping

5. **Multiple Fast Taps**
   - Rapidly tap + button
   - Verify quantity updates correctly

## Test Accounts

### Create Test Accounts

**Customer Account**:
```
Email: customer@test.com
Password: Test123!@#
Role: customer
```

**Test Products**:
```
1. Espresso - ₱2.50
2. Americano - ₱3.00
3. Cappuccino - ₱3.50
4. Latte - ₱4.00
```

## Troubleshooting

### Common Issues

**Issue**: Basket not persisting
- Check AsyncStorage permissions
- Verify BasketProvider wrapping

**Issue**: Orders not creating
- Check Supabase credentials
- Verify user.profileId exists
- Check database permissions

**Issue**: Type errors
- Run `npm install`
- Check profileId in auth.ts

**Issue**: Images not loading
- Check image_url in products table
- Verify network connectivity

## Test Results Template

```
Test Date: ___________
Tester: ___________
Device: ___________
OS Version: ___________

| Test # | Description | Pass/Fail | Notes |
|--------|-------------|-----------|-------|
| 1      | Add Items   |           |       |
| 2      | View Basket |           |       |
| 3      | Update Qty  |           |       |
| 4      | Select Items|           |       |
| 5      | Delete Item |           |       |
| 6      | Checkout OK |           |       |
| 7      | No Select   |           |       |
| 8      | Not Logged  |           |       |
| 9      | Persistence |           |       |
| 10     | Empty State |           |       |

Overall Result: PASS / FAIL
```

## Automated Testing (Future)

### Unit Tests
```bash
# Add Jest/React Native Testing Library
npm install --save-dev @testing-library/react-native jest

# Run tests
npm test
```

### E2E Tests
```bash
# Add Detox
npm install --save-dev detox

# Run E2E tests
detox test
```

## Support

If tests fail:
1. Check BASKET_ORDERS_IMPLEMENTATION.md
2. Review error messages in console
3. Verify database permissions
4. Check environment variables
5. Run lint: `npm run lint`
