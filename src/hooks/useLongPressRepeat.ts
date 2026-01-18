import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent, MouseEvent } from "react";

export function useLongPressRepeat(
  action: () => void,
  delay = 500,
  interval = 100,
) {
  const actionRef = useRef(action);
  actionRef.current = action;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (e: PointerEvent) => {
      if (e.button !== 0) return;

      stop();
      actionRef.current();

      timerRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          actionRef.current();
        }, interval);
      }, delay);
    },
    [delay, interval, stop],
  );

  useEffect(() => {
    return stop;
  }, [stop]);

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onContextMenu,
  };
}
