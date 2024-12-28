'use client';

import { Header } from '@/components/layout/header';
import { useLanguage } from '@/contexts/LanguageContext';
import { MyQuizzes } from '@/components/quiz/my-quizzes';
import { CreateQuiz } from '@/components/quiz/create-quiz';
import { AvailableQuizzes } from '@/components/quiz/available-quizzes';
import { Tabs } from 'antd';

export default function DashboardPage() {
  const { t } = useLanguage();

  const items = [
    {
      key: 'available',
      label: t('quiz.takeQuiz'),
      children: <AvailableQuizzes />,
    },
    {
      key: 'my-quizzes',
      label: t('quiz.myQuizzes'),
      children: <MyQuizzes />,
    },
    {
      key: 'create',
      label: t('quiz.create'),
      children: <CreateQuiz />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultActiveKey="available" items={items} />
      </main>
    </div>
  );
}