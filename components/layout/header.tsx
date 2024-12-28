'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Layout, Space, Select } from 'antd';
import { LogoutOutlined, GlobalOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

const { Header: AntHeader } = Layout;

export function Header() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  return (
    <AntHeader className="bg-white border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quiz Builder</h1>
        <Space>
          <Select
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: 'English' },
              { value: 'ar', label: 'العربية' },
            ]}
            prefix={<GlobalOutlined />}
          />
          <Button 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            {t('logout')}
          </Button>
        </Space>
      </div>
    </AntHeader>
  );
}