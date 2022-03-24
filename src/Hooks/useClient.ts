import { useCallback, useState } from 'react';

export default function useClientRect() {
  const [rect, setRect] = useState<HTMLDivElement | null>(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node);
    }
  }, []);
  return [rect, ref];
}
