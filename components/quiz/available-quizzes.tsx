'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, Button, List, message } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type Quiz = {
  id: string;
  title: string;
  created_at: string;
  profiles: {
    username: string;
  };
};

export function AvailableQuizzes() {
  const { t } = useLanguage();
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .select(`
          *,
          profiles (
            username
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <List
      loading={loading}
      dataSource={quizzes}
      renderItem={(quiz) => (
        <List.Item>
          <Card style={{ width: '100%' }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{quiz.title}</h3>
                <p className="text-sm text-gray-500">
                  {t('by')} {quiz.profiles?.username || 'Anonymous'}
                </p>
              </div>
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={() => router.push(`/quiz/${quiz.id}`)}
              >
                {t('quiz.takeQuiz')}
              </Button>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}