import { useEffect, useRef, type RefObject } from 'react';

/**
 * Subtle magnetic pointer follow effect for desktop fine-pointer devices.
 * Animates only transform (compositor-only) and respects prefers-reduced-motion.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.22): RefObject<T | null> {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (prefersReducedMotion || !isFinePointer) return;

    let rafId: number | null = null;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      const tx = Math.max(-7, Math.min(7, relX * strength));
      const ty = Math.max(-5, Math.min(5, relY * strength));

      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      });
    };

    const handleLeave = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      el.style.transform = 'translate3d(0, 0, 0)';
    };

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, [strength]);

  return ref;
}
