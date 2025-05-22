import * as React from 'react';

import app, { CONTAINERS } from '../../src';

interface Props {
  todo: {
    uuid: string;
    title: string;
    content: string;
  };
}

const Card: React.FunctionComponent<Props> = ({
  todo: { uuid, title, content },
}) => (
  <div className="card m-3 w-25">
    <div className="card-header">
      <h5 className="card-title mb-0 text-center">{title}</h5>
    </div>
    <div className="card-body">
      <ul className="list-group list-group-flush">
        {content.split('\n').map((text, key) => (
          <li key={key} className="list-group-item">
            {text}
          </li>
        ))}
      </ul>
    </div>
    <div className="card-footer text-center">
      <div className="btn-group">
        <button
          className="btn btn-sm btn-secondary"
          onClick={() =>
            app.open({
              container: CONTAINERS.MODAL,
              id: 'todo.update',
              metadata: { uuid },
            })
          }
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() =>
            app.open({
              container: CONTAINERS.MODAL,
              id: 'todo.delete',
              metadata: { uuid },
            })
          }
        >
          Delete
        </button>
      </div>
    </div>
  </div>
);

export default Card;
