import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Target, TrendingUp, QrCode, MessageCircle, Search, TriangleAlert as AlertTriangle, Shield, BookOpen, Play, ChevronRight, Users, DollarSign, Award, Lock, Eye, Zap, Globe, CircleCheck as CheckCircle, ArrowRight, Star, ChartBar as BarChart3 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';
import { useAppContext } from '@/context/AppContext';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Dashboard() {
  const { t } = useLanguage();
  const { userStats, goals, tutorials } = useAppContext();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const stats = [
    { 
      label: 'Savings Goal', 
      value: `₹${(goals.reduce((sum, goal) => sum + goal.currentAmount, 0) / 1000).toFixed(0)}K`, 
      progress: goals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / goals.length, 
      icon: Target,
      color: Colors.success,
      onPress: () => router.push('/(tabs)/goals')
    },
    { 
      label: 'Fraud Blocked', 
      value: `${userStats.fraudBlocked}`, 
      progress: 1, 
      icon: Shield,
      color: Colors.error,
      onPress: () => router.push('/(tabs)/protect')
    },
    { 
      label: 'Learning Score', 
      value: `${userStats.learningScore}%`, 
      progress: userStats.learningScore / 100, 
      icon: BookOpen,
      color: Colors.secondary,
      onPress: () => router.push('/(tabs)/learn')
    },
    { 
      label: 'Security Level', 
      value: userStats.securityLevel, 
      progress: 0.9, 
      icon: Lock,
      color: Colors.accent,
      onPress: () => router.push('/(tabs)/protect')
    },
  ];

  const quickActions = [
    { 
      label: 'Scan QR Code', 
      icon: QrCode, 
      gradient: [Colors.gradientStart, Colors.secondary],
      onPress: () => router.push('/qr-scanner')
    },
    { 
      label: 'AI Coach', 
      icon: MessageCircle, 
      gradient: [Colors.accent, Colors.warning],
      onPress: () => router.push('/ai-coach')
    },
    { 
      label: 'Check Breach', 
      icon: Search, 
      gradient: [Colors.error, Colors.errorLight],
      onPress: () => router.push('/breach-checker')
    },
    { 
      label: 'Escape Game', 
      icon: Play, 
      gradient: [Colors.success, Colors.successLight],
      onPress: () => router.push('/escape-game')
    },
  ];

  const globalStats = [
    { label: 'Users Protected', value: '2.5M+', icon: Users, color: Colors.secondary },
    { label: 'Fraud Prevented', value: '₹850Cr+', icon: Shield, color: Colors.success },
    { label: 'Learning Hours', value: '1.2M+', icon: BookOpen, color: Colors.accent },
    { label: 'Security Score', value: '98.5%', icon: Award, color: Colors.error },
  ];

  const features = [
    {
      title: 'AI-Powered Protection',
      description: 'Advanced machine learning algorithms detect and prevent fraud in real-time',
      icon: Zap,
      color: Colors.secondary,
    },
    {
      title: 'Multilingual Support',
      description: 'Available in Hindi, English, and Punjabi for better accessibility',
      icon: Globe,
      color: Colors.accent,
    },
    {
      title: 'Gamified Learning',
      description: 'Interactive games and simulations make financial education engaging',
      icon: Play,
      color: Colors.success,
    },
    {
      title: 'Real-time Monitoring',
      description: 'Continuous surveillance of your digital footprint and financial accounts',
      icon: Eye,
      color: Colors.error,
    },
  ];

  const recentAlerts = [
    {
      type: 'success',
      title: 'Fraud Attempt Blocked',
      message: 'Suspicious UPI transaction of ₹15,000 was automatically blocked',
      time: '2 hours ago',
      onPress: () => router.push('/(tabs)/protect')
    },
    {
      type: 'info',
      title: 'New Security Feature',
      message: 'Dark web monitoring is now active for your email addresses',
      time: '1 day ago',
      onPress: () => router.push('/breach-checker')
    },
    {
      type: 'warning',
      title: 'Goal Update',
      message: 'You\'re 85% closer to your emergency fund goal!',
      time: '2 days ago',
      onPress: () => router.push('/(tabs)/goals')
    },
  ];

  const renderHeroSection = () => (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight, Colors.secondary]}
      style={styles.heroSection}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Animated.View 
        style={[
          styles.heroContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.heroHeader}>
          <View style={styles.heroText}>
            <Text style={styles.heroGreeting}>Good Morning</Text>
            <Text style={styles.heroTitle}>Stay Financially Secure</Text>
            <Text style={styles.heroSubtitle}>
              Your personal AI-powered financial security companion
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/(tabs)/protect')}
          >
            <Bell size={24} color={Colors.white} />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View 
          style={[
            styles.heroStatsContainer,
            { transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>₹850Cr+</Text>
            <Text style={styles.heroStatLabel}>Fraud Prevented</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>2.5M+</Text>
            <Text style={styles.heroStatLabel}>Users Protected</Text>
          </View>
          <View style={styles.heroStat}>
            <Text style={styles.heroStatNumber}>98.5%</Text>
            <Text style={styles.heroStatLabel}>Success Rate</Text>
          </View>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  );

  const renderStatsCards = () => (
    <View style={styles.statsContainer}>
      {stats.map((stat, index) => (
        <Animated.View
          key={index}
          style={[
            styles.statCard,
            {
              opacity: fadeAnim,
              transform: [{ 
                translateY: slideAnim.interpolate({
                  inputRange: [0, 50],
                  outputRange: [0, 50 + (index * 10)]
                })
              }]
            }
          ]}
        >
          <TouchableOpacity onPress={stat.onPress} style={styles.statCardContent}>
            <View style={styles.statHeader}>
              <View style={[styles.statIconContainer, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${stat.progress * 100}%`,
                    backgroundColor: stat.color
                  }
                ]} 
              />
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderQuickActions = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActionsGrid}>
        {quickActions.map((action, index) => (
          <Animated.View
            key={index}
            style={[
              styles.quickActionWrapper,
              {
                opacity: fadeAnim,
                transform: [{ 
                  scale: scaleAnim.interpolate({
                    inputRange: [0.9, 1],
                    outputRange: [0.9, 1]
                  })
                }]
              }
            ]}
          >
            <TouchableOpacity onPress={action.onPress}>
              <LinearGradient
                colors={action.gradient}
                style={styles.quickActionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <action.icon size={28} color={Colors.white} />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderGlobalStats = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Global Impact</Text>
      <View style={styles.globalStatsContainer}>
        {globalStats.map((stat, index) => (
          <Animated.View
            key={index}
            style={[
              styles.globalStatCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.globalStatIcon, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={24} color={stat.color} />
            </View>
            <Text style={styles.globalStatValue}>{stat.value}</Text>
            <Text style={styles.globalStatLabel}>{stat.label}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderFeatures = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Why Choose FinSecure?</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureCard,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={[styles.featureIcon, { backgroundColor: feature.color + '20' }]}>
              <feature.icon size={24} color={feature.color} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderRecentAlerts = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/protect')}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>
      {recentAlerts.map((alert, index) => (
        <Animated.View
          key={index}
          style={[
            styles.alertCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity onPress={alert.onPress} style={styles.alertContent}>
            <View style={[
              styles.alertIndicator,
              { backgroundColor: alert.type === 'success' ? Colors.success :
                              alert.type === 'warning' ? Colors.warning : Colors.secondary }
            ]} />
            <View style={styles.alertTextContent}>
              <Text style={styles.alertTitle}>{alert.title}</Text>
              <Text style={styles.alertMessage}>{alert.message}</Text>
              <Text style={styles.alertTime}>{alert.time}</Text>
            </View>
            <ChevronRight size={16} color={Colors.gray400} />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {renderHeroSection()}
        {renderStatsCards()}
        {renderQuickActions()}
        {renderGlobalStats()}
        {renderFeatures()}
        {renderRecentAlerts()}
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
  scrollView: {
    flex: 1,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroContent: {
    flex: 1,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  heroText: {
    flex: 1,
  },
  heroGreeting: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.9,
    marginBottom: 4,
  },
  heroTitle: {
    color: Colors.white,
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    lineHeight: 38,
    marginBottom: 8,
  },
  heroSubtitle: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    lineHeight: 24,
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    backdropFilter: 'blur(10px)',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  heroStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    backdropFilter: 'blur(10px)',
  },
  heroStat: {
    alignItems: 'center',
  },
  heroStatNumber: {
    color: Colors.white,
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  heroStatLabel: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  statCardContent: {
    padding: 20,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textLight,
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
  },
  seeAllText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.secondary,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  quickActionWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  quickActionCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  actionLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
    textAlign: 'center',
    marginTop: 12,
  },
  globalStatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  globalStatCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  globalStatIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  globalStatValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 4,
  },
  globalStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    textAlign: 'center',
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    lineHeight: 20,
  },
  alertCard: {
    backgroundColor: Colors.white,
    marginBottom: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIndicator: {
    width: 4,
    height: '100%',
    minHeight: 80,
  },
  alertTextContent: {
    flex: 1,
    padding: 16,
  },
  alertTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  bottomSpacing: {
    height: 40,
  },
});