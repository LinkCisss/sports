const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// 修复 Expo 50+ 中 Supabase Realtime 内部模块解析失败的问题
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
