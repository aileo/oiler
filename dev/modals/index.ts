import app from '../../src';

import Create from './Create';
import Update from './Update';
import Delete from './Delete';

/**
 * Add modals to application
 */
app.addModal('todo.create', Create);
app.addModal('todo.update', Update);
app.addModal('todo.delete', Delete);
