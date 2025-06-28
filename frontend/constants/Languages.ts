export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
];

export const translations = {
  en: {
    dashboard: 'Dashboard',
    welcome: 'Welcome to FinSecure',
    fraudAlerts: 'Fraud Alerts',
    savingsGoals: 'Savings Goals',
    learningProgress: 'Learning Progress',
    quickActions: 'Quick Actions',
    scanQR: 'Scan QR Code',
    chatCoach: 'AI Coach',
    checkBreach: 'Check Breach',
    tutorials: 'Tutorials',
    guides: 'Guides',
    quizzes: 'Quizzes',
    fraudSimulation: 'Fraud Simulation',
    goalPlanner: 'Goal Planner',
    settings: 'Settings',
  },
  hi: {
    dashboard: 'डैशबोर्ड',
    welcome: 'FinSecure में आपका स्वागत है',
    fraudAlerts: 'धोखाधड़ी अलर्ट',
    savingsGoals: 'बचत लक्ष्य',
    learningProgress: 'सीखने की प्रगति',
    quickActions: 'त्वरित कार्य',
    scanQR: 'QR कोड स्कैन करें',
    chatCoach: 'AI कोच',
    checkBreach: 'ब्रीच जांचें',
    tutorials: 'ट्यूटोरियल',
    guides: 'गाइड',
    quizzes: 'प्रश्नोत्तरी',
    fraudSimulation: 'धोखाधड़ी सिमुलेशन',
    goalPlanner: 'लक्ष्य योजनाकार',
    settings: 'सेटिंग्स',
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ',
    welcome: 'FinSecure ਵਿੱਚ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ',
    fraudAlerts: 'ਧੋਖਾਧੜੀ ਅਲਰਟ',
    savingsGoals: 'ਬਚਤ ਟੀਚੇ',
    learningProgress: 'ਸਿੱਖਣ ਦੀ ਪ੍ਰਗਤੀ',
    quickActions: 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
    scanQR: 'QR ਕੋਡ ਸਕੈਨ ਕਰੋ',
    chatCoach: 'AI ਕੋਚ',
    checkBreach: 'ਬਰੀਚ ਚੈਕ ਕਰੋ',
    tutorials: 'ਟਿਊਟੋਰਿਅਲ',
    guides: 'ਗਾਈਡ',
    quizzes: 'ਕੁਇਜ਼',
    fraudSimulation: 'ਧੋਖਾਧੜੀ ਸਿਮੂਲੇਸ਼ਨ',
    goalPlanner: 'ਟੀਚਾ ਯੋਜਨਾਕਾਰ',
    settings: 'ਸੈਟਿੰਗਜ਼',
  },
};