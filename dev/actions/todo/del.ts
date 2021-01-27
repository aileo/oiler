import { Oiler } from '../../../src';

export const del = async (
  oiler: Oiler,
  data: { uuid: string }
): Promise<void> => {
  await oiler.services.api.todo.delete({ params: data });
};
