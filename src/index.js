import React from 'react';
import { render } from 'react-dom';
import App from './App';
import './styles/normalize.css';
import './styles/style.css';

const rootElement = document.getElementById('root');

render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  rootElement,
);
