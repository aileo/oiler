import * as React from 'react';

import app, { CONTAINERS } from '../../src';

interface Props {
  todo?: {
    title?: string;
    content?: string;
  };
  onSubmit: (event: React.FormEvent) => void;
}

const Form: React.FunctionComponent<Props> = ({
  onSubmit,
  todo = {},
}: Props) => (
  <form
    onSubmit={onSubmit}
    onReset={() => {
      app.open({ container: CONTAINERS.MODAL, id: undefined });
      app.refresh();
    }}
  >
    <div className="form-control-group">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        className="form-control"
        defaultValue={todo.title}
      />
    </div>
    <div className="form-control-group my-2">
      <label htmlFor="title">Content</label>
      <textarea
        id="content"
        name="content"
        className="form-control"
        defaultValue={todo.content}
      />
    </div>
    <div className="form-control-group mt-3 text-right">
      <div className="btn-group">
        <button type="submit" className="btn btn-primary">
          Save
        </button>
        <button type="reset" className="btn btn-outline-danger">
          Cancel
        </button>
      </div>
    </div>
  </form>
);

export default Form;
