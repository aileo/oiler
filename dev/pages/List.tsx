import * as React from 'react';
import { Page, stateWrapper } from '../../src';

import Card from '../shared/Card';

const Home: Page = stateWrapper(
  { todos: ['data', 'todos'] },
  function ({ oiler, todos = [] }) {
    return (
      <div className="container">
        <div className="row">
          {todos.map((todo) => (
            <Card key={todo.uuid} oiler={oiler} todo={todo} />
          ))}
        </div>
      </div>
    );
  }
);
Home.route = '/home';
Home.state = {};
Home.dependencies = [{ action: ['todo', 'list'] }];
Home.authenticated = false;
Home.header = true;
Home.footer = false;

export default Home;
