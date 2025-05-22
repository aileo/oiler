import * as React from 'react';

import app, { CONTAINERS, Modal, useState } from '../../src';

import Form from '../shared/Form';

const Update: Modal = () => {
  const { todo } = useState({ todo: ['data', 'todo'] });
  return (
    <div className="modal-content">
      <h2 className="modal-header">Update TODO</h2>
      <div className="modal-body">
        <Form
          onSubmit={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            await app.actions.todo.update({
              uuid: todo.uuid,
              title: data.get('title'),
              content: data.get('content'),
            });
            app.open({ container: CONTAINERS.MODAL, id: undefined });
            app.refresh();
          }}
          todo={todo || {}}
        />
      </div>
    </div>
  );
};

Update.dependencies = [{ action: ['todo', 'get'] }];

export default Update;
