import type { App } from 'vue';
import { apice } from '../config/api';

export * from './routingEvent';

export const apicePlugin = {
  install(app: App, options: any) {
    const mergeApis = Object.assign(apice, options);
    app.provide('smApice', mergeApis);
  },
};

// 组件库配置
type LibraryConfig = {
  scene: 'normal' | 'selectPreview';
};
type LibraryConfigKey = keyof LibraryConfig;

export const libraryConfig: LibraryConfig = {
  scene: 'normal',
};
export function setupLibraryConfig<K extends LibraryConfigKey>(
  key: K,
  val: LibraryConfig[K]
) {
  libraryConfig[key] = val;
}
