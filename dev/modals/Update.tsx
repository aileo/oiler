import * as React from 'react';
import { CONTAINERS, Modal, stateWrapper } from '../../src';

import Form from '../shared/Form';

const Update: Modal = stateWrapper(
  { todo: ['data', 'todo'] },
  ({ oiler, todo }) => (
    <div className="modal-content">
      <h2 className="modal-header">Update TODO</h2>
      <div className="modal-body">
        <Form
          oiler={oiler}
          onSubmit={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            await oiler.actions.todo.update({
              uuid: todo.uuid,
              title: data.get('title'),
              content: data.get('content'),
            });
            oiler.open({ container: CONTAINERS.MODAL, path: [] });
            oiler.refresh();
          }}
          todo={todo}
        />
      </div>
    </div>
  )
);
Update.dependencies = [{ action: ['todo', 'get'], useUuid: true }];

export default Update;
