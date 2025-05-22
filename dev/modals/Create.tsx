import * as React from 'react';

import app, { CONTAINERS, Modal } from '../../src';

import Form from '../shared/Form';

const Create: Modal = function () {
  return (
    <div className="modal-content">
      <h2 className="modal-header">Create TODO</h2>
      <div className="modal-body">
        <Form
          onSubmit={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            await app.actions.todo.create({
              title: data.get('title'),
              content: data.get('content'),
            });
            app.open({ container: CONTAINERS.MODAL, id: undefined });
            app.refresh();
          }}
        />
      </div>
    </div>
  );
};
Create.dependencies = [];

export default Create;
