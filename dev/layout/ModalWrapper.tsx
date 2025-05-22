import * as React from 'react';
import { Wrapper } from '../../src';

export const ModalWrapper: Wrapper = ({ children }) => {
  return (
    <div
      className="modal fade in show bg-light"
      style={{ display: 'block', opacity: 0.9 }}
    >
      <div className="modal-dialog modal-dialog-centered">{children}</div>
    </div>
  );
};
