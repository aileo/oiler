import { Oiler } from '../../../src';

export const update = async (
  oiler: Oiler,
  data: { uuid: string; title?: string; content?: string }
): Promise<void> => {
  const { uuid, title, content } = data;
  const todo = await oiler.services.api.todo.update({
    params: { uuid },
    body: { title, content },
  });
  oiler.state.set(['todo'], todo);
};
