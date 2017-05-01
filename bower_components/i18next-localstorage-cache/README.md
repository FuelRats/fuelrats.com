# Introduction

This is a i18next cache layer to be used in the browser. It will load and cache resources from localStorage.

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/i18next-localstorage-cache), bower or [downloaded](https://github.com/i18next/i18next-localStorage-cache/blob/master/i18nextLocalStorageCache.min.js) from this repo.

- If you don't use a module loader it will be added to window.i18nextLocalStorageCache

```
# npm package
$ npm install i18next-localstorage-cache

# bower
$ bower install i18next-localstorage-cache
```

Wiring up:

```js
import i18next from 'i18next';
import Cache from 'i18next-localStorage-cache';

i18next
  .use(Cache)
  .init(i18nextOptions);
```

As with all modules you can either pass the constructor function (class) to the i18next.use or a concrete instance.

## Cache Options

```js
{
  return {
    // turn on or off
    enabled: false,

    // prefix for stored languages
    prefix: 'i18next_res_',

    // expiration
    expirationTime: 7*24*60*60*1000
  };
}
```

Options can be passed in:

**preferred** - by setting options.cache in i18next.init:

```js
import i18next from 'i18next';
import Cache from 'i18next-localStorage-cache';

i18next
  .use(Cache)
  .init({
    cache: options
  });
```

on construction:

```js
  import Cache from 'i18next-localStorage-cache';
  const cache = new Cache(null, options);
```

via calling init:

```js
  import Cache from 'i18next-localStorage-cache';
  const cache = new Cache();
  cache.init(options);
```
