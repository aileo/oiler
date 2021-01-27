import { Oiler } from '../../../src';

export const create = async (
  oiler: Oiler,
  data: { title: string; content: string }
): Promise<void> => {
  await oiler.services.api.todo.create({ body: data });
};
