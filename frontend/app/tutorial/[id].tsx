import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Pause, RotateCcw, CircleCheck as CheckCircle, Clock, Star, ChevronRight } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppContext } from '@/context/AppContext';
import { Video, ResizeMode } from 'expo-av';

const { width } = Dimensions.get('window');

export default function TutorialDetail() {
  const { id } = useLocalSearchParams();
  const { tutorials, updateTutorialProgress } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const videoRef = useRef<Video>(null);

  const tutorial = tutorials.find(t => t.id === parseInt(id as string));

  useEffect(() => {
    if (tutorial) {
      setCurrentProgress(tutorial.progress);
    }
  }, [tutorial]);

  if (!tutorial) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Tutorial not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleVideoProgress = (status: any) => {
    if (status.isLoaded && status.durationMillis) {
      const progress = (status.positionMillis / status.durationMillis) * 100;
      setCurrentProgress(progress);
      updateTutorialProgress(tutorial.id, progress);
    }
  };

  const handlePlayPause = async () => {
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleRestart = async () => {
    if (videoRef.current) {
      await videoRef.current.setPositionAsync(0);
      setCurrentProgress(0);
      updateTutorialProgress(tutorial.id, 0);
    }
  };

  const quizQuestions = [
    {
      question: "What is the 50/30/20 budgeting rule?",
      options: [
        "50% needs, 30% wants, 20% savings",
        "50% savings, 30% needs, 20% wants",
        "50% wants, 30% savings, 20% needs",
        "50% investments, 30% needs, 20% wants"
      ],
      correct: 0
    },
    {
      question: "How often should you review your budget?",
      options: [
        "Once a year",
        "Every 6 months",
        "Monthly",
        "Weekly"
      ],
      correct: 2
    }
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setQuizCompleted(true);
      updateTutorialProgress(tutorial.id, 100);
    }
  };

  const renderQuiz = () => {
    if (quizCompleted) {
      const percentage = (quizScore / quizQuestions.length) * 100;
      return (
        <View style={styles.quizContainer}>
          <View style={styles.quizCompleted}>
            <CheckCircle size={48} color={Colors.success} />
            <Text style={styles.quizCompletedTitle}>Quiz Completed!</Text>
            <Text style={styles.quizScore}>
              You scored {quizScore} out of {quizQuestions.length} ({percentage.toFixed(0)}%)
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => router.back()}
            >
              <Text style={styles.continueButtonText}>Continue Learning</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    const question = quizQuestions[currentQuestion];
    return (
      <View style={styles.quizContainer}>
        <View style={styles.quizHeader}>
          <Text style={styles.quizProgress}>
            Question {currentQuestion + 1} of {quizQuestions.length}
          </Text>
          <View style={styles.quizProgressBar}>
            <View 
              style={[
                styles.quizProgressFill, 
                { width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
        
        <Text style={styles.questionText}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedAnswer === index && styles.selectedOption
              ]}
              onPress={() => handleAnswerSelect(index)}
            >
              <Text style={[
                styles.optionText,
                selectedAnswer === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <TouchableOpacity
          style={[
            styles.nextButton,
            { opacity: selectedAnswer !== null ? 1 : 0.5 }
          ]}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          <Text style={styles.nextButtonText}>
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Complete Quiz'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backIcon} onPress={() => router.back()}>
          <ArrowLeft size={24} color={Colors.gray800} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tutorial.title}</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            style={styles.video}
            source={{ uri: tutorial.videoUrl || 'https://videos.pexels.com/video-files/3196036/3196036-uhd_2560_1440_25fps.mp4' }}
            useNativeControls={false}
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
            onPlaybackStatusUpdate={handleVideoProgress}
          />
          
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlButton} onPress={handleRestart}>
              <RotateCcw size={20} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.playButton} onPress={handlePlayPause}>
              {isPlaying ? (
                <Pause size={24} color={Colors.white} />
              ) : (
                <Play size={24} color={Colors.white} />
              )}
            </TouchableOpacity>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${currentProgress}%` }]} 
                />
              </View>
              <Text style={styles.progressText}>{currentProgress.toFixed(0)}%</Text>
            </View>
          </View>
        </View>

        {/* Tutorial Info */}
        <View style={styles.tutorialInfo}>
          <View style={styles.tutorialHeader}>
            <Text style={styles.tutorialTitle}>{tutorial.title}</Text>
            <View style={styles.tutorialMeta}>
              <View style={styles.metaItem}>
                <Clock size={16} color={Colors.gray500} />
                <Text style={styles.metaText}>{tutorial.duration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Star size={16} color={Colors.gray500} />
                <Text style={styles.metaText}>{tutorial.level}</Text>
              </View>
            </View>
          </View>
          
          <Text style={styles.tutorialDescription}>{tutorial.description}</Text>
          
          {/* Learning Objectives */}
          <View style={styles.objectivesContainer}>
            <Text style={styles.objectivesTitle}>What you'll learn:</Text>
            <View style={styles.objective}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.objectiveText}>Fundamental budgeting principles</Text>
            </View>
            <View style={styles.objective}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.objectiveText}>How to track income and expenses</Text>
            </View>
            <View style={styles.objective}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.objectiveText}>Setting realistic financial goals</Text>
            </View>
            <View style={styles.objective}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={styles.objectiveText}>Creating emergency funds</Text>
            </View>
          </View>

          {/* Quiz Section */}
          {currentProgress >= 80 && !showQuiz && (
            <TouchableOpacity 
              style={styles.quizButton}
              onPress={() => setShowQuiz(true)}
            >
              <Text style={styles.quizButtonText}>Take Quiz to Complete</Text>
              <ChevronRight size={20} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {showQuiz && renderQuiz()}

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
  backIcon: {
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
  videoContainer: {
    backgroundColor: Colors.gray900,
    position: 'relative',
  },
  video: {
    width: width,
    height: width * 0.56, // 16:9 aspect ratio
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  controlButton: {
    padding: 8,
    marginRight: 12,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: Colors.white,
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    minWidth: 40,
  },
  tutorialInfo: {
    padding: 20,
  },
  tutorialHeader: {
    marginBottom: 16,
  },
  tutorialTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginBottom: 8,
  },
  tutorialMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray500,
  },
  tutorialDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    lineHeight: 24,
    marginBottom: 24,
  },
  objectivesContainer: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  objectivesTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 16,
  },
  objective: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  objectiveText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
    flex: 1,
  },
  quizButton: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  quizContainer: {
    backgroundColor: Colors.white,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  quizHeader: {
    marginBottom: 24,
  },
  quizProgress: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: Colors.primary,
    marginBottom: 8,
  },
  quizProgressBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: 2,
  },
  quizProgressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  questionText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
    marginBottom: 24,
    lineHeight: 26,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionButton: {
    backgroundColor: Colors.gray100,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray700,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontFamily: 'Inter-SemiBold',
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
  quizCompleted: {
    alignItems: 'center',
  },
  quizCompletedTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: Colors.gray800,
    marginTop: 16,
    marginBottom: 8,
  },
  quizScore: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray600,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  bottomSpacing: {
    height: 20,
  },
});