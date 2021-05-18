import * as React from 'react';

import { Oiler } from '../../src';

interface Props {
  oiler: Oiler;
  children?: React.ReactNode;
}

export const ModalWrapper: React.FunctionComponent<Props> = ({ children }) => {
  return (
    <div
      className="modal fade in show bg-light"
      style={{ display: 'block', opacity: 0.9 }}
    >
      <div className="modal-dialog modal-dialog-centered">{children}</div>
    </div>
  );
};
