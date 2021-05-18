import app from '../../src/Oiler';

import * as todo from './todo';

/**
 * Add actions to oiler app:
 *
 * app.addAction('todo.create', todo.create);
 * app.addAction('todo.list', todo.list);
 * app.addAction('todo.get', todo.get);
 * app.addAction('todo.update', todo.update);
 * app.addAction('todo.delete', todo.delete);
 *
 * Or oneliner:
 */
Object.keys(todo).forEach((name) => app.addAction(['todo', name], todo[name]));
