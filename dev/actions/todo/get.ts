import { Oiler } from '../../../src';

export const get = async (
  oiler: Oiler,
  data: { uuid: string }
): Promise<void> => {
  const todo = await oiler.services.api.todo.get({
    params: { uuid: data.uuid },
  });
  oiler.state.set(['todo'], todo);
};
