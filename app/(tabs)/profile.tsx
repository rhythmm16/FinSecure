import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, Globe, CircleHelp as HelpCircle, FileText, Star, LogOut, ChevronRight, Moon, Smartphone, Lock, TriangleAlert as AlertTriangle, ChartBar as BarChart3, CreditCard } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';
import { LANGUAGES } from '@/constants/Languages';

export default function Profile() {
  const { t, currentLanguage, changeLanguage } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(true);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);

  const userStats = [
    { label: 'Learning Score', value: '85%', icon: BarChart3, color: Colors.success },
    { label: 'Security Level', value: 'High', icon: Shield, color: Colors.primary },
    { label: 'Goals Achieved', value: '3', icon: Star, color: Colors.warning },
    { label: 'Fraud Blocked', value: '12', icon: AlertTriangle, color: Colors.error },
  ];

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { id: 'profile', label: 'Personal Information', icon: User },
        { id: 'security', label: 'Security Settings', icon: Lock },
        { id: 'payment', label: 'Payment Methods', icon: CreditCard },
      ],
    },
    {
      title: 'App Settings',
      items: [
        { id: 'notifications', label: 'Notifications', icon: Bell, hasSwitch: true, value: notifications },
        { id: 'biometrics', label: 'Biometric Login', icon: Smartphone, hasSwitch: true, value: biometrics },
        { id: 'darkMode', label: 'Dark Mode', icon: Moon, hasSwitch: true, value: darkMode },
        { id: 'language', label: 'Language', icon: Globe, value: currentLanguage.toUpperCase() },
      ],
    },
    {
      title: 'Support',
      items: [
        { id: 'help', label: 'Help Center', icon: HelpCircle },
        { id: 'terms', label: 'Terms & Conditions', icon: FileText },
        { id: 'privacy', label: 'Privacy Policy', icon: FileText },
        { id: 'rate', label: 'Rate App', icon: Star },
      ],
    },
  ];

  const handleSettingPress = (itemId: string) => {
    switch (itemId) {
      case 'notifications':
        setNotifications(!notifications);
        break;
      case 'biometrics':
        setBiometrics(!biometrics);
        break;
      case 'darkMode':
        setDarkMode(!darkMode);
        break;
      case 'language':
        setShowLanguageSelector(!showLanguageSelector);
        break;
      default:
        console.log(`Pressed: ${itemId}`);
    }
  };

  const renderUserProfile = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>John Doe</Text>
          <Text style={styles.userEmail}>john.doe@email.com</Text>
          <Text style={styles.memberSince}>Member since Jan 2024</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* User Stats */}
      <View style={styles.statsContainer}>
        {userStats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
              <stat.icon size={20} color={stat.color} />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderLanguageSelector = () => {
    if (!showLanguageSelector) return null;

    return (
      <View style={styles.languageSelector}>
        <Text style={styles.languageSelectorTitle}>Select Language</Text>
        {LANGUAGES.map((language) => (
          <TouchableOpacity
            key={language.code}
            style={[
              styles.languageOption,
              currentLanguage === language.code && styles.selectedLanguage
            ]}
            onPress={() => {
              changeLanguage(language.code as 'en' | 'hi' | 'pa');
              setShowLanguageSelector(false);
            }}
          >
            <Text style={styles.languageFlag}>{language.flag}</Text>
            <Text style={[
              styles.languageName,
              currentLanguage === language.code && styles.selectedLanguageName
            ]}>
              {language.name}
            </Text>
            {currentLanguage === language.code && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderSettingsSection = (section: any) => (
    <View key={section.title} style={styles.settingsSection}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      {section.items.map((item: any, index: number) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.settingItem,
            index === section.items.length - 1 && styles.lastSettingItem
          ]}
          onPress={() => handleSettingPress(item.id)}
        >
          <View style={styles.settingLeft}>
            <View style={styles.settingIcon}>
              <item.icon size={20} color={Colors.gray600} />
            </View>
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <View style={styles.settingRight}>
            {item.hasSwitch ? (
              <Switch
                value={item.value}
                onValueChange={() => handleSettingPress(item.id)}
                trackColor={{ false: Colors.gray300, true: Colors.primary }}
                thumbColor={item.value ? Colors.white : Colors.white}
              />
            ) : (
              <>
                {item.value && (
                  <Text style={styles.settingValue}>{item.value}</Text>
                )}
                <ChevronRight size={16} color={Colors.gray400} />
              </>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderUserProfile()}
        
        {/* Settings Sections */}
        <View style={styles.settingsContainer}>
          {settingsSections.map(renderSettingsSection)}
          
          {renderLanguageSelector()}
          
          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton}>
            <LogOut size={20} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

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
  profileSection: {
    backgroundColor: Colors.white,
    padding: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  memberSince: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
    marginTop: 2,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.gray50,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    textAlign: 'center',
  },
  settingsContainer: {
    padding: 20,
  },
  settingsSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    padding: 20,
    paddingBottom: 12,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray800,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
  },
  languageSelector: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  languageSelectorTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedLanguage: {
    backgroundColor: Colors.primary + '10',
  },
  languageFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  languageName: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray800,
    flex: 1,
  },
  selectedLanguageName: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.error,
  },
  bottomSpacing: {
    height: 20,
  },
});