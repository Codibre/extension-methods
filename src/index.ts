export interface ProxyReference {
  [key: string]: any;
}

export interface Extender<T extends object> {
  get(target: T, name: string): any;
}

function getExtender<P extends ProxyReference>(proxyReference: P): Extender<P> {
  return {
    get<T extends object>(target: T, name: string) {
      const value =
        name in target ? target[name as keyof T] : proxyReference[name];
      return typeof value === 'function' ? value.bind(target) : value;
    },
  };
}

export type ExtendedObject<RealObject, Extension> = Extension & RealObject;

function extend<RealObject extends object, Extension extends object>(
  obj: RealObject,
  extender: Extender<Extension>,
): RealObject & Extension {
  return new Proxy(obj, extender as object) as RealObject & Extension;
}

export { extend, getExtender };
