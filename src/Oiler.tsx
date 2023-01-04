import { EventEmitter } from 'events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Baobab, { Cursor } from 'baobab';
import { useRoot, useBranch } from 'baobab-react/hooks';
import Router from 'baobab-router';
import Polyglot from 'node-polyglot';
import * as Fetchery from 'fetchery';

import { get, set } from './helpers';

import logger from './logger';

export enum CONTAINERS {
  PAGE = 'page',
  MODAL = 'modal',
}

interface Navigation {
  id: string;
  container?: CONTAINERS;
  metadata?: Record<string, unknown>;
}

interface ComponentProps {
  metadata: object;
  [prop: string]: unknown;
}
type Component =
  | React.ComponentClass<ComponentProps>
  | React.FunctionComponent<ComponentProps>;

interface Dependency {
  action: string[];
  allowFaillure?: boolean;
}

export enum QUERY_PARAMETER_CAST {
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  BASE64 = 'base64',
  JSON = 'json',
}

interface RouterQueryParameter {
  match: string;
  cast?: QUERY_PARAMETER_CAST;
}

export interface Page extends React.FunctionComponent<ComponentProps> {
  route: string;
  query?: Record<string, RouterQueryParameter>;
  state: Record<string, unknown>;
  header: boolean;
  footer: boolean;
  authenticated: boolean;
  dependencies: Dependency[];
}

export interface Modal extends React.FunctionComponent<ComponentProps> {
  dependencies: Dependency[];
}

interface Route {
  path: string;
  query?: Record<string, RouterQueryParameter>;
  state: Record<string, unknown>;
  routes?: Route[];
}

type ActionDefinition = (ctx: Oiler, data?: any) => Promise<any>;
type Action = (data?: any) => Promise<any>;

interface IAction extends Action, Record<string, IAction> {}
type Actions = IAction;

export class Oiler extends EventEmitter {
  private _state: Baobab;
  private _locales: Record<string, string> = {};
  private _actions: Record<string, Actions> = {};
  private _clients: Record<string, Fetchery.Client> = {};
  private _routes: Route[] = [];

  private _pages: Record<string, Page> = {};
  private _modals: Record<string, Modal> = {};
  private _Header: Component | false = false;
  private _Footer: Component | false = false;
  private _Layout: Component | false = false;
  private _PageWrapper: Component | false = false;
  private _ModalWrapper: Component | false = false;

  private _polyglot: Polyglot;

  constructor() {
    super();
    const timestamp = new Date().valueOf();
    this._polyglot = new Polyglot();
    this._state = new Baobab({
      navigation: {
        logged: false,
        locale: '',
        loading: { page: false, modal: false },
        page: { id: undefined, uuid: undefined, metadata: {}, timestamp },
        modal: { id: undefined, uuid: undefined, metadata: {}, timestamp },
      },
      data: {},
    });
  }

  get state(): Cursor {
    return this._state.select('data');
  }

  get navigation(): Cursor {
    return this._state.get('navigation');
  }

  get services(): Record<string, Fetchery.Services> {
    return Object.keys(this._clients).reduce((services, client) => {
      services[client] = this._clients[client].getServices();
      return services;
    }, {} as Record<string, Fetchery.Services>);
  }

  get actions(): Record<string, Actions> {
    return this._actions;
  }

  get Page(): Page | undefined {
    const id = this._state.get('navigation', 'page', 'id');
    const Page = this._pages[id] as Page;
    if (!Page) return undefined;

    const Wrapper = this._PageWrapper;
    if (!Wrapper) return Page;

    const Component: Component = ({ metadata }) => (
      <Wrapper metadata={metadata}>
        <Page metadata={metadata} />
      </Wrapper>
    );

    return Object.assign(Component, Page);
  }
  get Modal(): Modal | undefined {
    const id = this._state.get('navigation', 'modal', 'id');
    const Modal = this._modals[id] as Modal;
    if (!Modal) return undefined;

    const Wrapper = this._ModalWrapper;
    if (!Wrapper) return Modal;

    const Component: Component = ({ metadata }) => (
      <Wrapper metadata={metadata}>
        <Modal metadata={metadata} />
      </Wrapper>
    );

    return Object.assign(Component, Modal);
  }
  get Header(): Component | false {
    return (this.Page?.header || false) && this._Header;
  }
  set Header(component: Component | false) {
    this._Header = component;
  }
  get Footer(): Component | false {
    return (this.Page?.footer || false) && this._Footer;
  }
  set Footer(component: Component | false) {
    this._Footer = component;
  }
  set Layout(component: Component | false) {
    this._Layout = component;
  }
  set PageWrapper(component: Component | false) {
    this._PageWrapper = component;
  }
  set ModalWrapper(component: Component | false) {
    this._ModalWrapper = component;
  }

  /**
   * Locale related methods
   */
  get locale(): string {
    return this._state.get(['navigation', 'locale']);
  }
  public addLocale(name: string, url: string): void {
    this._locales[name] = url;
  }
  public async setLocale(locale: string): Promise<void> {
    if (!(locale in this._locales)) {
      throw new Error(`Locale ${locale} not found`);
    }

    const res = await fetch(this._locales[locale]);
    const texts = await res.json();
    this._polyglot.locale(locale);
    this._polyglot.extend(texts);
    this._state.set(['navigation', 'locale'], locale);
  }
  public text(path: string | string[], ...args: any[]): string {
    return this._polyglot.t(
      Array.isArray(path) ? path.join('.') : path,
      ...args
    );
  }

