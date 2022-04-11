import { useCallback, useEffect, useRef, useState } from 'react';

export default function useSecound(fn: Function, dep: any) {
  const ref = useRef(false);
  useEffect(() => {
    if (ref.current) {
      fn();
    } else {
      ref.current = true;
    }
  }, [fn, dep]);
}
