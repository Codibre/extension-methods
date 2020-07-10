export interface ProxyReference {
  [key: string]: any;
}

export interface Extender<T extends object> {
  get(target: T, name: string): any;
}

function getExtender<P extends ProxyReference>(proxyReference: P): Extender<P> {
  return {
    get<T extends object>(target: T, name: string) {
      if (name in target) {
        const value = target[name as keyof T];
        return typeof value === 'function' ? value.bind(target) : value;
      }
      if (name in proxyReference) {
        const value = proxyReference[name];
        return typeof value === 'function'
          ? function (...args: any[]) {
              return value(target, ...args);
            }
          : value;
      }
    },
  };
}

export type ExtendedObject<RealObject, Extension> = {
  [key in keyof Extension]: any;
} &
  RealObject;

function extend<T extends object, V extends object>(
  obj: T,
  extender: Extender<V>,
): ExtendedObject<T, V> {
  return new Proxy(obj, extender as object) as ExtendedObject<T, V>;
}

export { extend, getExtender };
