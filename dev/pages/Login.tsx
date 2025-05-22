import * as React from 'react';

import app, { Page } from '../../src';

const Login: Page = function () {
  return (
    <div className="container">
      <div className="row mt-3">
        <h1 className="col-12">Login</h1>
      </div>
      <div className="row">
        <div className="col-12">
          <h2 className="mb-3">This page simulate some login page</h2>
          <button className="btn btn-primary" onClick={() => app.login()}>
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};
Login.route = '/login';
Login.state = {};
Login.dependencies = [];
Login.authenticated = false;
Login.header = false;
Login.footer = false;

export default Login;
