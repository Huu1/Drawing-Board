import { useCallback, useState } from 'react';

export default function useDom<T>(): [T, Function] {
  const [node, setNode] = useState<T>();
  const ref = useCallback((node) => {
    if (node !== null) {
      setNode(node);
    }
  }, []);
  return [node as T, ref];
}
