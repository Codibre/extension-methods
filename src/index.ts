export interface ProxyReference {
  [key: string]: any;
}

export interface Extender<_Extension extends ProxyReference> {
  get<T extends object>(target: T, name: string): any;
}

export interface FunctionCook {
  <T extends object>(value: Function, target: T): Function;
}

export function defaultCookFunction<T extends object>(
  value: Function,
  target: T,
): Function {
  return value.bind(target);
}

export type PriorityOptions = 'extender' | 'object';

/**
 * Returns an instance of Extender<P> to be used to extend objects
 * @typeparam P Type of the ProxyReference
 * @param proxyReference The ProxyReference from where the extension method will be retrieved
 * @param cookFunction a function to prepare functions to be returned. By default, all functions returns bound with target
 * @param priority defines wether object will have priority in method choosing: target object (default) or the extender
 */
function getExtender<P extends ProxyReference>(
  proxyReference: P,
  cookFunction: FunctionCook = defaultCookFunction,
  priority: PriorityOptions = 'object',
): Extender<P> {
  return {
    get:
      priority === 'object'
        ? <T extends object>(target: T, name: string) => {
            const value =
              name in target ? target[name as keyof T] : proxyReference[name];
            return typeof value === 'function'
              ? cookFunction(value, target)
              : value;
          }
        : <T extends object>(target: T, name: string) => {
            const value =
              name in proxyReference
                ? proxyReference[name]
                : target[name as keyof T];
            return typeof value === 'function'
              ? cookFunction(value, target)
              : value;
          },
  };
}

export type ExtendedObject<RealObject, Extension> = Extension & RealObject;

/**
 * @typeparam RealObject the type of the object referenced
 * @typeparam Extension the type of Extender
 * @param obj the object to be extended
 * @param extender the Extender instance
 */
function extend<RealObject extends object, Extension extends object>(
  obj: RealObject,
  extender: Extender<Extension>,
): ExtendedObject<RealObject, Extension> {
  return new Proxy(obj, extender as object) as ExtendedObject<
    RealObject,
    Extension
  >;
}

type ClassRef<T extends object> = new (...args: any[]) => T;

function extendClass<
  T extends object,
  ClassType extends ClassRef<T>,
  Extension extends object
>(classRef: ClassType, extender: Extender<Extension>): ClassType {
  return new Proxy(classRef, {
    construct(target: any, argArray: any) {
      return extend(new target(...argArray), extender);
    },
  });
}

export { extend, extendClass, getExtender };
