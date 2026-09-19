import { cloneElement, isValidElement } from 'react';

type SlotProps = React.HTMLAttributes<HTMLElement> & {
  children?: React.ReactNode;
};

export function Slot({ children, ...props }: SlotProps) {
  if (!isValidElement<React.HTMLAttributes<HTMLElement>>(children)) {
    return null;
  }

  return cloneElement(children, {
    ...props,
    className: [props.className, children.props.className].filter(Boolean).join(' '),
  });
}
