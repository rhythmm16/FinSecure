import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Shield, Camera, MessageCircle, Search, TriangleAlert as AlertTriangle, PhoneCall, CreditCard, Mail, Smartphone, Eye, CircleCheck as CheckCircle, Lock, Wifi, Globe, Zap, Users, ChartBar as BarChart3 } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';
import { router } from 'expo-router';

export default function Protect() {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('scanner');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const protectionTools = [
    {
      id: 'scanner',
      title: 'QR Code Scanner',
      description: 'Detect fake QR codes and payment scams instantly',
      icon: Camera,
      gradient: [Colors.secondary, Colors.secondaryLight],
      status: 'active',
      onPress: () => router.push('/qr-scanner')
    },
    {
      id: 'chat',
      title: 'AI Security Coach',
      description: 'Get instant help for suspicious activities',
      icon: MessageCircle,
      gradient: [Colors.accent, Colors.accentLight],
      status: 'active',
      onPress: () => router.push('/ai-coach')
    },
    {
      id: 'breach',
      title: 'Data Breach Checker',
      description: 'Check if your email was compromised',
      icon: Search,
      gradient: [Colors.error, Colors.errorLight],
      status: 'active',
      onPress: () => router.push('/breach-checker')
    },
    {
      id: 'simulation',
      title: 'Fraud Simulation',
      description: 'Practice identifying common scams',
      icon: Shield,
      gradient: [Colors.success, Colors.successLight],
      status: 'beta',
      onPress: () => router.push('/escape-game')
    },
  ];

  const securityStats = [
    { label: 'Threats Blocked', value: '2.5M+', icon: Shield, color: Colors.success },
    { label: 'Users Protected', value: '850K+', icon: Users, color: Colors.secondary },
    { label: 'Success Rate', value: '99.8%', icon: BarChart3, color: Colors.accent },
    { label: 'Response Time', value: '<1s', icon: Zap, color: Colors.error },
  ];

  const recentThreats = [
    {
      type: 'phishing',
      title: 'Fake Banking SMS Blocked',
      description: 'Suspicious message asking for OTP verification was automatically blocked',
      severity: 'high',
      time: '2 hours ago',
      action: 'Blocked',
      color: Colors.error,
    },
    {
      type: 'malware',
      title: 'Malicious QR Code Detected',
      description: 'QR code leading to fraudulent payment page was identified',
      severity: 'critical',
      time: '5 hours ago',
      action: 'Detected',
      color: Colors.warning,
    },
    {
      type: 'social',
      title: 'Investment Scam Call',
      description: 'Suspicious caller offering guaranteed returns was reported',
      severity: 'medium',
      time: '1 day ago',
      action: 'Reported',
      color: Colors.secondary,
    },
  ];

  const fraudTypes = [
    {
      title: 'OTP Fraud Detection',
      description: 'Learn to identify fake OTP requests and protect your accounts',
      difficulty: 'Beginner',
      duration: '5 min',
      completed: false,
      icon: Smartphone,
      color: Colors.secondary,
    },
    {
      title: 'Phishing Email Analysis',
      description: 'Spot suspicious emails and malicious links effectively',
      difficulty: 'Intermediate',
      duration: '8 min',
      completed: true,
      icon: Mail,
      color: Colors.accent,
    },
    {
      title: 'UPI Payment Security',
      description: 'Avoid fake payment requests and secure transactions',
      difficulty: 'Advanced',
      duration: '12 min',
      completed: false,
      icon: CreditCard,
      color: Colors.success,
    },
    {
      title: 'Investment Fraud Prevention',
      description: 'Identify Ponzi schemes and fake investment opportunities',
      difficulty: 'Expert',
      duration: '15 min',
      completed: false,
      icon: PhoneCall,
      color: Colors.error,
    },
  ];

  const renderHeader = () => (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight]}
      style={styles.header}
    >
      <Animated.View 
        style={[
          styles.headerContent,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerTop}>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Security Center</Text>
            <Text style={styles.headerSubtitle}>Advanced protection against financial fraud</Text>
          </View>
          <View style={styles.securityStatus}>
            <Shield size={20} color={Colors.success} />
            <Text style={styles.statusText}>Protected</Text>
          </View>
        </View>

        <View style={styles.securityStatsContainer}>
          {securityStats.map((stat, index) => (
            <View key={index} style={styles.securityStat}>
              <View style={[styles.securityStatIcon, { backgroundColor: stat.color + '20' }]}>
                <stat.icon size={16} color={stat.color} />
              </View>
              <Text style={styles.securityStatValue}>{stat.value}</Text>
              <Text style={styles.securityStatLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const renderProtectionTools = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Protection Tools</Text>
      <View style={styles.toolsGrid}>
        {protectionTools.map((tool, index) => (
          <Animated.View
            key={tool.id}
            style={[
              styles.toolWrapper,
              {
                opacity: fadeAnim,
                transform: [{ 
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 30],
                    outputRange: [0, 30 + (index * 10)]
                  })
                }]
              }
            ]}
          >
            <TouchableOpacity onPress={tool.onPress}>
              <LinearGradient
                colors={tool.gradient}
                style={styles.toolCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.toolIconContainer}>
                  <tool.icon size={28} color={Colors.white} />
                </View>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
                {tool.status === 'beta' && (
                  <View style={styles.betaBadge}>
                    <Text style={styles.betaText}>BETA</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>
    </View>
  );

  const renderThreatAlerts = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Recent Threat Alerts</Text>
      {recentThreats.map((threat, index) => (
        <Animated.View
          key={index}
          style={[
            styles.threatCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={[styles.severityIndicator, { backgroundColor: threat.color }]} />
          <View style={styles.threatContent}>
            <View style={styles.threatHeader}>
              <Text style={styles.threatTitle}>{threat.title}</Text>
              <View style={[styles.actionBadge, { backgroundColor: threat.color }]}>
                <Text style={styles.actionText}>{threat.action}</Text>
              </View>
            </View>
            <Text style={styles.threatDescription}>{threat.description}</Text>
            <Text style={styles.threatTime}>{threat.time}</Text>
          </View>
        </Animated.View>
      ))}
    </View>
  );

  const renderFraudSimulation = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Fraud Simulation Training</Text>
      <Text style={styles.sectionSubtitle}>
        Practice identifying common fraud scenarios in a safe environment
      </Text>
      {fraudTypes.map((fraud, index) => (
        <Animated.View
          key={index}
          style={[
            styles.simulationCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => router.push('/escape-game')}
            style={styles.simulationContent}
          >
            <View style={[styles.simulationIcon, { backgroundColor: fraud.color + '20' }]}>
              <fraud.icon size={20} color={fraud.color} />
            </View>
            <View style={styles.simulationInfo}>
              <Text style={styles.simulationTitle}>{fraud.title}</Text>
              <Text style={styles.simulationDescription}>{fraud.description}</Text>
              <View style={styles.simulationMeta}>
                <Text style={[styles.difficulty, { color: fraud.color }]}>{fraud.difficulty}</Text>
                <Text style={styles.duration}>{fraud.duration}</Text>
              </View>
            </View>
            <View style={styles.completionStatus}>
              {fraud.completed ? (
                <CheckCircle size={24} color={Colors.success} />
              ) : (
                <View style={styles.incompleteCircle} />
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderOfflineKit = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Offline Protection Kit</Text>
      <Animated.View
        style={[
          styles.offlineCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.offlineGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Lock size={48} color={Colors.white} />
          <Text style={styles.offlineTitle}>Emergency Protection Mode</Text>
          <Text style={styles.offlineDescription}>
            Access essential security tools even when offline. Includes fraud detection patterns, 
            emergency contacts, and comprehensive security checklists.
          </Text>
          <TouchableOpacity style={styles.offlineButton}>
            <Text style={styles.offlineButtonText}>Download Kit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderProtectionTools()}
        {renderThreatAlerts()}
        {renderFraudSimulation()}
        {renderOfflineKit()}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flex: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.9,
  },
  securityStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
  },
  securityStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 16,
  },
  securityStat: {
    alignItems: 'center',
    flex: 1,
  },
  securityStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityStatValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 4,
  },
  securityStatLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    marginBottom: 20,
    lineHeight: 20,
  },
  toolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  toolWrapper: {
    flex: 1,
    minWidth: '45%',
  },
  toolCard: {
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    position: 'relative',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  toolIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  toolTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 8,
  },
  toolDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 16,
    opacity: 0.9,
  },
  betaBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  betaText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  threatCard: {
    flexDirection: 'row',
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
  severityIndicator: {
    width: 4,
  },
  threatContent: {
    flex: 1,
    padding: 16,
  },
  threatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  threatTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    flex: 1,
  },
  actionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  threatDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  threatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  simulationCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  simulationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  simulationIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  simulationInfo: {
    flex: 1,
  },
  simulationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  simulationDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    marginBottom: 8,
    lineHeight: 20,
  },
  simulationMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  difficulty: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  duration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  completionStatus: {
    marginLeft: 16,
  },
  incompleteCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray300,
  },
  offlineCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  offlineGradient: {
    padding: 32,
    alignItems: 'center',
  },
  offlineTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginTop: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  offlineDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.9,
  },
  offlineButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
  },
  offlineButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
});