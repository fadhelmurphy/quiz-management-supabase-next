export const translations = {
  en: {
    common: {
      login: 'Login',
      register: 'Register',
      email: 'Email',
      password: 'Password',
      submit: 'Submit',
      logout: 'Logout',
      username: 'Username',
      edit: 'Edit',
      delete: 'Delete',
      by: 'by',
    },
    quiz: {
      create: 'Create Quiz',
      title: 'Quiz Title',
      addQuestion: 'Add Question',
      question: 'Question',
      options: 'Option',
      correctAnswer: 'Correct Answer (0-based index)',
      save: 'Save Quiz',
      myQuizzes: 'My Quizzes',
      takeQuiz: 'Take Quiz',
      viewResults: 'View Results',
      score: 'Score',
      submit: 'Submit Answers',
      results: 'Quiz Results',
      backToDashboard: 'Back to Dashboard',
      addOption: 'Add Option',
      removeQuestion: 'Remove Question',
      scoreMessage: 'You scored {{score}} out of {{total}} ({{percentage}}%)',
      description: 'Create, share, and take quizzes with our easy-to-use platform',
    },
    errors: {
      required: 'This field is required',
      invalidEmail: 'Invalid email address',
      passwordLength: 'Password must be at least 6 characters',
    },
  },
  ar: {
    common: {
      login: 'تسجيل الدخول',
      register: 'التسجيل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      submit: 'إرسال',
      logout: 'تسجيل الخروج',
      username: 'اسم المستخدم',
      edit: 'تعديل',
      delete: 'حذف',
      by: 'بواسطة',
    },
    quiz: {
      create: 'إنشاء اختبار',
      title: 'عنوان الاختبار',
      addQuestion: 'إضافة سؤال',
      question: 'سؤال',
      options: 'خيار',
      correctAnswer: 'الإجابة الصحيحة',
      save: 'حفظ الاختبار',
      myQuizzes: 'اختباراتي',
      takeQuiz: 'بدء الاختبار',
      viewResults: 'عرض النتائج',
      score: 'النتيجة',
      submit: 'إرسال الإجابات',
      results: 'نتائج الاختبار',
      backToDashboard: 'العودة إلى لوحة التحكم',
      addOption: 'إضافة خيار',
      removeQuestion: 'حذف السؤال',
      scoreMessage: 'حصلت على {{score}} من {{total}} ({{percentage}}%)',
      description: 'قم بإنشاء ومشاركة وحل الاختبارات باستخدام منصتنا سهلة الاستخدام',
    },
    errors: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صالح',
      passwordLength: 'يجب أن تكون كلمة المرور 6 أحرف على الأقل',
    },
  },
};

export type Language = 'en' | 'ar';
export type TranslationKey = keyof typeof translations.en;