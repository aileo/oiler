import * as React from 'react';

import { Oiler, CONTAINERS } from '../../src';

interface Props {
  oiler: Oiler;
}

export const Header: React.FunctionComponent<Props> = ({ oiler }) => (
  <div className="header bg-secondary container">
    <div className="row p-3">
      <button
        className="btn btn-primary mx-3"
        onClick={() => oiler.open({ path: ['home'] })}
      >
        List TODOs
      </button>
      <button
        className="btn btn-success mx-3"
        onClick={() =>
          oiler.open({
            container: CONTAINERS.MODAL,
            path: ['todo', 'create'],
          })
        }
      >
        Add new TODO
      </button>
    </div>
  </div>
);
