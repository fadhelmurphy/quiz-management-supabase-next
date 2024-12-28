'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, Button, Space, message, List } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase/client';

type Quiz = {
  id: string;
  title: string;
  created_at: string;
};

export function MyQuizzes() {
  const { t } = useLanguage();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        message.error('User not authenticated');
        return;
      }

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuizzes(data || []);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quizzes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setQuizzes(quizzes.filter(quiz => quiz.id !== id));
      message.success('Quiz deleted successfully');
    } catch (error: any) {
      message.error(error.message);
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
                  {new Date(quiz.created_at).toLocaleDateString()}
                </p>
              </div>
              <Space>
                <Button 
                  type="primary" 
                  ghost
                  icon={<EditOutlined />}
                >
                  {t('edit')}
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(quiz.id)}
                >
                  {t('delete')}
                </Button>
              </Space>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );
}