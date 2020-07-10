import { getExtender, extend } from '../src';
import { expect } from 'chai';

interface MyObject {
  value: string;
}

interface MyObjectExtended extends MyObject {
  concatFoo(): MyObjectExtended;
  concatBar(): MyObjectExtended;
}

export const myObjectExtension = getExtender({
  concatFoo({ value }: MyObject) {
    return extend({ value: `${value}_foo` }, myObjectExtension);
  },
  concatBar({ value }: MyObject) {
    return extend({ value: `${value}_bar` }, myObjectExtension);
  },
});

describe('Example test', () => {
  it('should return "my string_foo" and "my string_bar"', () => {
    const extendString: MyObjectExtended & MyObject = extend(
      { value: 'my string' },
      myObjectExtension,
    );

    expect(extendString.concatFoo().value).to.be.eq('my string_foo');
    expect(extendString.concatBar().value).to.be.eq('my string_bar');
    expect(extendString.concatFoo().concatBar().value).to.be.eq(
      'my string_foo_bar',
    );
  });
});
