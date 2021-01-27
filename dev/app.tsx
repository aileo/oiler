import app from '../src/Oiler';

import * as Layout from './layout';
import './services';
import './actions';
import './pages';
import './modals';

app.Header = Layout.Header;
app.ModalWrapper = Layout.ModalWrapper;

app.start('root');
