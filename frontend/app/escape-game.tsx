import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Trophy, Clock, Star, CircleCheck as CheckCircle, Circle as XCircle, Lightbulb, Target } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useAppContext } from '@/context/AppContext';

interface GameLevel {
  id: number;
  title: string;
  description: string;
  scenario: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  points: number;
  timeLimit: number;
}

export default function EscapeGame() {
  const { updateUserStats } = useAppContext();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const gameLevels: GameLevel[] = [
    {
      id: 1,
      title: 'The Suspicious Call',
      description: 'You receive a call claiming to be from your bank',
      scenario: 'Your phone rings. The caller says: "Hello, this is from ABC Bank security department. We\'ve detected suspicious activity on your account. To secure your account, please provide your debit card number and OTP that we\'ll send you."',
      question: 'What should you do?',
      options: [
        'Provide the information to secure my account',
        'Ask for their employee ID and call back the bank directly',
        'Hang up immediately without saying anything',
        'Ask them to send an email with details first'
      ],
      correctAnswer: 1,
      explanation: 'Always verify the caller\'s identity by asking for their employee ID and calling the bank directly using the official number. Banks never ask for sensitive information over unsolicited calls.',
      points: 100,
      timeLimit: 30
    },
    {
      id: 2,
      title: 'The Fake QR Code',
      description: 'You see a QR code promising free money',
      scenario: 'At a coffee shop, you notice a QR code sticker on your table with text: "Scan to get ₹500 free! Limited time offer - Congratulations, you\'re our lucky customer today!"',
      question: 'What\'s the safest action?',
      options: [
        'Scan it quickly before the offer expires',
        'Ask the coffee shop staff about the QR code first',
        'Ignore it completely as it\'s likely a scam',
        'Scan it but don\'t enter any personal information'
      ],
      correctAnswer: 2,
      explanation: 'QR codes promising free money or prizes are almost always scams. Legitimate businesses don\'t randomly place such offers. Never scan unknown QR codes.',
      points: 150,
      timeLimit: 25
    },
    {
      id: 3,
      title: 'The Phishing Email',
      description: 'You receive an urgent email about your account',
      scenario: 'You get an email: "URGENT: Your account will be suspended in 24 hours due to suspicious activity. Click here immediately to verify your identity and prevent account closure. This is your final warning!"',
      question: 'How do you respond?',
      options: [
        'Click the link immediately to prevent suspension',
        'Forward the email to friends to warn them',
        'Check the sender\'s email address and contact the company directly',
        'Reply to the email asking for more information'
      ],
      correctAnswer: 2,
      explanation: 'Phishing emails create urgency to make you act without thinking. Always check the sender\'s address, look for spelling errors, and contact the company directly through official channels.',
      points: 200,
      timeLimit: 35
    },
    {
      id: 4,
      title: 'The Investment Opportunity',
      description: 'A friend shares a "guaranteed" investment scheme',
      scenario: 'Your friend excitedly tells you: "I found this amazing investment! You just need to invest ₹10,000 and you\'ll get ₹50,000 back in 30 days. It\'s guaranteed! My cousin already made ₹2 lakhs. Want me to add you to the WhatsApp group?"',
      question: 'What\'s your best response?',
      options: [
        'Invest immediately before the opportunity is gone',
        'Ask for proof of your friend\'s cousin\'s earnings',
        'Politely decline and explain that guaranteed high returns are usually scams',
        'Invest a smaller amount first to test it'
      ],
      correctAnswer: 2,
      explanation: 'No legitimate investment can guarantee such high returns. These are typically Ponzi schemes. Even if friends are involved, they might be unknowing victims themselves.',
      points: 250,
      timeLimit: 40
    },
    {
      id: 5,
      title: 'The Final Challenge',
      description: 'Multiple threats at once - can you identify them all?',
      scenario: 'In one day: 1) You get a call asking for OTP, 2) An email about account suspension, 3) A WhatsApp message with a "lucky winner" link, 4) A friend asking you to invest in crypto with guaranteed returns.',
      question: 'Which of these is legitimate?',
      options: [
        'The phone call - banks do call for security',
        'The email - companies send security alerts',
        'The WhatsApp message - you might have won something',
        'None of them - they\'re all potential scams'
      ],
      correctAnswer: 3,
      explanation: 'All of these are classic scam patterns! The combination of urgency, guaranteed rewards, and requests for personal information are red flags. Trust your instincts.',
      points: 300,
      timeLimit: 45
    }
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0 && !showResult) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameStarted && !showResult) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, gameStarted, showResult]);

  const startGame = () => {
    setGameStarted(true);
    setCurrentLevel(0);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(gameLevels[0].timeLimit);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameCompleted(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    const currentLevelData = gameLevels[currentLevel];
    const isCorrect = selectedAnswer === currentLevelData.correctAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + currentLevelData.points);
      setCorrectAnswers(prev => prev + 1);
    }
    
    setShowResult(true);
  };

  const handleTimeUp = () => {
    setShowResult(true);
  };

  const handleNextLevel = () => {
    if (currentLevel < gameLevels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setTimeLeft(gameLevels[currentLevel + 1].timeLimit);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setGameCompleted(true);
      updateUserStats({ learningScore: Math.min(100, 85 + (correctAnswers * 2)) });
    }
  };

  const handleRestart = () => {
    startGame();
  };

  const renderGameIntro = () => (
    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.introContainer}>
        <View style={styles.gameIcon}>
          <Target size={64} color={Colors.primary} />
        </View>
        <Text style={styles.gameTitle}>Financial Escape Room</Text>
        <Text style={styles.gameDescription}>
          Navigate through real-world financial fraud scenarios and escape the scammer's trap! 
          Test your knowledge and learn to identify common fraud patterns.
        </Text>
        
        <View style={styles.gameStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{gameLevels.length}</Text>
            <Text style={styles.statLabel}>Levels</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1000</Text>
            <Text style={styles.statLabel}>Max Points</Text>
          </View>
        </View>

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>How to Play:</Text>
          <View style={styles.rule}>
            <CheckCircle size={16} color={Colors.success} />
            <Text style={styles.ruleText}>Read each scenario carefully</Text>
          </View>
          <View style={styles.rule}>
            <Clock size={16} color={Colors.warning} />
            <Text style={styles.ruleText}>Answer within the time limit</Text>
          </View>
          <View style={styles.rule}>
            <Star size={16} color={Colors.accent} />
            <Text style={styles.ruleText}>Earn points for correct answers</Text>
          </View>
          <View style={styles.rule}>
            <Trophy size={16} color={Colors.primary} />
            <Text style={styles.ruleText}>Complete all levels to escape!</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Play size={20} color={Colors.white} />
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderGameLevel = () => {
    const level = gameLevels[currentLevel];
    const isCorrect = selectedAnswer === level.correctAnswer;
    
    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.gameHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Level {level.id}</Text>
            <Text style={styles.levelSubtitle}>{level.title}</Text>
          </View>
          <View style={styles.gameProgress}>
            <View style={styles.timerContainer}>
              <Clock size={16} color={timeLeft <= 10 ? Colors.error : Colors.primary} />
              <Text style={[
                styles.timerText,
                { color: timeLeft <= 10 ? Colors.error : Colors.primary }
              ]}>
                {timeLeft}s
              </Text>
            </View>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>
        </View>

        <View style={styles.scenarioContainer}>
          <Text style={styles.scenarioTitle}>Scenario:</Text>
          <Text style={styles.scenarioText}>{level.scenario}</Text>
        </View>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{level.question}</Text>
          
          <View style={styles.optionsContainer}>
            {level.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                
                  showResult && index === level.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== level.correctAnswer && styles.wrongOption
                ]}
                onPress={() => handleAnswerSelect(index)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                  showResult && index === level.correctAnswer && styles.correctOptionText,
                  showResult && selectedAnswer === index && index !== level.correctAnswer && styles.wrongOptionText
                ]}>
                  {option}
                </Text>
                {showResult && index === level.correctAnswer && (
                  <CheckCircle size={20} color={Colors.white} />
                )}
                {showResult && selectedAnswer === index && index !== level.correctAnswer && (
                  <XCircle size={20} color={Colors.white} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {!showResult && selectedAnswer !== null && (
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitAnswer}>
              <Text style={styles.submitButtonText}>Submit Answer</Text>
            </TouchableOpacity>
          )}

          {showResult && (
            <View style={styles.resultContainer}>
              <View style={styles.resultHeader}>
                {isCorrect ? (
                  <CheckCircle size={32} color={Colors.success} />
                ) : (
                  <XCircle size={32} color={Colors.error} />
                )}
                <Text style={styles.resultTitle}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </Text>
                {isCorrect && (
                  <Text style={styles.pointsEarned}>+{level.points} points</Text>
                )}
              </View>
              
              <View style={styles.explanationContainer}>
                <Lightbulb size={20} color={Colors.accent} />
                <Text style={styles.explanationText}>{level.explanation}</Text>
              </View>

              <TouchableOpacity style={styles.nextButton} onPress={handleNextLevel}>
                <Text style={styles.nextButtonText}>
                  {currentLevel < gameLevels.length - 1 ? 'Next Level' : 'Complete Game'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };

  const renderGameComplete = () => {
    const percentage = (correctAnswers / gameLevels.length) * 100;
    const rating = percentage >= 80 ? 'Expert' : percentage >= 60 ? 'Advanced' : percentage >= 40 ? 'Intermediate' : 'Beginner';
    
    return (
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.completeContainer}>
          <Trophy size={64} color={Colors.primary} />
          <Text style={styles.completeTitle}>Congratulations!</Text>
          <Text style={styles.completeSubtitle}>You've escaped the fraud trap!</Text>
          
          <View style={styles.finalStats}>
            <View style={styles.finalStatItem}>
              <Text style={styles.finalStatNumber}>{score}</Text>
              <Text style={styles.finalStatLabel}>Total Score</Text>
            </View>
            <View style={styles.finalStatItem}>
              <Text style={styles.finalStatNumber}>{correctAnswers}/{gameLevels.length}</Text>
              <Text style={styles.finalStatLabel}>Correct Answers</Text>
            </View>
            <View style={styles.finalStatItem}>
              <Text style={styles.finalStatNumber}>{percentage.toFixed(0)}%</Text>
              <Text style={styles.finalStatLabel}>Accuracy</Text>
            </View>
          </View>

          <View style={styles.ratingContainer}>
            <Text style={styles.ratingTitle}>Your Security Rating:</Text>
            <Text style={[styles.ratingText, { color: Colors.primary }]}>{rating}</Text>
          </View>

          <View style={styles.achievementContainer}>
            <Text style={styles.achievementTitle}>What you've learned:</Text>
            <View style={styles.achievement}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.achievementText}>How to identify phone scams</Text>
            </View>
            <View style={styles.achievement}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.achievementText}>QR code fraud detection</Text>
            </View>
            <View style={styles.achievement}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.achievementText}>Phishing email recognition</Text>
            </View>
            <View style={styles.achievement}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.achievementText}>Investment scam awareness</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.playAgainButton} onPress={handleRestart}>
              <Text style={styles.playAgainButtonText}>Play Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.learnMoreButton} onPress={() => router.push('/(tabs)/learn')}>
              <Text style={styles.learnMoreButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Financial Escape Room</Text>
        <View style={styles.headerRight} />
      </View>

      {!gameStarted && renderGameIntro()}
      {gameStarted && !gameCompleted && renderGameLevel()}
      {gameCompleted && renderGameComplete()}
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
    padding: 30,
  },
  gameIcon: {
    marginBottom: 20,
  },
  gameTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    textAlign: 'center',
    marginBottom: 12,
  },
  gameDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  gameStats: {
    flexDirection: 'row',
    gap: 40,
    marginBottom: 30,
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
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  rulesContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  rulesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  rule: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  ruleText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
  },
  levelSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 2,
  },
  gameProgress: {
    alignItems: 'flex-end',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  timerText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  scoreText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
  },
  scenarioContainer: {
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
  scenarioTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 12,
  },
  scenarioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  questionContainer: {
    padding: 20,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: Colors.success,
  },
  wrongOption: {
    borderColor: Colors.error,
    backgroundColor: Colors.error,
  },
  optionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontFamily: 'Inter-SemiBold',
  },
  correctOptionText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  wrongOptionText: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  resultContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginTop: 8,
  },
  pointsEarned: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.success,
    marginTop: 4,
  },
  explanationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.gray100,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12,
  },
  explanationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    lineHeight: 20,
    flex: 1,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  completeContainer: {
    alignItems: 'center',
    padding: 30,
  },
  completeTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginTop: 20,
    marginBottom: 8,
  },
  completeSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginBottom: 30,
  },
  finalStats: {
    flexDirection: 'row',
    gap: 30,
    marginBottom: 30,
  },
  finalStatItem: {
    alignItems: 'center',
  },
  finalStatNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.primary,
  },
  finalStatLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginTop: 4,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  achievementContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    width: '100%',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  achievementTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  achievementText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  playAgainButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  playAgainButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  learnMoreButton: {
    flex: 1,
    backgroundColor: Colors.gray200,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  learnMoreButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray700,
  },
});