import * as React from 'react';

import app, { CONTAINERS, Modal, useState } from '../../src';

const Delete: Modal = () => {
  const { todo } = useState({ todo: ['data', 'todo'] });
  const closeAndRefresh = () => {
    app.open({ container: CONTAINERS.MODAL, id: undefined });
    app.refresh();
  };
  return (
    <div className="modal-content">
      <h2 className="modal-header">Delete TODO</h2>
      <div className="modal-body">
        <p>
          {`You are about to delete todo "${todo?.title}", this action can not be canceled`}
        </p>
      </div>
      <div className="modal-footer">
        <button
          className="btn btn-danger"
          onClick={async () => {
            await app.actions.todo.del({ uuid: todo.uuid });
            closeAndRefresh();
          }}
        >
          Confirm
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={() => closeAndRefresh()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
Delete.dependencies = [{ action: ['todo', 'get'] }];

export default Delete;
