export * from './logger';
export * from './Oiler';
export { branch as wrapState } from 'baobab-react/higher-order';
export { useBranch as useState } from 'baobab-react/hooks';
export * as Fetchery from 'fetchery';

import app from './Oiler';
export default app;
