import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /**
   * Kept for call site compatibility. Nothing is delayed any more: content is
   * always rendered visible.
   */
  delay?: number;
  y?: number;
  className?: string;
};

/**
 * Plain layout wrapper.
 *
 * This used to fade blocks in on scroll. The animation could leave whole
 * sections invisible if the observer never fired, so it is gone: content is
 * rendered once and stays visible at every scroll position.
 */
export function Reveal({ children, className }: RevealProps) {
  return <div className={className}>{children}</div>;
}
