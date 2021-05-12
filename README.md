# Oiler

Helper to create basic SPWA using React, Baobab and Fetchery written in typescript

_And baobab-router_

## Getting started

This section is a quick overview of the steps to setup an application.

### State

Application data is stored in a [Baobab](https://github.com/Yomguithereal/baobab) tree.

```js
import oiler from 'oiler';

// init state
oiler.state.set({ foo: 'bar' });
```

### Services

Services are declared using [Fetchery](https://github.com/aileo/fetchery) to query APIs.

```js
import oiler, { Fetchery } from 'oiler';

oiler.addClient(
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

A simple example can be found in [./dev/services/api.ts](./dev/services/api.ts).

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
import oiler from 'oiler';

import { foo } from './foo';
import { bar } from './bar';

oiler.addAction('foo', foo);
oiler.addAction('bar', bar);
```

A simple example can be found in [./dev/actions](./dev/actions).

### Pages & modals

```js
import oiler from 'oiler';

const FooBar = function (props) {
  return <div>Foo bar</div>;
};

// Define route and state
FooBar.route = '/foo/bar/:id';
FooBar.state = { id: ':id' };
// Actions to execute on page display
FooBar.dependencies = [{ action: ['foo'] }, { action: ['bar'] }];
// Set header/footer display (pages only)
FooBar.header = true;
FooBar.footer = false;

// Register page to app
oiler.addPage(['foo', 'bar'], FooBar);
```

A simple example can be found in [./dev/pages](./dev/pages) and [./dev/modals](./dev/modals).

### Layout

#### Header & footer

It is possible to set some header and footer components to be displayed before and after pages.

```js
import oiler from 'oiler';

oiler.Header = function () {
  return <div>Header</div>;
};
oiler.Footer = function () {
  return <div>Footer</div>;
};
```

#### Page & modal wrappers

It is possible to set wrapper around pages and modals components to handle specific layout and logic.

```js
import oiler from 'oiler';

oiler.ModalWrapper = function ({ children }) {
  return <div className="modal">{children}</div>;
};
```

### Navigation

#### open

Open registered page or modal

```js
import oiler, { CONTAINERS } from 'oiler';

// open a page with uuid
oiler.open({
  path: ['foo', 'bar'],
  container: CONTAINERS.PAGE,
  uuid: 'some-id',
});

// open modal with metadata
oiler.open({
  path: ['foo', 'bar'],
  container: CONTAINERS.MODAL,
  metadata: { foo: 'bar' },
});
```

#### refresh

This method reload page or modal (triggers actions dependencies).

```js
import oiler, { CONTAINERS } from 'oiler';

// refresh page
oiler.refresh(CONTAINERS.PAGE);

// refresh modal
oiler.refresh(CONTAINERS.MODAL);
```

### Initialization

Once pages and modals are registered, application needs to be initialized to create the [router](https://github.com/jacomyal/baobab-router) and render.

```js
import oiler from 'oiler';

// will render application in #container
oiler.start('container');
```
