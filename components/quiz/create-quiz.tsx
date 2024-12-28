'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Form, Input, Button, Card, Space, InputNumber } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { supabase } from '@/lib/supabase/client';
import { message } from 'antd';
import { useRouter } from 'next/navigation';

const questionSchema = z.object({
  questionText: z.string().min(1),
  options: z.array(z.string()).min(2),
  correctAnswer: z.number().min(0),
});

const formSchema = z.object({
  title: z.string().min(1),
  questions: z.array(questionSchema).min(1),
});

export function CreateQuiz() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, watch, setValue, getValues } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      questions: [{ questionText: '', options: ['', ''], correctAnswer: 0 }],
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        message.error('User not authenticated');
        return;
      }

      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .insert({ title: values.title, user_id: user.id })
        .select()
        .single();

      if (quizError) throw quizError;

      const questions = values.questions.map((q) => ({
        quiz_id: quiz.id,
        question_text: q.questionText,
        options: q.options,
        correct_answer: q.correctAnswer,
      }));

      const { error: questionsError } = await supabase
        .from('questions')
        .insert(questions);

      if (questionsError) throw questionsError;

      message.success('Quiz created successfully');
      router.refresh();
      setValue('title', '');
      setValue('questions', [{ questionText: '', options: ['', ''], correctAnswer: 0 }]);
    } catch (error: any) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          render={({ field, fieldState }) => (
            <Form.Item
              label={t('quiz.title')}
              validateStatus={fieldState.error ? 'error' : ''}
              help={fieldState.error?.message}
            >
              <Input {...field} />
            </Form.Item>
          )}
        />

        {watch('questions').map((_, index) => (
          <Card key={index} size="small" className="mb-4">
            <Controller
              name={`questions.${index}.questionText`}
              control={control}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={t('quiz.question')}
                  validateStatus={fieldState.error ? 'error' : ''}
                  help={fieldState.error?.message}
                >
                  <Input {...field} />
                </Form.Item>
              )}
            />

            {watch(`questions.${index}.options`).map((_, optionIndex) => (
              <Controller
                key={optionIndex}
                name={`questions.${index}.options.${optionIndex}`}
                control={control}
                render={({ field, fieldState }) => (
                  <Form.Item
                    label={`${t('quiz.options')} ${optionIndex + 1}`}
                    validateStatus={fieldState.error ? 'error' : ''}
                    help={fieldState.error?.message}
                  >
                    <Input {...field} />
                  </Form.Item>
                )}
              />
            ))}

            <Controller
              name={`questions.${index}.correctAnswer`}
              control={control}
              render={({ field, fieldState }) => (
                <Form.Item
                  label={t('quiz.correctAnswer')}
                  validateStatus={fieldState.error ? 'error' : ''}
                  help={fieldState.error?.message}
                >
                  <InputNumber
                    {...field}
                    min={0}
                    max={watch(`questions.${index}.options`).length - 1}
                  />
                </Form.Item>
              )}
            />

            <Space className="mt-4">
              <Button
                type="dashed"
                onClick={() => {
                  const questions = getValues('questions');
                  questions[index].options.push('');
                  setValue('questions', [...questions]);
                }}
                icon={<PlusOutlined />}
              >
                {t('quiz.addOption')}
              </Button>

              {index > 0 && (
                <Button
                  danger
                  onClick={() => {
                    const questions = getValues('questions');
                    questions.splice(index, 1);
                    setValue('questions', [...questions]);
                  }}
                  icon={<DeleteOutlined />}
                >
                  {t('quiz.removeQuestion')}
                </Button>
              )}
            </Space>
          </Card>
        ))}

        <Space className="mt-4">
          <Button
            type="dashed"
            onClick={() => {
              const questions = getValues('questions');
              questions.push({
                questionText: '',
                options: ['', ''],
                correctAnswer: 0,
              });
              setValue('questions', [...questions]);
            }}
            icon={<PlusOutlined />}
          >
            {t('quiz.addQuestion')}
          </Button>

          <Button type="primary" htmlType="submit" loading={loading}>
            {t('quiz.save')}
          </Button>
        </Space>
      </Form>
    </Card>
  );
}