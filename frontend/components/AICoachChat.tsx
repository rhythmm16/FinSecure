import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Bot, User, X } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface AICoachChatProps {
  onClose: () => void;
}

export default function AICoachChat({ onClose }: AICoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI Security Coach. I can help you with financial security questions, fraud prevention, and general financial advice. How can I assist you today?',
      isBot: true,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');

  const predefinedResponses: { [key: string]: string } = {
    'otp': 'Never share your OTP with anyone! Banks and legitimate services will never ask for your OTP over phone calls, emails, or SMS. OTPs are meant only for you to complete transactions.',
    'phishing': 'Phishing attempts often come through emails or messages with urgent language. Look for poor grammar, suspicious links, and always verify the sender\'s identity before clicking any links.',
    'upi': 'For UPI safety: Always verify the merchant name, double-check the amount, never accept money requests from unknown contacts, and be cautious of QR codes from untrusted sources.',
    'investment': 'Be wary of investment schemes promising guaranteed high returns. Research thoroughly, check regulatory approvals, and never invest more than you can afford to lose.',
    'default': 'That\'s a great question about financial security! Here are some general tips: Always verify before you trust, keep your personal information private, use strong passwords, and regularly monitor your accounts.'
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

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Simulate bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

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
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color={Colors.gray600} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
          {messages.map(renderMessage)}
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
          />
          <TouchableOpacity 
            style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.5 }]}
            onPress={sendMessage}
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
  messagesContainer: {
    flex: 1,
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
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageSender: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: Colors.gray600,
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