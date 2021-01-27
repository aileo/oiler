import * as React from 'react';
import { CONTAINERS, Modal } from '../../src';

import Form from '../shared/Form';

const Create: Modal = function ({ oiler }) {
  return (
    <div className="modal-content">
      <h2 className="modal-header">Create TODO</h2>
      <div className="modal-body">
        <Form
          oiler={oiler}
          onSubmit={async (event) => {
            event.stopPropagation();
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            await oiler.actions.todo.create({
              title: data.get('title'),
              content: data.get('content'),
            });
            oiler.open({ container: CONTAINERS.MODAL, path: [] });
            oiler.refresh();
          }}
        />
      </div>
    </div>
  );
};
Create.dependencies = [];

export default Create;
