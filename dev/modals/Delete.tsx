import * as React from 'react';
import { CONTAINERS, Modal, useState } from '../../src';

const Delete: Modal = ({ oiler }) => {
  const { todo } = useState({ todo: ['data', 'todo'] });
  const closeAndRefresh = () => {
    oiler.open({ container: CONTAINERS.MODAL, id: undefined });
    oiler.refresh();
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
            await oiler.actions.todo.del({ uuid: todo.uuid });
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
Delete.dependencies = [{ action: ['todo', 'get'], useUuid: true }];

export default Delete;
