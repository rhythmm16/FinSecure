import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, X, MessageCircle, Shield, TrendingUp, CreditCard } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { useLanguage } from '@/hooks/useLanguage';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  suggestions?: string[];
}

export default function AICoach() {
  const { currentLanguage } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: currentLanguage === 'hi' 
        ? 'नमस्ते! मैं आपका AI सिक्योरिटी कोच हूं। मैं आपकी वित्तीय सुरक्षा, धोखाधड़ी की रोकथाम, और सामान्य वित्तीय सलाह में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?'
        : currentLanguage === 'pa'
        ? 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਸਿਕਿਉਰਿਟੀ ਕੋਚ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਵਿੱਤੀ ਸੁਰੱਖਿਆ, ਧੋਖਾਧੜੀ ਦੀ ਰੋਕਥਾਮ, ਅਤੇ ਆਮ ਵਿੱਤੀ ਸਲਾਹ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਅੱਜ ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਸਹਾਇਤਾ ਕਰ ਸਕਦਾ ਹਾਂ?'
        : 'Hello! I\'m your AI Security Coach. I can help you with financial security questions, fraud prevention, and general financial advice. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
      suggestions: [
        'How to identify OTP fraud?',
        'UPI payment safety tips',
        'Investment scam warning signs',
        'Phishing email detection'
      ]
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const quickTopics = [
    { icon: Shield, label: 'OTP Safety', query: 'How to protect myself from OTP fraud?' },
    { icon: CreditCard, label: 'UPI Security', query: 'What are UPI payment safety tips?' },
    { icon: TrendingUp, label: 'Investment Scams', query: 'How to identify investment scams?' },
    { icon: MessageCircle, label: 'Phishing', query: 'How to detect phishing attempts?' },
  ];

  const predefinedResponses: { [key: string]: string } = {
    'otp': currentLanguage === 'hi' 
      ? 'अपना OTP कभी किसी के साथ साझा न करें! बैंक और वैध सेवाएं कभी भी फोन कॉल, ईमेल या SMS के माध्यम से आपका OTP नहीं मांगेंगे। OTP केवल आपके लिए लेनदेन पूरा करने के लिए है।'
      : currentLanguage === 'pa'
      ? 'ਆਪਣਾ OTP ਕਦੇ ਵੀ ਕਿਸੇ ਨਾਲ ਸਾਂਝਾ ਨਾ ਕਰੋ! ਬੈਂਕ ਅਤੇ ਜਾਇਜ਼ ਸੇਵਾਵਾਂ ਕਦੇ ਵੀ ਫੋਨ ਕਾਲ, ਈਮੇਲ ਜਾਂ SMS ਰਾਹੀਂ ਤੁਹਾਡਾ OTP ਨਹੀਂ ਮੰਗਣਗੀਆਂ। OTP ਸਿਰਫ਼ ਤੁਹਾਡੇ ਲਈ ਲੈਣ-ਦੇਣ ਪੂਰਾ ਕਰਨ ਲਈ ਹੈ।'
      : 'Never share your OTP with anyone! Banks and legitimate services will never ask for your OTP over phone calls, emails, or SMS. OTPs are meant only for you to complete transactions.',
    
    'phishing': currentLanguage === 'hi' 
      ? 'फिशिंग के प्रयास अक्सर तत्काल भाषा के साथ ईमेल या संदेशों के माध्यम से आते हैं। खराब व्याकरण, संदिग्ध लिंक देखें, और किसी भी लिंक पर क्लिक करने से पहले हमेशा भेजने वाले की पहचान सत्यापित करें।'
      : currentLanguage === 'pa'
      ? 'ਫਿਸ਼ਿੰਗ ਦੀਆਂ ਕੋਸ਼ਿਸ਼ਾਂ ਅਕਸਰ ਤੁਰੰਤ ਭਾਸ਼ਾ ਦੇ ਨਾਲ ਈਮੇਲ ਜਾਂ ਸੰਦੇਸ਼ਾਂ ਰਾਹੀਂ ਆਉਂਦੀਆਂ ਹਨ। ਮਾੜੀ ਵਿਆਕਰਣ, ਸ਼ੱਕੀ ਲਿੰਕਾਂ ਨੂੰ ਦੇਖੋ, ਅਤੇ ਕਿਸੇ ਵੀ ਲਿੰਕ \'ਤੇ ਕਲਿੱਕ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਭੇਜਣ ਵਾਲੇ ਦੀ ਪਛਾਣ ਦੀ ਪੁਸ਼ਟੀ ਕਰੋ।'
      : 'Phishing attempts often come through emails or messages with urgent language. Look for poor grammar, suspicious links, and always verify the sender\'s identity before clicking any links.',
    
    'upi': currentLanguage === 'hi' 
      ? 'UPI सुरक्षा के लिए: हमेशा व्यापारी का नाम सत्यापित करें, राशि को दोबारा जांचें, अज्ञात संपर्कों से पैसे के अनुरोध कभी स्वीकार न करें, और अविश्वसनीय स्रोतों से QR कोड से सावधान रहें।'
      : currentLanguage === 'pa'
      ? 'UPI ਸੁਰੱਖਿਆ ਲਈ: ਹਮੇਸ਼ਾ ਵਪਾਰੀ ਦਾ ਨਾਮ ਸਤਿਆਪਿਤ ਕਰੋ, ਰਕਮ ਨੂੰ ਦੁਬਾਰਾ ਜਾਂਚੋ, ਅਣਜਾਣ ਸੰਪਰਕਾਂ ਤੋਂ ਪੈਸੇ ਦੀਆਂ ਬੇਨਤੀਆਂ ਕਦੇ ਸਵੀਕਾਰ ਨਾ ਕਰੋ, ਅਤੇ ਅਵਿਸ਼ਵਾਸਯੋਗ ਸਰੋਤਾਂ ਤੋਂ QR ਕੋਡਾਂ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ।'
      : 'For UPI safety: Always verify the merchant name, double-check the amount, never accept money requests from unknown contacts, and be cautious of QR codes from untrusted sources.',
    
    'investment': currentLanguage === 'hi' 
      ? 'गारंटीशुदा उच्च रिटर्न का वादा करने वाली निवेश योजनाओं से सावधान रहें। पूरी तरह से अनुसंधान करें, नियामक अनुमोदन जांचें, और कभी भी उससे अधिक निवेश न करें जितना आप खो सकते हैं।'
      : currentLanguage === 'pa'
      ? 'ਗਾਰੰਟੀਸ਼ੁਦਾ ਉੱਚ ਰਿਟਰਨ ਦਾ ਵਾਅਦਾ ਕਰਨ ਵਾਲੀਆਂ ਨਿਵੇਸ਼ ਯੋਜਨਾਵਾਂ ਤੋਂ ਸਾਵਧਾਨ ਰਹੋ। ਪੂਰੀ ਤਰ੍ਹਾਂ ਖੋਜ ਕਰੋ, ਨਿਯਾਮਕ ਮਨਜ਼ੂਰੀਆਂ ਦੀ ਜਾਂਚ ਕਰੋ, ਅਤੇ ਕਦੇ ਵੀ ਉਸ ਤੋਂ ਜ਼ਿਆਦਾ ਨਿਵੇਸ਼ ਨਾ ਕਰੋ ਜਿੰਨਾ ਤੁਸੀਂ ਗੁਆ ਸਕਦੇ ਹੋ।'
      : 'Be wary of investment schemes promising guaranteed high returns. Research thoroughly, check regulatory approvals, and never invest more than you can afford to lose.',
    
    'default': currentLanguage === 'hi' 
      ? 'यह वित्तीय सुरक्षा के बारे में एक बेहतरीन सवाल है! यहां कुछ सामान्य सुझाव हैं: भरोसा करने से पहले हमेशा सत्यापित करें, अपनी व्यक्तिगत जानकारी को निजी रखें, मजबूत पासवर्ड का उपयोग करें, और नियमित रूप से अपने खातों की निगरानी करें।'
      : currentLanguage === 'pa'
      ? 'ਇਹ ਵਿੱਤੀ ਸੁਰੱਖਿਆ ਬਾਰੇ ਇੱਕ ਸ਼ਾਨਦਾਰ ਸਵਾਲ ਹੈ! ਇੱਥੇ ਕੁਝ ਆਮ ਸੁਝਾਅ ਹਨ: ਭਰੋਸਾ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਹਮੇਸ਼ਾ ਸਤਿਆਪਿਤ ਕਰੋ, ਆਪਣੀ ਨਿੱਜੀ ਜਾਣਕਾਰੀ ਨੂੰ ਨਿੱਜੀ ਰੱਖੋ, ਮਜ਼ਬੂਤ ਪਾਸਵਰਡ ਵਰਤੋ, ਅਤੇ ਨਿਯਮਿਤ ਤੌਰ \'ਤੇ ਆਪਣੇ ਖਾਤਿਆਂ ਦੀ ਨਿਗਰਾਨੀ ਕਰੋ।'
      : 'That\'s a great question about financial security! Here are some general tips: Always verify before you trust, keep your personal information private, use strong passwords, and regularly monitor your accounts.'
  };

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('otp') || lowerMessage.includes('one time password')) {
      return predefinedResponses.otp;
    }
    if (lowerMessage.includes('phishing') || lowerMessage.includes('email') || lowerMessage.includes('suspicious link')) {
      return predefinedResponses.phishing;
    }
    if (lowerMessage.includes('upi') || lowerMessage.includes('payment') || lowerMessage.includes('qr code')) {
      return predefinedResponses.upi;
    }
    if (lowerMessage.includes('investment') || lowerMessage.includes('scheme') || lowerMessage.includes('returns')) {
      return predefinedResponses.investment;
    }
    
    return predefinedResponses.default;
  };

  const sendMessage = (text?: string) => {
    const messageText = text || inputText;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot typing and response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(messageText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickTopic = (query: string) => {
    sendMessage(query);
  };

  const handleSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isBot ? styles.botMessage : styles.userMessage
    ]}>
      <View style={styles.messageHeader}>
        <View style={[
          styles.messageAvatar,
          { backgroundColor: message.isBot ? Colors.secondary : Colors.primary }
        ]}>
          {message.isBot ? (
            <Bot size={16} color={Colors.white} />
          ) : (
            <User size={16} color={Colors.white} />
          )}
        </View>
        <Text style={styles.messageSender}>
          {message.isBot ? 'AI Coach' : 'You'}
        </Text>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      <View style={[
        styles.messageBubble,
        { backgroundColor: message.isBot ? Colors.gray100 : Colors.primary }
      ]}>
        <Text style={[
          styles.messageText,
          { color: message.isBot ? Colors.gray800 : Colors.white }
        ]}>
          {message.text}
        </Text>
      </View>
      {message.suggestions && (
        <View style={styles.suggestionsContainer}>
          {message.suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              style={styles.suggestionButton}
              onPress={() => handleSuggestion(suggestion)}
            >
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.headerAvatar}>
              <Bot size={20} color={Colors.white} />
            </View>
            <View>
              <Text style={styles.headerTitle}>AI Security Coach</Text>
              <Text style={styles.headerSubtitle}>Online • Ready to help</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
            <X size={24} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        {/* Quick Topics */}
        <View style={styles.quickTopicsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickTopicButton}
                onPress={() => handleQuickTopic(topic.query)}
              >
                <topic.icon size={16} color={Colors.primary} />
                <Text style={styles.quickTopicText}>{topic.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Messages */}
        <ScrollView 
          ref={scrollViewRef}
          style={styles.messagesContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.botMessage]}>
              <View style={styles.messageHeader}>
                <View style={[styles.messageAvatar, { backgroundColor: Colors.secondary }]}>
                  <Bot size={16} color={Colors.white} />
                </View>
                <Text style={styles.messageSender}>AI Coach</Text>
              </View>
              <View style={[styles.messageBubble, { backgroundColor: Colors.gray100 }]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask me about financial security..."
            placeholderTextColor={Colors.gray500}
            multiline
            maxLength={500}
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
            onPress={() => sendMessage()}
            disabled={!inputText.trim()}
          >
            <Send size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray800,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: Colors.success,
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  quickTopicsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  quickTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 8,
  },
  quickTopicText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  botMessage: {
    alignItems: 'flex-start',
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageSender: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
  },
  messageTime: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: Colors.gray400,
    marginLeft: 'auto',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 16,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  suggestionButton: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.primary + '40',
  },
  suggestionText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: Colors.primary,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gray400,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    gap: 12,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: Colors.gray800,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
});