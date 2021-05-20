import * as React from 'react';
import { Page, stateWrapper, CONTAINERS } from '../../src';

import Card from '../shared/Card';

// Page component
const List: Page = stateWrapper(
  { todos: ['data', 'todos'] }, // use baobab-react to watch cursor
  function ({ oiler, todos = [] }) {
    return (
      <div className="container">
        <div className="row">
          <div className="card m-3 w-25">
            <div className="card-body d-flex align-items-center justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() =>
                  oiler.open({
                    container: CONTAINERS.MODAL,
                    path: ['todo', 'create'],
                  })
                }
              >
                Add +
              </button>
            </div>
          </div>
          {todos.map((todo) => (
            <Card key={todo.uuid} oiler={oiler} todo={todo} />
          ))}
        </div>
      </div>
    );
  }
);

// Define page route
List.route = '/home';

// Define related state used by baobab-router
List.state = {};

// Actions to execute when this page is displayed
List.dependencies = [{ action: ['todo', 'list'] }];

// Does this page require authentication
List.authenticated = true;

// Should app header and footer be displayed
List.header = true;
List.footer = false;

export default List;
