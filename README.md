# Oiler

Helper to create basic SPWA using React, Baobab and Fetchery written in typescript

_And baobab-router_

## Usage

### Services

Services are declared using Fetchery to query APIs.

```js
import app, { Fetchery } from 'oiler';

app.addClient(
  'api', // service name
  'https://foo.bar', // service base url
  {
    // Fetchery defaults
    contentType: Fetchery.CONTENT_TYPE.JSON,
  },
  {
    // API routes
    'foo.bar': { route: '/foo/bar', method: Fetchery.METHOD.POST },
  }
);
```

A simple example can be found in [./dev/services/api.ts].

### actions

Actions are async functions that handle application logic (call services, update state).

foo.js

```js
export const foo = async (oiler, data) => {
  oiler.state.set(['foo'], data);
};
```

bar.js

```js
export const bar = async (oiler, data) => {
  oiler.state.set(['bar'], data);
};
```

actions.js

```js
import app from 'oiler';

import { foo } from './foo';
import { bar } from './bar';

app.addAction('foo', foo);
app.addAction('bar', bar);
```

A simple example can be found in [./dev/actions].
