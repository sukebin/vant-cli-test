import { get, set } from 'lodash-es';

export const getProp = <T = any>(
  obj: Record<string, any>,
  path: string[] | string,
  defaultValue?: any
): { value: T } => ({
  get value() {
    return get(obj, path, defaultValue);
  },
  set value(val: any) {
    set(obj, path, val);
  },
});
