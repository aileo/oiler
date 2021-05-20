import app from '../src/Oiler';

import * as Layout from './layout';
import './services/api';
import './actions';
import './pages';
import './modals';

// Set application Header component
app.Header = Layout.Header;

/**
 * Set modals wrapper component
 * If a modal must be displayed, this wrapper will receive it as a child
 */
app.ModalWrapper = Layout.ModalWrapper;

app.start('root', ['list']);
