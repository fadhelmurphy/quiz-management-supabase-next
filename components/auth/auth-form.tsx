'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

const { Title } = Typography;

type AuthFormProps = {
  type: 'login' | 'register';
};

type FormValues = {
  email: string;
  password: string;
  username?: string;
};

export function AuthForm({ type }: AuthFormProps) {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: FormValues) => {
    try {
      setLoading(true);
      if (type === 'register') {
        const { error: signUpError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              username: values.username,
            },
          },
        });
        if (signUpError) throw signUpError;
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (signInError) throw signInError;
      }
      router.push('/dashboard');
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ width: 400 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 24 }}>
        {t(type)}
      </Title>
      <Form
        name="auth"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        {type === 'register' && (
          <Form.Item
            name="username"
            rules={[{ required: true, message: t('errors.required') }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder={t('username')}
              size="large"
            />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          rules={[
            { required: true, message: t('errors.required') },
            { type: 'email', message: t('errors.invalidEmail') }
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder={t('email')}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            { required: true, message: t('errors.required') },
            { min: 6, message: t('errors.passwordLength') }
          ]}
        >
          <Input.Password 
            prefix={<LockOutlined />} 
            placeholder={t('password')}
            size="large"
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
            size="large"
          >
            {t('submit')}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}