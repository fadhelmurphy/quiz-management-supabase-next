'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/layout/header';

type Question = {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
};

type Quiz = {
  id: string;
  title: string;
  questions: Question[];
};

export default function QuizPage() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', id)
        .single();

      if (quizError) throw quizError;

      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', id);

      if (questionsError) throw questionsError;

      setQuiz({
        ...quizData,
        questions: questionsData,
      });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({ title: 'Error', description: 'User not authenticated' });
        return;
      }

      if (!quiz) return;

      const score = quiz.questions.reduce((acc, question) => {
        return acc + (answers[question.id] === question.correct_answer ? 1 : 0);
      }, 0);

      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          quiz_id: quiz.id,
          user_id: user.id,
          score,
          answers,
        });

      if (error) throw error;

      router.push(`/quiz/${id}/results?score=${score}&total=${quiz.questions.length}`);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!quiz) {
    return <div>Quiz not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>
          <div className="space-y-6">
            {quiz.questions.map((question, index) => (
              <div key={question.id} className="space-y-4">
                <h2 className="text-lg font-semibold">
                  {index + 1}. {question.question_text}
                </h2>
                <RadioGroup
                  value={answers[question.id]?.toString()}
                  onValueChange={(value) =>
                    setAnswers({ ...answers, [question.id]: parseInt(value) })
                  }
                >
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={optionIndex.toString()}
                        id={`${question.id}-${optionIndex}`}
                      />
                      <Label htmlFor={`${question.id}-${optionIndex}`}>
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Button
              onClick={handleSubmit}
              disabled={
                submitting ||
                quiz.questions.length !== Object.keys(answers).length
              }
            >
              {t('quiz.submit')}
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
}