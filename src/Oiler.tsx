import { EventEmitter } from 'events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Baobab, { Cursor } from 'baobab';
import { root, branch } from 'baobab-react/higher-order';
import Router from 'baobab-router';
import { get, set } from './helpers';

import Fetchery, { IDefinition, IOptions, Services } from 'fetchery';

import logger from './logger';

interface Collection<T> {
  [key: string]: T | Collection<T>;
}

export enum CONTAINERS {
  PAGE = 'page',
  MODAL = 'modal',
}

interface Navigation {
  path: string[];
  container?: CONTAINERS;
  uuid?: string;
  metadata?: Record<string, unknown>;
}

interface ComponentProps {
  oiler: Oiler;
  [prop: string]: unknown;
}
type Component =
  | React.ComponentClass<ComponentProps>
  | React.FunctionComponent<ComponentProps>;

interface Dependency {
  action: string[];
  useUuid?: boolean;
  allowFaillure?: boolean;
}

export interface Page extends React.FunctionComponent<ComponentProps> {
  route: string;
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
  state: Record<string, unknown>;
  routes?: Route[];
}

type ActionDefinition = (ctx: Oiler, data?: any) => Promise<any>;
type Action = (data?: any) => Promise<any>;

interface IAction extends Action, Record<string, IAction> {}
type Actions = IAction;

export class Oiler extends EventEmitter {
  private _state: Baobab;
  private _actions: Record<string, Actions> = {};
  private _clients: Record<string, Fetchery> = {};
  private _routes: Route[] = [];

  private _pages: Collection<Page> = {};
  private _modals: Collection<Modal> = {};
  private _Header: Component | false = false;
  private _Footer: Component | false = false;
  private _PageWrapper: Component | false = false;
  private _ModalWrapper: Component | false = false;

  constructor() {
    super();
    const timestamp = new Date().valueOf();
    this._state = new Baobab({
      navigation: {
        logged: false,
        loading: 0,
        page: { path: [], uuid: undefined, metadata: {}, timestamp },
        modal: { path: [], uuid: undefined, metadata: {}, timestamp },
      },
      data: {},
    });
  }

  get state(): Cursor {
    return this._state.select('data');
  }

  get services(): Record<string, Services> {
    return Object.keys(this._clients).reduce((services, client) => {
      services[client] = this._clients[client].getServices();
      return services;
    }, {} as Record<string, Services>);
  }

  get actions(): Record<string, Actions> {
    return this._actions;
  }

  get Page(): Page | undefined {
    const path = this._state.get('navigation', 'page', 'path');
    const Page = get(this._pages, path) as Page;
    if (!Page) return undefined;

    const Wrapper = this._PageWrapper;
    if (!Wrapper) return Page;

    const Component: Component = ({ oiler }) => (
      <Wrapper oiler={oiler}>
        <Page oiler={oiler} />
      </Wrapper>
    );

    return Object.assign(Component, Page);
  }
  get Modal(): Modal | undefined {
    const path = this._state.get('navigation', 'modal', 'path');
    const Modal = get(this._modals, path) as Modal;
    if (!Modal) return undefined;

    const Wrapper = this._ModalWrapper;
    if (!Wrapper) return Modal;

    const Component: Component = ({ oiler }) => (
      <Wrapper oiler={oiler}>
        <Modal oiler={oiler} />
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
  set PageWrapper(component: Component | false) {
    this._PageWrapper = component;
  }
  set ModalWrapper(component: Component | false) {
    this._ModalWrapper = component;
  }

  public addClient(
    name: string,
    baseUrl: string,
    defaults?: IOptions,
    services?: Record<string, IDefinition>
  ): Oiler {
    this._clients[name] = new Fetchery(baseUrl, defaults);

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
    definition: IDefinition
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
  public addPage(path: string | string[], page: Page): Oiler {
    const _path = Array.isArray(path) ? path : path.split('.');
    this._routes.push({
      path: page.route,
      state: { navigation: { page: { path: [..._path], ...page.state } } },
    });

    set(this._pages, path, page);
    return this;
  }
  public addModal(path: string | string[], modal: Modal): Oiler {
    const _path = Array.isArray(path) ? path : path.split('.');
    set(this._modals, _path, modal);
    return this;
  }

  private binding(): void {
    ['logged', CONTAINERS.PAGE, CONTAINERS.MODAL].forEach((trigger) => {
      this._state.select(['navigation', trigger]).on('update', async () => {
        if (['logged', CONTAINERS.PAGE].includes(trigger)) {
          const page = this.Page;
          const uuid = this._state.get('navigation', CONTAINERS.PAGE, 'uuid');

          if (page) {
            await Promise.all(
              page.dependencies.map(async (dependency) => {
                const action = get(this._actions, dependency.action) as Action;
                if (!action) return undefined;
                return action({ uuid: dependency.useUuid ? uuid : undefined });
              })
            );
          }
        }

        if (['logged', CONTAINERS.MODAL].includes(trigger)) {
          const modal = this.Modal;
          const uuid = this._state.get('navigation', CONTAINERS.MODAL, 'uuid');

          if (modal) {
            await Promise.all(
              modal.dependencies.map(async (dependency) => {
                const action = get(this._actions, dependency.action) as Action;
                if (!action) return undefined;
                return action({ uuid: dependency.useUuid ? uuid : undefined });
              })
            );
          }
        }
      });
    });
  }
  private routing(): void {
    const routing = {
      defaultRoute: '/home',
      readOnly: [['navigation', 'logged']],
      routes: this._routes,
    };
    new Router(this._state, routing);
  }
  private render(containerId: string): void {
    const Root = root(
      this._state,
      branch(
        { page: ['navigation', 'page'], modal: ['navigation', 'modal'] },
        (({ oiler }) => (
          <div className="layout">
            {oiler.Header && <oiler.Header oiler={oiler} />}
            {oiler.Page && <oiler.Page oiler={oiler} />}
            {oiler.Footer && <oiler.Footer oiler={oiler} />}
            {oiler.Modal && <oiler.Modal oiler={oiler} />}
          </div>
        )) as React.FunctionComponent<ComponentProps>
      )
    );

    ReactDOM.render(
      <Root oiler={this} />,
      document.getElementById(containerId)
    );
  }
  public start(containerId: string): void {
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
    this.routing();
    this.render(containerId);
    logger.notice('OILER[started]');
  }

  public open({ container = CONTAINERS.PAGE, ...params }: Navigation): void {
    logger.info(`OPEN[${container}]`, params);
    this._state.set(['navigation', container], params);
  }

  public refresh(container: CONTAINERS = CONTAINERS.PAGE): void {
    const timestamp = new Date().valueOf();
    logger.info(`REFRESH[${container}]`);
    this._state.set(['navigation', container, 'timestamp'], timestamp);
  }
}

export default new Oiler();
