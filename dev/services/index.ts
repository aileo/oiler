import app from '../../src';

import * as api from './api';

app.addClient('api', api.baseUrl, api.defaults, api.services);
