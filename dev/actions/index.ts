import app from '../../src/Oiler';

import * as todo from './todo';

Object.keys(todo).forEach((name) => app.addAction(['todo', name], todo[name]));
