import * as React from 'react';

import { Oiler } from '../../src';

interface Props {
  oiler: Oiler;
}

export const Header: React.FunctionComponent<Props> = ({ oiler }) => (
  <div className="header bg-secondary container">
    <div className="row p-3">
      <div className="btn-group col-4">
        <button
          className="btn btn-light"
          onClick={() => oiler.open({ path: ['home'] })}
        >
          List TODOs
        </button>
        <button
          className="btn btn-light"
          onClick={() => oiler.open({ path: ['about'] })}
        >
          About
        </button>
      </div>
      <div className="col-6"></div>
      <div className="btn-group col-2">
        <button className="btn btn-light" onClick={() => oiler.logout()}>
          Logout
        </button>
      </div>
    </div>
  </div>
);
