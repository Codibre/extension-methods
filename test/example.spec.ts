import { ExampleClass } from './example-class.spec';
import { getExtender, extend, extendClass } from '../src';
import { expect } from 'chai';

interface MyObject {
  value: string;
}

interface MyObjectExtended extends MyObject {
  concatFoo(): MyObjectExtended;
  concatBar(): MyObjectExtended;
}

declare module './example-class.spec' {
  interface ExampleClass {
    method1(): number;
  }
}

export const myObjectExtension = getExtender({
  concatFoo(this: MyObject) {
    return extend({ value: `${this.value}_foo` }, myObjectExtension);
  },
  concatBar(this: MyObject) {
    return extend({ value: `${this.value}_bar` }, myObjectExtension);
  },
});

describe('Example test', () => {
  it('should return "my string_foo" and "my string_bar"', () => {
    const extendString: MyObjectExtended = extend(
      { value: 'my string' },
      myObjectExtension,
    );

    expect(extendString.concatFoo().value).to.be.eq('my string_foo');
    expect(extendString.concatBar().value).to.be.eq('my string_bar');
    expect(extendString.concatFoo().concatBar().value).to.be.eq(
      'my string_foo_bar',
    );
  });

  it('should create an extended object using both extensions definitions', () => {
    const extendString = extend(
      { value: 'my string' },
      getExtender([
        {
          concatFoo(this: MyObject) {
            return extend({ value: `${this.value}_foo` }, myObjectExtension);
          },
          concatBar(this: MyObject) {
            return extend({ value: `${this.value}_bar` }, myObjectExtension);
          },
        },
        {
          test() {
            return true;
          },
        },
      ]),
    );

    expect(extendString.concatFoo().value).to.be.eq('my string_foo');
    expect(extendString.concatBar().value).to.be.eq('my string_bar');
    expect(extendString.concatFoo().concatBar().value).to.be.eq(
      'my string_foo_bar',
    );
    expect(extendString.test()).to.be.true;
  });

  it('should instantiate an extended class with access to extended methods', () => {
    const extender = getExtender({
      method1(this: ExampleClass) {
        return this.someProperty * 3;
      },
    });
    const ExtendedClass = extendClass(ExampleClass, extender);

    const instance = new ExtendedClass();

    expect(instance.method1()).to.be.eq(21);
  });
});
