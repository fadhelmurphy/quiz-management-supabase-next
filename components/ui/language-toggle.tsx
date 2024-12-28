'use client';

import { GlobalOutlined } from '@ant-design/icons';
import { Select } from 'antd';
import { useLanguage } from '@/contexts/LanguageContext';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="fixed top-4 right-4 z-50">
      <Select
        value={language}
        onChange={setLanguage}
        options={[
          { value: 'en', label: 'English' },
          { value: 'ar', label: 'العربية' },
        ]}
        suffixIcon={<GlobalOutlined />}
        style={{ width: 120 }}
        dropdownStyle={{ zIndex: 1000 }}
      />
    </div>
  );
}