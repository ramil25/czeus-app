/**
 * Simple syntax check for the updated points transformation logic
 */

function transformProfileData(data) {
  if (!data) {
    throw new Error('Customer points not found');
  }

  // Transform the data to include customer information from the joined profile
  const profile = Array.isArray(data.profiles) ? data.profiles[0] : data.profiles;
  return {
    id: data.id,
    profile_id: data.profile_id,
    points: Number(data.points),
    created_at: data.created_at,
    updated_at: data.updated_at,
    customer_name: profile ? `${profile.first_name} ${profile.last_name}`.trim() : '',
    customer_email: profile?.email ?? '',
    customer_phone: profile?.phone ?? null,
  };
}

// Test the function
const mockData = {
  id: 1,
  profile_id: 123,
  points: 500,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2024-01-02T00:00:00.000Z',
  profiles: {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890'
  }
};

try {
  const result = transformProfileData(mockData);
  console.log('✅ Syntax check passed');
  console.log('✅ Function executes correctly');
  console.log('Customer name:', result.customer_name);
  console.log('Customer email:', result.customer_email);
  
  // Verify it returns the expected data
  const hasValidName = result.customer_name === 'John Doe';
  const hasValidEmail = result.customer_email === 'john.doe@example.com';
  const hasValidPoints = result.points === 500;
  
  if (hasValidName && hasValidEmail && hasValidPoints) {
    console.log('✅ All transformation logic working correctly');
  } else {
    console.log('❌ Transformation logic has issues');
  }
} catch (error) {
  console.error('❌ Function failed:', error);
}