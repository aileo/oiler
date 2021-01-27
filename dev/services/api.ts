import { CAST, CONTENT_TYPE, IDefinition, IOptions, METHOD } from 'fetchery';

export const baseUrl = 'http://127.0.0.1:8080';
export const defaults: IOptions = {
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  },
  contentType: CONTENT_TYPE.JSON,
  cast: CAST.JSON,
};
export const services: Record<string, IDefinition> = {
  'todo.list': { route: '/api/todo' },
  'todo.get': { route: '/api/todo/:uuid' },
  'todo.create': { route: '/api/todo', method: METHOD.POST },
  'todo.update': { route: '/api/todo/:uuid', method: METHOD.POST },
  'todo.delete': { route: '/api/todo/:uuid', method: METHOD.DELETE },
};
