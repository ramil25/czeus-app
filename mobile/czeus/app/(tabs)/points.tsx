import { StyleSheet, ScrollView, View, Alert, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useAuth } from '@/contexts/AuthContext';

interface PointReward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  type: 'free_item' | 'discount';
  value?: string;
  available: boolean;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  points: number;
  type: 'earned' | 'redeemed';
}

export default function PointsScreen() {
  const { user, signOut } = useAuth();

  // Mock data - in real app this would come from the backend
  const currentPoints = 2450;
  const pointsThisMonth = 320;

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (signOutError) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
              console.error('Sign out error:', signOutError);
            }
          }
        }
      ]
    );
  };

  const rewards: PointReward[] = [
    {
      id: '1',
      name: 'Free Coffee',
      description: 'Any regular coffee of your choice',
      pointsRequired: 500,
      type: 'free_item',
      available: true
    },
    {
      id: '2',
      name: 'Free Pastry',
      description: 'Any pastry from our selection',
      pointsRequired: 750,
      type: 'free_item',
      available: true
    },
    {
      id: '3',
      name: '20% Off Order',
      description: 'Get 20% off your next order',
      pointsRequired: 1000,
      type: 'discount',
      value: '20%',
      available: true
    },
    {
      id: '4',
      name: 'Free Lunch Combo',
      description: 'Sandwich + drink combo',
      pointsRequired: 1500,
      type: 'free_item',
      available: true
    },
    {
      id: '5',
      name: 'Buy 1 Get 1 Free',
      description: 'Buy any coffee, get one free',
      pointsRequired: 2000,
      type: 'discount',
      value: 'BOGO',
      available: true
    },
    {
      id: '6',
      name: 'Premium Coffee Set',
      description: 'Specialty coffee with premium add-ons',
      pointsRequired: 3000,
      type: 'free_item',
      available: false
    }
  ];

  const recentTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Purchase - Latte & Croissant',
      points: 45,
      type: 'earned'
    },
    {
      id: '2',
      date: '2024-01-14',
      description: 'Redeemed - Free Coffee',
      points: -500,
      type: 'redeemed'
    },
    {
      id: '3',
      date: '2024-01-12',
      description: 'Purchase - Americano',
      points: 30,
      type: 'earned'
    },
    {
      id: '4',
      date: '2024-01-10',
      description: 'Purchase - Tea & Danish',
      points: 35,
      type: 'earned'
    }
  ];

  const redeemReward = (reward: PointReward) => {
    if (!reward.available) {
      Alert.alert('Unavailable', 'This reward is currently not available.');
      return;
    }

    if (currentPoints < reward.pointsRequired) {
      Alert.alert(
        'Insufficient Points', 
        `You need ${reward.pointsRequired - currentPoints} more points to redeem this reward.`
      );
      return;
    }

    Alert.alert(
      'Redeem Reward',
      `Redeem ${reward.name} for ${reward.pointsRequired} points?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Redeem', 
          onPress: () => Alert.alert('Success!', `${reward.name} has been redeemed. Show this to the cashier.`)
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <IconSymbol size={32} name="person.fill" color="#fff" />
            </View>
            <View style={styles.userDetails}>
              <ThemedText type="defaultSemiBold" style={styles.userName}>
                {user ? `${user.first_name} ${user.last_name}`.trim() || 'Customer' : 'Customer'}
              </ThemedText>
              <ThemedText style={styles.userEmail}>
                {user?.email}
              </ThemedText>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
            <IconSymbol size={24} name="arrow.right.square" color="#ef4444" />
          </TouchableOpacity>
        </View>
        <ThemedText type="title" style={styles.title}>Loyalty Points</ThemedText>
        <ThemedText style={styles.subtitle}>Earn points with every purchase</ThemedText>
      </ThemedView>

      <ScrollView style={styles.content}>
        <View style={styles.pointsOverview}>
          <View style={styles.pointsCard}>
            <View style={styles.pointsMain}>
              <IconSymbol size={32} name="star.fill" color="#f59e0b" />
              <View style={styles.pointsInfo}>
                <ThemedText type="title" style={styles.pointsValue}>
                  {currentPoints.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.pointsLabel}>Total Points</ThemedText>
              </View>
            </View>
            <View style={styles.pointsStats}>
              <View style={styles.pointsStat}>
                <ThemedText style={styles.statValue}>+{pointsThisMonth}</ThemedText>
                <ThemedText style={styles.statLabel}>This Month</ThemedText>
              </View>
              <View style={styles.pointsStat}>
                <ThemedText style={styles.statValue}>10</ThemedText>
                <ThemedText style={styles.statLabel}>Per $1</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Available Rewards</ThemedText>
          <View style={styles.rewardsGrid}>
            {rewards.map(reward => (
              <TouchableOpacity
                key={reward.id}
                style={[
                  styles.rewardCard,
                  !reward.available && styles.unavailableReward,
                  currentPoints < reward.pointsRequired && styles.insufficientPoints
                ]}
                onPress={() => redeemReward(reward)}
              >
                <View style={styles.rewardHeader}>
                  <View style={styles.rewardIcon}>
                    <IconSymbol 
                      size={24} 
                      name={reward.type === 'free_item' ? 'gift.fill' : 'tag.fill'} 
                      color={reward.available && currentPoints >= reward.pointsRequired ? '#f59e0b' : '#9ca3af'} 
                    />
                  </View>
                  <View style={styles.pointsBadge}>
                    <ThemedText style={styles.pointsBadgeText}>
                      {reward.pointsRequired}
                    </ThemedText>
                  </View>
                </View>
                
                <ThemedText type="defaultSemiBold" style={styles.rewardName}>
                  {reward.name}
                </ThemedText>
                
                <ThemedText style={styles.rewardDescription}>
                  {reward.description}
                </ThemedText>

                <View style={styles.rewardFooter}>
                  {!reward.available ? (
                    <View style={styles.statusBadge}>
                      <IconSymbol size={12} name="xmark.circle.fill" color="#ef4444" />
                      <ThemedText style={styles.unavailableText}>Unavailable</ThemedText>
                    </View>
                  ) : currentPoints >= reward.pointsRequired ? (
                    <View style={styles.statusBadge}>
                      <IconSymbol size={12} name="checkmark.circle.fill" color="#10b981" />
                      <ThemedText style={styles.availableText}>Available</ThemedText>
                    </View>
                  ) : (
                    <View style={styles.statusBadge}>
                      <IconSymbol size={12} name="clock.fill" color="#f59e0b" />
                      <ThemedText style={styles.pendingText}>
                        {reward.pointsRequired - currentPoints} more needed
                      </ThemedText>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Recent Activity</ThemedText>
          <View style={styles.transactionsList}>
            {recentTransactions.map(transaction => (
              <View key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionIcon}>
                  <IconSymbol 
                    size={20} 
                    name={transaction.type === 'earned' ? 'plus.circle.fill' : 'minus.circle.fill'} 
                    color={transaction.type === 'earned' ? '#10b981' : '#ef4444'} 
                  />
                </View>
                <View style={styles.transactionInfo}>
                  <ThemedText type="defaultSemiBold">{transaction.description}</ThemedText>
                  <ThemedText style={styles.transactionDate}>
                    {new Date(transaction.date).toLocaleDateString()}
                  </ThemedText>
                </View>
                <ThemedText 
                  style={[
                    styles.transactionPoints,
                    transaction.type === 'earned' ? styles.pointsEarned : styles.pointsRedeemed
                  ]}
                >
                  {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2362c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  logoutButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
  },
  pointsOverview: {
    padding: 20,
  },
  pointsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pointsMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  pointsInfo: {
    marginLeft: 16,
    flex: 1,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  pointsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 20,
  },
  pointsStat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  rewardsGrid: {
    gap: 16,
  },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  unavailableReward: {
    opacity: 0.6,
  },
  insufficientPoints: {
    opacity: 0.7,
  },
  rewardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  rewardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsBadge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pointsBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  rewardName: {
    fontSize: 16,
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  rewardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#10b981',
    fontWeight: '500',
  },
  unavailableText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '500',
  },
  pendingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '500',
  },
  transactionsList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  transactionPoints: {
    fontSize: 16,
    fontWeight: '600',
  },
  pointsEarned: {
    color: '#10b981',
  },
  pointsRedeemed: {
    color: '#ef4444',
  },
});