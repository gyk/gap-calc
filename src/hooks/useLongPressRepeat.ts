import { useCallback, useEffect, useRef } from "react";
import type { PointerEvent, MouseEvent } from "react";

export function useLongPressRepeat(
  action: () => void,
  repeatDelay = 500,
  interval = 100,
  pressDelay = 150,
) {
  const actionRef = useRef(action);
  actionRef.current = action;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current);
      startTimerRef.current = null;
    }
  }, []);

  const start = useCallback(
    (e: PointerEvent) => {
      if (e.button !== 0) return;

      stop();

      startTimerRef.current = setTimeout(() => {
        startTimerRef.current = null;
        actionRef.current();

        timerRef.current = setTimeout(
          () => {
            intervalRef.current = setInterval(() => {
              actionRef.current();
            }, interval);
          },
          Math.max(0, repeatDelay - pressDelay),
        );
      }, pressDelay);
    },
    [repeatDelay, interval, stop, pressDelay],
  );

  const onPointerUp = useCallback(() => {
    if (startTimerRef.current) {
      actionRef.current();
    }
    stop();
  }, [stop]);

  useEffect(() => {
    return stop;
  }, [stop]);

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  return {
    onPointerDown: start,
    onPointerUp,
    onPointerLeave: stop,
    onPointerCancel: stop,
    onContextMenu,
  };
}
