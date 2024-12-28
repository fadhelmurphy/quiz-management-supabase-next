'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Typography, Space } from 'antd';
import { useRouter } from 'next/navigation';
import { LanguageToggle } from '@/components/ui/language-toggle';
import { BookOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Home() {
  const { t } = useLanguage();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100">
      <LanguageToggle />
      
      <div className="text-center space-y-6 max-w-3xl px-4">
        <div className="flex items-center justify-center mb-8">
          <BookOutlined style={{ fontSize: '48px' }} />
        </div>
        
        <Title level={1}>Quiz Builder</Title>
        <Paragraph style={{ fontSize: '18px', color: 'rgba(0, 0, 0, 0.45)' }}>
          {t('quiz.description')}
        </Paragraph>

        <Space size="middle" className="mt-8">
          <Button type="primary" size="large" onClick={() => router.push('/login')}>
            {t('login')}
          </Button>
          <Button size="large" onClick={() => router.push('/register')}>
            {t('register')}
          </Button>
        </Space>
      </div>
    </div>
  );
}