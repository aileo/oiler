import * as React from 'react';
import { Page } from '../../src';

const About: Page = function () {
  return (
    <div className="container">
      <div className="row mt-3">
        <h1 className="col-12">About</h1>
      </div>
      <div className="row">
        <div className="col-6">
          <h2 className="mb-3">What is Oiler</h2>
          <p>
            Oiler is little helper written in typescript for
            <span style={{ fontStyle: 'italic' }}> Single Page Web App </span>
            with integrated state (using{' '}
            <a href="https://github.com/Yomguithereal/baobab">Baobab</a>),
            managed navigation and router (using{' '}
            <a href="https://github.com/jacomyal/baobab-router">
              Baobab-router
            </a>
            )
          </p>
        </div>
        <div className="col-6">
          <h2 className="mb-3">Why this demo</h2>
          <p>
            Oiler tends to remain simple and making an example is way faster
            than writing documentation.
          </p>
        </div>
      </div>
    </div>
  );
};
About.route = '/about';
About.state = {};
About.dependencies = [];
About.authenticated = false;
About.header = true;
About.footer = false;

export default About;
