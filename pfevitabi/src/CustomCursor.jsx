import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [outlinePosition, setOutlinePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Disable custom cursor on touch devices and for users
    // who prefer reduced motion.
    const isTouchDevice =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      return undefined;
    }

    const mouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      // Outline follows with a slight delay
      setTimeout(() => {
        setOutlinePosition({ x: e.clientX, y: e.clientY });
      }, 50);
    };

    window.addEventListener('mousemove', mouseMove);
    return () => window.removeEventListener('mousemove', mouseMove);
  }, []);

  useEffect(() => {
    const isTouchDevice =
      window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (isTouchDevice || prefersReducedMotion) {
      return undefined;
    }

    // enable custom cursor by toggling a body class; this avoids globally
    // hiding the native cursor unless the custom cursor is active
    document.body.classList.add('use-custom-cursor');
    return () => document.body.classList.remove('use-custom-cursor');
  }, []);

  const isTouchDevice =
    window.matchMedia('(hover: none)').matches ||
    window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouchDevice || prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <div 
        className="custom-cursor" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      ></div>
      <div 
        className="custom-cursor-outline" 
        style={{ left: `${outlinePosition.x}px`, top: `${outlinePosition.y}px` }}
      ></div>
    </>
  );
};

export default CustomCursor;
