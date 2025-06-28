import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Target, Plus, TrendingUp, Calendar, DollarSign, Chrome as Home, Car, GraduationCap, Plane, Heart, PiggyBank, CircleCheck as CheckCircle, Clock, CircleAlert as AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';

interface Goal {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: any;
  color: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'ahead';
}

export default function Goals() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('active');

  const goals: Goal[] = [
    {
      id: 1,
      title: 'Emergency Fund',
      targetAmount: 100000,
      currentAmount: 68000,
      deadline: '2024-12-31',
      category: 'Safety',
      icon: PiggyBank,
      color: Colors.success,
      priority: 'high',
      status: 'on-track',
    },
    {
      id: 2,
      title: 'Home Down Payment',
      targetAmount: 500000,
      currentAmount: 180000,
      deadline: '2025-06-30',
      category: 'Housing',
      icon: Home,
      color: Colors.primary,
      priority: 'high',
      status: 'behind',
    },
    {
      id: 3,
      title: 'New Car',
      targetAmount: 300000,
      currentAmount: 250000,
      deadline: '2024-08-15',
      category: 'Transportation',
      icon: Car,
      color: Colors.secondary,
      priority: 'medium',
      status: 'ahead',
    },
    {
      id: 4,
      title: 'Education Fund',
      targetAmount: 200000,
      currentAmount: 45000,
      deadline: '2026-04-30',
      category: 'Education',
      icon: GraduationCap,
      color: Colors.accent,
      priority: 'medium',
      status: 'on-track',
    },
    {
      id: 5,
      title: 'Vacation to Europe',
      targetAmount: 150000,
      currentAmount: 30000,
      deadline: '2024-10-01',
      category: 'Travel',
      icon: Plane,
      color: Colors.warning,
      priority: 'low',
      status: 'behind',
    },
  ];

  const completedGoals = [
    {
      id: 6,
      title: 'Wedding Fund',
      targetAmount: 400000,
      currentAmount: 400000,
      completedDate: '2024-02-14',
      category: 'Lifestyle',
      icon: Heart,
      color: Colors.error,
    },
  ];

  const savingsTips = [
    'Set up automatic transfers to your savings goals',
    'Review and adjust your goals quarterly',
    'Use the 50/30/20 budgeting rule',
    'Consider high-yield savings accounts',
    'Track your progress weekly',
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return Colors.success;
      case 'behind':
        return Colors.error;
      default:
        return Colors.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return TrendingUp;
      case 'behind':
        return AlertCircle;
      default:
        return Clock;
    }
  };

  const renderGoalCard = (goal: Goal) => {
    const progress = getProgressPercentage(goal.currentAmount, goal.targetAmount);
    const StatusIcon = getStatusIcon(goal.status);

    return (
      <TouchableOpacity key={goal.id} style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
            <goal.icon size={24} color={Colors.white} />
          </View>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={styles.goalCategory}>{goal.category}</Text>
          </View>
          <View style={styles.goalStatus}>
            <StatusIcon size={16} color={getStatusColor(goal.status)} />
          </View>
        </View>

        <View style={styles.goalProgress}>
          <View style={styles.progressHeader}>
            <Text style={styles.currentAmount}>
              {formatCurrency(goal.currentAmount)}
            </Text>
            <Text style={styles.targetAmount}>
              of {formatCurrency(goal.targetAmount)}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${progress}%`,
                  backgroundColor: goal.color 
                }
              ]} 
            />
          </View>
          <View style={styles.progressFooter}>
            <Text style={styles.progressPercentage}>{progress.toFixed(0)}% complete</Text>
            <Text style={styles.deadline}>By {goal.deadline}</Text>
          </View>
        </View>

        <View style={styles.goalActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={16} color={Colors.gray600} />
            <Text style={styles.actionText}>Schedule</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCompletedGoal = (goal: any) => (
    <TouchableOpacity key={goal.id} style={styles.completedGoalCard}>
      <View style={styles.goalHeader}>
        <View style={[styles.goalIcon, { backgroundColor: goal.color }]}>
          <goal.icon size={24} color={Colors.white} />
        </View>
        <View style={styles.goalInfo}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalCategory}>{goal.category}</Text>
        </View>
        <CheckCircle size={24} color={Colors.success} />
      </View>
      <View style={styles.completedInfo}>
        <Text style={styles.completedAmount}>
          {formatCurrency(goal.targetAmount)} achieved
        </Text>
        <Text style={styles.completedDate}>Completed on {goal.completedDate}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderAutoPlanner = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Goal-Based Auto Planner</Text>
      <View style={styles.plannerCard}>
        <View style={styles.plannerHeader}>
          <Target size={32} color={Colors.primary} />
          <View style={styles.plannerInfo}>
            <Text style={styles.plannerTitle}>Smart Goal Planning</Text>
            <Text style={styles.plannerDescription}>
              Let AI analyze your income and expenses to create personalized saving plans
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.plannerButton}>
          <Text style={styles.plannerButtonText}>Create New Goal</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSavingsTips = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Savings Tips</Text>
      {savingsTips.map((tip, index) => (
        <View key={index} style={styles.tipCard}>
          <View style={styles.tipNumber}>
            <Text style={styles.tipNumberText}>{index + 1}</Text>
          </View>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Financial Goals</Text>
        <Text style={styles.headerSubtitle}>Track and achieve your dreams</Text>
        
        {/* Overview Stats */}
        <View style={styles.overviewStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{goals.length}</Text>
            <Text style={styles.statLabel}>Active Goals</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{completedGoals.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>₹10.9L</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'planner' && styles.activeTab]}
          onPress={() => setActiveTab('planner')}
        >
          <Text style={[styles.tabText, activeTab === 'planner' && styles.activeTabText]}>
            Auto Planner
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === 'active' && (
          <View style={styles.content}>
            {goals.map(renderGoalCard)}
            {renderSavingsTips()}
          </View>
        )}

        {activeTab === 'completed' && (
          <View style={styles.content}>
            {completedGoals.map(renderCompletedGoal)}
            {completedGoals.length === 0 && (
              <View style={styles.emptyState}>
                <Target size={48} color={Colors.gray400} />
                <Text style={styles.emptyTitle}>No completed goals yet</Text>
                <Text style={styles.emptyDescription}>
                  Keep working towards your active goals to see them here
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'planner' && (
          <View style={styles.content}>
            {renderAutoPlanner()}
          </View>
        )}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
    marginBottom: 20,
  },
  overviewStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.gray600,
  },
  activeTabText: {
    color: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
  },
  goalCategory: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 2,
  },
  goalStatus: {
    padding: 8,
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
  },
  targetAmount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray200,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercentage: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray700,
  },
  deadline: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
  },
  goalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.gray100,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray700,
  },
  completedGoalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    opacity: 0.8,
  },
  completedInfo: {
    marginTop: 12,
  },
  completedAmount: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.success,
  },
  completedDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  plannerCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  plannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  plannerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  plannerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 8,
  },
  plannerDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    lineHeight: 20,
  },
  plannerButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  plannerButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipNumberText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});