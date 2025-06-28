import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Play, Award, TrendingUp, DollarSign, CreditCard, PiggyBank, Calculator, FileText, Users, CircleCheck as CheckCircle, Clock, Star, Zap } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useLanguage } from '@/hooks/useLanguage';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function Learn() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('tutorials');
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

  const tabs = [
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'guides', label: 'Guides', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: Award },
    { id: 'game', label: 'Escape Game', icon: Play },
  ];

  const tutorials = [
    {
      id: 1,
      title: 'Basic Budgeting for Beginners',
      description: 'Learn the fundamentals of creating and managing your budget effectively',
      duration: '15 min',
      level: 'Beginner',
      progress: 0,
      icon: PiggyBank,
      gradient: [Colors.success, Colors.successLight],
      students: '12.5K',
      rating: 4.8,
    },
    {
      id: 2,
      title: 'Understanding Investment Basics',
      description: 'Introduction to stocks, bonds, mutual funds, and portfolio management',
      duration: '25 min',
      level: 'Intermediate',
      progress: 60,
      icon: TrendingUp,
      gradient: [Colors.secondary, Colors.secondaryLight],
      students: '8.2K',
      rating: 4.9,
    },
    {
      id: 3,
      title: 'Tax Planning Strategies',
      description: 'Maximize your tax savings with smart planning and legal deductions',
      duration: '20 min',
      level: 'Advanced',
      progress: 100,
      icon: Calculator,
      gradient: [Colors.accent, Colors.accentLight],
      students: '5.7K',
      rating: 4.7,
    },
    {
      id: 4,
      title: 'Credit Card Management',
      description: 'Use credit cards wisely and build excellent credit history',
      duration: '12 min',
      level: 'Beginner',
      progress: 0,
      icon: CreditCard,
      gradient: [Colors.error, Colors.errorLight],
      students: '15.3K',
      rating: 4.6,
    },
  ];

  const guides = [
    {
      id: 1,
      title: 'Complete Investment Guide 2024',
      description: 'Comprehensive guide covering all investment options and strategies',
      readTime: '45 min',
      rating: 4.8,
      downloads: '12.5K',
      icon: TrendingUp,
      color: Colors.secondary,
    },
    {
      id: 2,
      title: 'Tax Saving Handbook',
      description: 'All you need to know about tax saving instruments and strategies',
      readTime: '30 min',
      rating: 4.9,
      downloads: '18.2K',
      icon: FileText,
      color: Colors.accent,
    },
    {
      id: 3,
      title: 'Emergency Fund Planning',
      description: 'Build and maintain your financial safety net effectively',
      readTime: '20 min',
      rating: 4.7,
      downloads: '9.8K',
      icon: PiggyBank,
      color: Colors.success,
    },
  ];

  const quizzes = [
    {
      id: 1,
      title: 'Financial Literacy Quiz',
      questions: 15,
      timeLimit: '10 min',
      difficulty: 'Easy',
      attempts: 0,
      bestScore: null,
      icon: Award,
      color: Colors.success,
    },
    {
      id: 2,
      title: 'Investment Knowledge Test',
      questions: 20,
      timeLimit: '15 min',
      difficulty: 'Medium',
      attempts: 2,
      bestScore: 85,
      icon: TrendingUp,
      color: Colors.secondary,
    },
    {
      id: 3,
      title: 'Tax Planning Challenge',
      questions: 25,
      timeLimit: '20 min',
      difficulty: 'Hard',
      attempts: 1,
      bestScore: 72,
      icon: Calculator,
      color: Colors.accent,
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
        <Text style={styles.headerTitle}>Learn & Grow</Text>
        <Text style={styles.headerSubtitle}>Enhance your financial knowledge with expert-curated content</Text>
        
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>50+</Text>
            <Text style={styles.headerStatLabel}>Courses</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>100K+</Text>
            <Text style={styles.headerStatLabel}>Students</Text>
          </View>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatNumber}>4.8★</Text>
            <Text style={styles.headerStatLabel}>Rating</Text>
          </View>
        </View>
      </Animated.View>
    </LinearGradient>
  );

  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabScrollContent}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, activeTab === tab.id && styles.activeTab]}
            onPress={() => setActiveTab(tab.id)}
          >
            <tab.icon 
              size={18} 
              color={activeTab === tab.id ? Colors.white : Colors.textLight} 
            />
            <Text style={[
              styles.tabText, 
              activeTab === tab.id && styles.activeTabText
            ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderTutorials = () => (
    <View style={styles.content}>
      {tutorials.map((tutorial, index) => (
        <Animated.View
          key={tutorial.id}
          style={[
            styles.tutorialCard,
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
          <TouchableOpacity 
            onPress={() => router.push(`/tutorial/${tutorial.id}`)}
            style={styles.tutorialCardContent}
          >
            <LinearGradient
              colors={tutorial.gradient}
              style={styles.tutorialHeader}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.tutorialIconContainer}>
                <tutorial.icon size={28} color={Colors.white} />
              </View>
              <View style={styles.tutorialHeaderInfo}>
                <Text style={styles.tutorialLevel}>{tutorial.level}</Text>
                <Text style={styles.tutorialStudents}>{tutorial.students} students</Text>
              </View>
            </LinearGradient>

            <View style={styles.tutorialBody}>
              <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
              <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
              
              <View style={styles.tutorialMeta}>
                <View style={styles.metaItem}>
                  <Clock size={16} color={Colors.textMuted} />
                  <Text style={styles.metaText}>{tutorial.duration}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Star size={16} color={Colors.accent} />
                  <Text style={styles.metaText}>{tutorial.rating}</Text>
                </View>
              </View>

              {tutorial.progress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${tutorial.progress}%`,
                          backgroundColor: tutorial.gradient[0]
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{tutorial.progress}% complete</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderGuides = () => (
    <View style={styles.content}>
      {guides.map((guide, index) => (
        <Animated.View
          key={guide.id}
          style={[
            styles.guideCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity style={styles.guideCardContent}>
            <View style={[styles.guideIcon, { backgroundColor: guide.color + '20' }]}>
              <guide.icon size={24} color={guide.color} />
            </View>
            <View style={styles.guideInfo}>
              <Text style={styles.guideTitle}>{guide.title}</Text>
              <Text style={styles.guideDescription}>{guide.description}</Text>
              <View style={styles.guideMeta}>
                <Text style={styles.readTime}>{guide.readTime}</Text>
                <View style={styles.rating}>
                  <Star size={16} color={Colors.accent} />
                  <Text style={styles.ratingText}>{guide.rating}</Text>
                </View>
                <Text style={styles.downloads}>{guide.downloads} downloads</Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderQuizzes = () => (
    <View style={styles.content}>
      {quizzes.map((quiz, index) => (
        <Animated.View
          key={quiz.id}
          style={[
            styles.quizCard,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <TouchableOpacity 
            onPress={() => router.push(`/quiz/${quiz.id}`)}
            style={styles.quizCardContent}
          >
            <View style={[styles.quizIcon, { backgroundColor: quiz.color + '20' }]}>
              <quiz.icon size={24} color={quiz.color} />
            </View>
            <View style={styles.quizInfo}>
              <Text style={styles.quizTitle}>{quiz.title}</Text>
              <View style={styles.quizMeta}>
                <Text style={styles.quizDetail}>{quiz.questions} questions</Text>
                <Text style={styles.quizDetail}>{quiz.timeLimit}</Text>
                <Text style={[
                  styles.difficulty,
                  { color: quiz.difficulty === 'Easy' ? Colors.success :
                           quiz.difficulty === 'Medium' ? Colors.accent : Colors.error }
                ]}>{quiz.difficulty}</Text>
              </View>
              {quiz.bestScore && (
                <Text style={styles.bestScore}>Best Score: {quiz.bestScore}%</Text>
              )}
            </View>
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );

  const renderEscapeGame = () => (
    <View style={styles.content}>
      <Animated.View
        style={[
          styles.gameCard,
          {
            opacity: fadeAnim,
            transform: [{ scale: fadeAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={[Colors.gradientStart, Colors.gradientEnd]}
          style={styles.gameGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.gameIcon}>
            <Zap size={48} color={Colors.white} />
          </View>
          <Text style={styles.gameTitle}>Financial Escape Room</Text>
          <Text style={styles.gameDescription}>
            Navigate through financial challenges and escape the debt trap! 
            Learn by solving real-world financial puzzles and fraud scenarios.
          </Text>
          <View style={styles.gameStats}>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>12</Text>
              <Text style={styles.gameStatLabel}>Levels</Text>
            </View>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>3.2K</Text>
              <Text style={styles.gameStatLabel}>Players</Text>
            </View>
            <View style={styles.gameStatItem}>
              <Text style={styles.gameStatNumber}>4.9</Text>
              <Text style={styles.gameStatLabel}>Rating</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.playButton}
            onPress={() => router.push('/escape-game')}
          >
            <Play size={20} color={Colors.primary} />
            <Text style={styles.playButtonText}>Start Playing</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'tutorials':
        return renderTutorials();
      case 'guides':
        return renderGuides();
      case 'quizzes':
        return renderQuizzes();
      case 'game':
        return renderEscapeGame();
      default:
        return renderTutorials();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderTabs()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderContent()}
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
    alignItems: 'center',
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
    textAlign: 'center',
    marginBottom: 24,
  },
  headerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
  },
  headerStat: {
    alignItems: 'center',
  },
  headerStatNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    marginBottom: 4,
  },
  headerStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  tabContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tabScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: Colors.gray100,
    gap: 8,
  },
  activeTab: {
    backgroundColor: Colors.secondary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.textLight,
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
  tutorialCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  tutorialCardContent: {
    flex: 1,
  },
  tutorialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  tutorialIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tutorialHeaderInfo: {
    flex: 1,
  },
  tutorialLevel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
    marginBottom: 4,
  },
  tutorialStudents: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    opacity: 0.8,
  },
  tutorialBody: {
    padding: 20,
  },
  tutorialTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.text,
    marginBottom: 8,
  },
  tutorialDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    lineHeight: 20,
    marginBottom: 16,
  },
  tutorialMeta: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.textLight,
  },
  guideCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  guideCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  guideIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  guideInfo: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 4,
  },
  guideDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.textLight,
    marginBottom: 12,
    lineHeight: 20,
  },
  guideMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  readTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  downloads: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  quizCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  quizIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quizInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.text,
    marginBottom: 8,
  },
  quizMeta: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  quizDetail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: Colors.textMuted,
  },
  difficulty: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  bestScore: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
  },
  gameCard: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  gameGradient: {
    padding: 32,
    alignItems: 'center',
  },
  gameIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  gameDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    opacity: 0.9,
  },
  gameStats: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 32,
  },
  gameStatItem: {
    alignItems: 'center',
  },
  gameStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.white,
  },
  gameStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.white,
    marginTop: 4,
    opacity: 0.8,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  bottomSpacing: {
    height: 40,
  },
});