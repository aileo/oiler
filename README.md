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

// Define route and state (pages only)
FooBar.route = '/foo/bar/:id';
FooBar.state = { id: ':id' };
// Actions to execute on page/modal display
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
// and use page ['foo', 'bar'] as default page
oiler.start('container', ['foo', 'bar']);
```

## Advanced

### Authentication

#### login

This method enable access to pages defined with `authenticated=true`.

#### logout

This method restrict access to pages defined with `authenticated=false`.

### Locales

Oiler uses [`node-polyglot`](https://github.com/airbnb/polyglot.js) to handle I18n.

See [dev's "About" page](./dev/pages/About.tsx) and [dev's locales](./dev/locales) as a simple example.

#### addLocale

Used to register an available language in the application by providing a name and a URL to a JSON file containing texts.

```js
import oiler from 'oiler';

oiler.addLocale('en', '/locales/en.json');
oiler.addLocale('fr', 'https://foo.bar/locales/fr.json');
```

To load locale on start, locale name must be passed as the third parameter of `oiler.start`.

#### setLocale

Load locale file from URL and re-render.

```js
import oiler from 'oiler';

await oiler.setLocale('fr');
```

#### text

Returns text for the provided key, all parameters are passed to `polyglot.t` for interpolation (see [`node-polyglot`](https://github.com/airbnb/polyglot.js#interpolation) for more details).

### Events

#### start

Emit when `oiler.start` is called.

#### open

Emit with page/modal parameters when `oiler.open` is called.

#### refresh

Emit with page/modal parameters when `oiler.refresh` is called.

#### login

Emit when `oiler.login` is called.

#### logout

Emit when `oiler.logout` is called.

## Development

Run `npm run dev` to start dev server in watch mode [on port `8080`](http://localhost:8080)

### Contributions

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to run `npm run lint`.

## License

[MIT](./LICENSE)
