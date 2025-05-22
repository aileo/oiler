import * as React from 'react';

import app, { Page } from '../../src';

const About: Page = function () {
  return (
    <div className="container">
      <div className="row mt-3">
        <h1 className="col-8">{app.text('about')}</h1>
        <div className="col-4 btn-group">
          <button className="btn" onClick={() => app.setLocale('en')}>
            English
          </button>
          <button className="btn" onClick={() => app.setLocale('fr')}>
            Français
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2 className="mb-3">{app.text('what.title')}</h2>
          <p>{app.text(['what', 'content'])}</p>
        </div>
        <div className="col-6">
          <h2 className="mb-3">{app.text('why.title')}</h2>
          <p>{app.text(['why', 'content'])}</p>
        </div>
      </div>
    </div>
  );
};
About.route = '/about';
About.state = {};
About.dependencies = [];
About.authenticated = true;
About.header = true;
About.footer = false;

export default About;
