import React from 'react';

export const Dialog = ({ open, onOpenChange, children }: any) => (
  open ? <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">{children}</div> : null
);

export const DialogContent = ({ children, className }: any) => (
  <div className={`bg-white rounded-lg p-6 max-w-md w-full ${className || ''}`}>
    {children}
  </div>
);

export const DialogHeader = ({ children }: any) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }: any) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export const DialogDescription = ({ children, className }: any) => (
  <p className={`text-sm text-gray-500 mt-2 ${className || ''}`}>{children}</p>
);

export const DialogClose = ({ asChild, ...props }: any) => (
  <button className="text-gray-500 hover:text-gray-700" {...props}>✕</button>
);

export default Dialog;
