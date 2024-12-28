'use client';

import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/header';
import { useRouter } from 'next/navigation';

export default function QuizResultsPage() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const score = searchParams.get('score');
  const total = searchParams.get('total');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6 max-w-md mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">{t('quiz.results')}</h1>
          <p className="text-4xl font-bold mb-6">
            {score} / {total}
          </p>
          <p className="text-lg mb-6">
            {t('quiz.scoreMessage', {
              score,
              total,
              percentage: Math.round((Number(score) / Number(total)) * 100),
            })}
          </p>
          <Button onClick={() => router.push('/dashboard')}>
            {t('quiz.backToDashboard')}
          </Button>
        </Card>
      </main>
    </div>
  );
}