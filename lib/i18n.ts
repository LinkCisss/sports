import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import zh from '../locales/zh.json';

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

const LANGUAGE_STORE_KEY = 'app_language';

const initI18n = async () => {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORE_KEY);
  
  // 默认使用中文 (zh)，如果本地有存储则使用存储的，否则尝试用系统语言
  const deviceLang = Localization.getLocales()[0]?.languageCode;
  const initialLang = savedLanguage || (deviceLang === 'zh' ? 'zh' : 'en'); // 默认如果系统不是 zh 就 fallback 到 en，但要求默认是 zh，所以：
  const defaultLang = savedLanguage || 'zh';

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: defaultLang,
      fallbackLng: 'zh',
      interpolation: {
        escapeValue: false, // React 已经自带 XSS 防护
      },
      compatibilityJSON: 'v3', // 解决 Android 端的一些兼容性问题
    } as any);
};

initI18n();

export default i18n;
