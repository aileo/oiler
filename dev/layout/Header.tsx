import * as React from 'react';

import app, { Layout } from '../../src';

export const Header: Layout = () => (
  <div className="header bg-secondary container">
    <div className="row p-3">
      <div className="btn-group col-4">
        <button
          className="btn btn-light"
          onClick={() => app.open({ id: 'home' })}
        >
          List TODOs
        </button>
        <button
          className="btn btn-light"
          onClick={() => app.open({ id: 'about' })}
        >
          About
        </button>
      </div>
      <div className="col-6"></div>
      <div className="btn-group col-2">
        <button className="btn btn-light" onClick={() => app.logout()}>
          Logout
        </button>
      </div>
    </div>
  </div>
);
