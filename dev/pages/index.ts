import app from '../../src';

import List from './List';
import About from './About';
import Login from './Login';

/**
 * Add pages to application
 */
app.addPage('login', Login);
app.addPage('list', List);
app.addPage('about', About);
