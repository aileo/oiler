import { Oiler } from '../../../src';

export const list = async (oiler: Oiler): Promise<void> => {
  const todos = await oiler.services.api.todo.list({});
  oiler.state.set(['todos'], todos);
};
