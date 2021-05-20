import * as React from 'react';
import { Page } from '../../src';

const About: Page = function ({ oiler }) {
  return (
    <div className="container">
      <div className="row mt-3">
        <h1 className="col-8">{oiler.text('about')}</h1>
        <div className="col-4 btn-group">
          <button className="btn" onClick={() => oiler.setLocale('en')}>
            English
          </button>
          <button className="btn" onClick={() => oiler.setLocale('fr')}>
            Français
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col-6">
          <h2 className="mb-3">{oiler.text('what.title')}</h2>
          <p>{oiler.text(['what', 'content'])}</p>
        </div>
        <div className="col-6">
          <h2 className="mb-3">{oiler.text('why.title')}</h2>
          <p>{oiler.text(['why', 'content'])}</p>
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
