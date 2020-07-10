import { extend, getExtender, ExtendedObject } from '../src';
import { expect } from 'chai';

interface Test {
  method1(): number;
  method2(): string;
  property: string;
}

describe('extend()', () => {
  const obj = {
    method1() {
      return 3;
    },
    property2: 7,
  };
  let extendedObj: ExtendedObject<typeof obj, Test>;

  beforeEach(() => {
    const extension = getExtender({
      method1() {
        return 1;
      },
      method2() {
        return 'str';
      },
      property: 'value',
    });

    extendedObj = extend(obj, extension);
  });

  it('should call methods of the Extender when there is no method with the same name in the real object', () => {
    const result = extendedObj.method2();

    expect(result).to.be.eq('str');
    expect('method2' in obj).to.be.false;
  });

  it('should call methods of the real object when there is a method with the same name in it', () => {
    const result = extendedObj.method1();

    expect(result).to.be.eq(3);
    expect('method1' in obj).to.be.true;
  });

  it('should access properties of the Extender when there is no property with the same name in the real object', () => {
    const result = extendedObj.property;

    expect(result).to.be.eq('value');
    expect('property' in obj).to.be.false;
  });

  it('should assign a value for the real object, not the proxy, when the property primary does not exist in it', () => {
    expect('property' in obj).to.be.false;
    extendedObj.property = 'value2';

    expect(extendedObj.property).to.be.eq('value2');
    expect('property' in obj).to.be.true;
  });

  it('should access properties of the real object when there is a property with the same name in it', () => {
    const result = extendedObj.property2;

    expect(result).to.be.eq(7);
    expect('property' in obj).to.be.true;
  });

  it('should return undefined for property that does not exist neither in the real object and the Extender', () => {
    const result = extendedObj['property3'];

    expect(result).to.be.undefined;
    expect('property3' in obj).to.be.false;
  });
});
