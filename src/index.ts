export interface ProxyReference {
  [key: string]: any;
}

export interface Extender<T extends object> {
  get(target: T, name: string): any;
}

export interface FunctionCook {
  <T extends object>(value: Function, target: T): Function;
}

function defaultCookFunction<T extends object>(
  value: Function,
  target: T,
): Function {
  return value.bind(target);
}

/**
 * Returns an instance of Extender<P> to be used to extend objects
 * @typeparam P Type of the ProxyReference
 * @param proxyReference The ProxyReference from where the extension method will be retrieved
 * @param cookFunction a function to prepare functions to be returned. By default, all functions returns bound with target
 */
function getExtender<P extends ProxyReference>(
  proxyReference: P,
  cookFunction: FunctionCook = defaultCookFunction,
): Extender<P> {
  return {
    get<T extends object>(target: T, name: string) {
      const value =
        name in target ? target[name as keyof T] : proxyReference[name];
      return typeof value === 'function' ? cookFunction(value, target) : value;
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
): RealObject & Extension {
  return new Proxy(obj, extender as object) as RealObject & Extension;
}

export { extend, getExtender };