  public addClient(
    name: string,
    baseUrl: string,
    defaults?: Fetchery.Options,
    services?: Record<string, Fetchery.Definition>
  ): Oiler {
    this._clients[name] = new Fetchery.Client(baseUrl, defaults);

    if (services) {
      Object.keys(services).forEach((path) =>
        this.addService(name, path, services[path])
      );
    }

    return this;
  }
  public addService(
    client: string,
    path: string | string[],
    definition: Fetchery.Definition
  ): Oiler {
    if (!this._clients[client]) {
      throw new Error(`Unable to find client ${client}`);
    }
    this._clients[client].addService(path, definition);
    return this;
  }
  public addAction(path: string | string[], action: ActionDefinition): Oiler {
    const _path = Array.isArray(path) ? path : path.split('.');
    set(this._actions, _path, (data?: any) => {
      logger.info(`ACTION[${_path.join('.')}]`);
      logger.debug(`ACTION[${_path.join('.')}]`, { data });
      return action(this, data);
    });
    return this;
  }
  public addPage(id: string, page: Page): Oiler {
    this._routes.push({
      path: page.route,
      query: page.query,
      state: {
        navigation: {
          logged: page.authenticated,
          page: { id, ...page.state },
        },
      },
    });

    this._pages[id] = page;
    return this;
  }
  public addModal(id: string, modal: Modal): Oiler {
    this._modals[id] = modal;
    return this;
  }

  private binding(): void {
    const runDependencies = async (container: CONTAINERS) => {
      const display = container === CONTAINERS.PAGE ? this.Page : this.Modal;
      const metadata = this._state.get(['navigation', container, 'metadata']);
      const logged = this._state.get(['navigation', 'logged']);

      if (!display) return undefined;
      if ((display as Page).authenticated && !logged) return undefined;

      logger.debug(`BINDINGS[${container}]`, display.dependencies);

      this._state.set(['navigation', 'loading', container], true);
      await Promise.all(
        display.dependencies.map(async (dependency) => {
          const action = get(this._actions, dependency.action) as Action;
          if (!action) return undefined;
          await action(metadata);
          return undefined;
        })
      );
      this._state.set(['navigation', 'loading', container], false);
      return undefined;
    };

    this._state.select(['navigation']).on('update', ({ data }) => {
      const logged = data.previousData.logged !== data.currentData.logged;
      let page =
        logged || data.previousData.page.id !== data.currentData.page.id;
      let modal =
        logged || data.previousData.modal.id !== data.currentData.modal.id;

      //
      if (!page) {
        page =
          JSON.stringify(data.previousData.page.metadata) !==
          JSON.stringify(data.currentData.page.metadata);
      }

      if (!modal) {
        modal =
          JSON.stringify(data.previousData.modal.metadata) !==
          JSON.stringify(data.currentData.modal.metadata);
      }

      if (page) runDependencies(CONTAINERS.PAGE);
      if (modal) runDependencies(CONTAINERS.MODAL);
    });
  }
  private routing(defaultPage: string): void {
    const defaultRoute = (this._pages[defaultPage] || { route: '/home' }).route;
    const routing = {
      defaultRoute,
      readOnly: [['navigation', 'logged']],
      routes: this._routes,
    };
    new Router(this._state, routing);
  }
  private render(containerId: string): void {
    const state = this._state;

    const Layout = () => {
      const { page } = useBranch({
        locale: ['locale'],
        page: ['navigation', 'page'],
        modal: ['navigation', 'modal'],
      });

      const parts = [
        this.Header && <this.Header key="header" metadata={page?.metadata} />,
        this.Page && <this.Page key="page" metadata={page?.metadata} />,
        this.Footer && <this.Footer key="footer" metadata={page?.metadata} />,
        this.Modal && <this.Modal key="modal" metadata={page?.metadata} />,
      ];

      return this._Layout ? (
        <this._Layout metadata={page?.metadata}>{parts}</this._Layout>
      ) : (
        <div className="layout">{parts}</div>
      );
    };

    const Root = () => {
      const StateRoot = useRoot(state);
      return (
        <StateRoot>
          <Layout />
        </StateRoot>
      );
    };

    ReactDOM.render(<Root />, document.getElementById(containerId));
  }
  public async start(
    containerId: string,
    defaultPage: string,
    defaultLocale?: string
  ): Promise<void> {
    logger.info('OILER[starting]');
    this._state.on('update', ({ data: { transaction } }) => {
      transaction.forEach(
        ({ path, value }: { path: string[]; value: unknown }) => {
          logger.info(`STATE[${path.join('.')}]`);
          logger.debug(`STATE[${path.join('.')}]`, value);
        }
      );
    });
    this.binding();
    this.routing(defaultPage);
    if (defaultLocale) {
      await this.setLocale(defaultLocale);
    }
    this.render(containerId);
    logger.notice('OILER[started]');
    this.emit('start');
  }

  public open({ container = CONTAINERS.PAGE, ...params }: Navigation): void {
    logger.info(`OPEN[${container}]`, params);
    this._state.set(['navigation', container], params);
    this.emit('open', { container, ...params });
  }

  public refresh(container: CONTAINERS = CONTAINERS.PAGE): void {
    const timestamp = new Date().valueOf();
    logger.info(`REFRESH[${container}]`);
    this._state.set(['navigation', container, 'timestamp'], timestamp);
    this.emit('refresh', {
      container,
      ...this._state.get(['navigation', container]),
    });
  }

  public login(): void {
    this._state.set(['navigation', 'logged'], true);
    this.emit('login');
  }
  public logout(): void {
    this._state.set(['navigation', 'logged'], false);
    this.emit('logout');
  }
}

const oiler = new Oiler();
export default oiler;
