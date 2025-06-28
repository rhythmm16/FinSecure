import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Shield, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Eye, EyeOff, Globe, Calendar, Users } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';

interface BreachResult {
  email: string;
  breaches: {
    name: string;
    date: string;
    description: string;
    dataTypes: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
    affectedUsers: number;
  }[];
  isCompromised: boolean;
}

export default function BreachChecker() {
  const [email, setEmail] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<BreachResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Mock breach data for demonstration
  const mockBreaches = [
    {
      name: 'LinkedIn Data Breach',
      date: '2021-06-01',
      description: 'Professional networking data including emails, phone numbers, and profile information',
      dataTypes: ['Email addresses', 'Phone numbers', 'Professional info', 'Social media profiles'],
      severity: 'high' as const,
      affectedUsers: 700000000,
    },
    {
      name: 'Facebook Data Leak',
      date: '2019-04-03',
      description: 'Personal information including names, email addresses, and phone numbers',
      dataTypes: ['Email addresses', 'Phone numbers', 'Names', 'Geographic locations'],
      severity: 'critical' as const,
      affectedUsers: 533000000,
    },
    {
      name: 'Adobe Creative Cloud Breach',
      date: '2013-10-01',
      description: 'Customer account information and encrypted passwords',
      dataTypes: ['Email addresses', 'Encrypted passwords', 'Names', 'Credit card info'],
      severity: 'medium' as const,
      affectedUsers: 38000000,
    },
  ];

  const handleCheck = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email format');
      return;
    }

    setIsChecking(true);
    setShowResult(false);

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, show breaches for certain email patterns
      const shouldShowBreaches = email.includes('test') || email.includes('demo') || email.includes('example');
      
      const breachResult: BreachResult = {
        email: email,
        breaches: shouldShowBreaches ? mockBreaches : [],
        isCompromised: shouldShowBreaches,
      };

      setResult(breachResult);
      setIsChecking(false);
      setShowResult(true);
    }, 2000);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return Colors.error;
      case 'high':
        return Colors.warning;
      case 'medium':
        return '#F97316';
      case 'low':
        return Colors.success;
      default:
        return Colors.gray500;
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return AlertTriangle;
      case 'medium':
        return Eye;
      case 'low':
        return Shield;
      default:
        return Shield;
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderBreachCard = (breach: BreachResult['breaches'][0], index: number) => {
    const SeverityIcon = getSeverityIcon(breach.severity);
    
    return (
      <View key={index} style={styles.breachCard}>
        <View style={styles.breachHeader}>
          <View style={styles.breachTitleContainer}>
            <View style={[styles.severityIcon, { backgroundColor: getSeverityColor(breach.severity) + '20' }]}>
              <SeverityIcon size={20} color={getSeverityColor(breach.severity)} />
            </View>
            <View style={styles.breachTitleInfo}>
              <Text style={styles.breachName}>{breach.name}</Text>
              <Text style={styles.breachDate}>Breached on {new Date(breach.date).toLocaleDateString()}</Text>
            </View>
          </View>
          <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(breach.severity) }]}>
            <Text style={styles.severityText}>{breach.severity.toUpperCase()}</Text>
          </View>
        </View>

        <Text style={styles.breachDescription}>{breach.description}</Text>

        <View style={styles.breachStats}>
          <View style={styles.statItem}>
            <Users size={16} color={Colors.gray500} />
            <Text style={styles.statText}>{formatNumber(breach.affectedUsers)} affected</Text>
          </View>
          <View style={styles.statItem}>
            <Calendar size={16} color={Colors.gray500} />
            <Text style={styles.statText}>{new Date(breach.date).getFullYear()}</Text>
          </View>
        </View>

        <View style={styles.dataTypesContainer}>
          <Text style={styles.dataTypesTitle}>Compromised Data:</Text>
          <View style={styles.dataTypesList}>
            {breach.dataTypes.map((dataType, idx) => (
              <View key={idx} style={styles.dataTypeChip}>
                <Text style={styles.dataTypeText}>{dataType}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultHeader}>
          <View style={styles.resultIcon}>
            {result.isCompromised ? (
              <AlertTriangle size={48} color={Colors.error} />
            ) : (
              <CheckCircle size={48} color={Colors.success} />
            )}
          </View>
          <Text style={styles.resultTitle}>
            {result.isCompromised ? 'Email Found in Breaches' : 'No Breaches Found'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {result.isCompromised 
              ? `Your email was found in ${result.breaches.length} data breach${result.breaches.length > 1 ? 'es' : ''}`
              : 'Your email was not found in any known data breaches'
            }
          </Text>
        </View>

        {result.isCompromised && (
          <>
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>Immediate Actions:</Text>
              <View style={styles.recommendation}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.recommendationText}>Change passwords for all affected accounts</Text>
              </View>
              <View style={styles.recommendation}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.recommendationText}>Enable two-factor authentication</Text>
              </View>
              <View style={styles.recommendation}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.recommendationText}>Monitor your accounts for suspicious activity</Text>
              </View>
              <View style={styles.recommendation}>
                <CheckCircle size={16} color={Colors.success} />
                <Text style={styles.recommendationText}>Consider using a password manager</Text>
              </View>
            </View>

            <ScrollView style={styles.breachesContainer} showsVerticalScrollIndicator={false}>
              <Text style={styles.breachesTitle}>Breach Details:</Text>
              {result.breaches.map(renderBreachCard)}
            </ScrollView>
          </>
        )}

        <TouchableOpacity 
          style={styles.checkAnotherButton}
          onPress={() => {
            setEmail('');
            setResult(null);
            setShowResult(false);
          }}
        >
          <Text style={styles.checkAnotherButtonText}>Check Another Email</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Data Breach Checker</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!showResult && (
          <>
            <View style={styles.introContainer}>
              <View style={styles.introIcon}>
                <Globe size={48} color={Colors.primary} />
              </View>
              <Text style={styles.introTitle}>Dark Web Monitoring</Text>
              <Text style={styles.introDescription}>
                Check if your email address has been compromised in any known data breaches. 
                We scan millions of breached records to keep you informed about your digital security.
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter your email address</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.emailInput}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your.email@example.com"
                  placeholderTextColor={Colors.gray500}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity 
                  style={[styles.checkButton, { opacity: email.trim() ? 1 : 0.5 }]}
                  onPress={handleCheck}
                  disabled={!email.trim() || isChecking}
                >
                  {isChecking ? (
                    <Text style={styles.checkButtonText}>Checking...</Text>
                  ) : (
                    <>
                      <Search size={20} color={Colors.white} />
                      <Text style={styles.checkButtonText}>Check</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>What we check:</Text>
              <View style={styles.feature}>
                <Shield size={20} color={Colors.primary} />
                <Text style={styles.featureText}>500+ million breached records</Text>
              </View>
              <View style={styles.feature}>
                <Eye size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Dark web monitoring</Text>
              </View>
              <View style={styles.feature}>
                <AlertTriangle size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Real-time threat intelligence</Text>
              </View>
              <View style={styles.feature}>
                <CheckCircle size={20} color={Colors.primary} />
                <Text style={styles.featureText}>Privacy-focused scanning</Text>
              </View>
            </View>

            <View style={styles.privacyNote}>
              <EyeOff size={20} color={Colors.gray600} />
              <Text style={styles.privacyText}>
                Your email is never stored or shared. We only check it against our breach database.
              </Text>
            </View>
          </>
        )}

        {showResult && renderResult()}

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  introContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: Colors.white,
    margin: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  introIcon: {
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 12,
    textAlign: 'center',
  },
  introDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
  inputContainer: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 12,
  },
  inputWrapper: {
    flexDirection: 'row',
    gap: 12,
  },
  emailInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray800,
  },
  checkButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  featuresContainer: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    margin: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  privacyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    flex: 1,
    lineHeight: 20,
  },
  resultContainer: {
    padding: 20,
  },
  resultHeader: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: 30,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultIcon: {
    marginBottom: 16,
  },
  resultTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
  },
  recommendationsContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  recommendationsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  recommendationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  breachesContainer: {
    maxHeight: 400,
  },
  breachesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  breachCard: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breachHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  breachTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  breachTitleInfo: {
    flex: 1,
  },
  breachName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
  },
  breachDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  breachDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginBottom: 16,
    lineHeight: 20,
  },
  breachStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
  },
  dataTypesContainer: {
    marginTop: 8,
  },
  dataTypesTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray700,
    marginBottom: 8,
  },
  dataTypesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dataTypeChip: {
    backgroundColor: Colors.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  dataTypeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
  },
  checkAnotherButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  checkAnotherButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  bottomSpacing: {
    height: 20,
  },
});