import app from '../../src';

import List from './List';
import About from './About';

/**
 * Add pages to application
 */
app.addPage(['list'], List);
app.addPage(['about'], About);
