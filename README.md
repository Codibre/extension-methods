# extension-methods

<br>
With this library, you can create 'proxied references' for your objects and access many methods that actually doesn't exists in them!
This is pretty useful in the following scenarios:

- where you need to create a method that returns an object with a lot of methods, but the code that'll use that result will only access a few of them;
- When you have a base class and you want to implement functionalities in it without changing the original signatures;

Depending on the number of methods you'll proxy through **extension-methods**, you can achieve a 99% faster operation than a simple **new Class()**
<br>

## How to use it

First, you need to obtain your extension object, like this:
<br>

```typescript
import { getExtender } from 'extension-methods';

export interface MyObjectExtended {
  concatFoo(): MyObjectExtended;
  concatBar(): MyObjectExtended;
}

export interface MyObject {
  value: string;
}

export const myObjectExtension = getExtender({
    concatFoo(this: MyObject) {
      return extend({ value: `${this.value}_foo` }, myObjectExtension);
    }
    concatBar(this: MyObject) {
      return extend({ value: `${this.value}_bar` }, myObjectExtension);
    }
  }
);
```

<br>
Now, take a look in the **extend** function called in the above code: this is the one who applies the extension!
Ths first parameter must be the definition of this, as it will be a reference to the object being extended, so, you can access it and do whatever you want!
So, when you need to extend methods in some object, just do it like this:
<br>
```
import { extend } from 'extension-methods';
import { myObjectExtension, MyObject, MyObjectExtended } from './my-object-extension';
...
...
const extendString: MyObjectExtended = extend({ value: 'my string' }, myObjectExtension);

console.log(extendString.concatFoo().value);
console.log(extendString.concatBar().value);
console.log(extendString.concatFoo().concatBar().value);
// Result:
// my string_foo
// my string_bar
// my string_foo_bar

```
<br>
Look that does methods actually are not present in extendString (or in the original object), but **extension-methods** make it be accessible at runtime, making the call to **extend** being much faster!
Also, in the Extender implementation, the return of **concatFoo** and **concatBar** also applies the **extend** function to the result, which creates a fluent interface for this use, resulting in the chained  call as you can see above!
All of that, with less overload possible!
<br>
## Important

* If some method exists in the original object and also is declared in the Extender, the original method will be used;
* **extension-methods** can't be used with primitive values like **string**, **number** and **boolean**;
* **extend** will naturally returns a type that is a join between the real object and the extension methods declared, but it is recommendable, if you want a cleaner type or to return such value as a result of a function, to create a interface that represent it, as you can see in the examples above;
```
