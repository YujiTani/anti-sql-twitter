import { MutableRefObject, useRef, useState } from 'react';

type LongPressSet = {
  onMouseDown: () => void; // マウスボタン押下時に検出開始
  onMouseUp: () => void; // マウスボタン離した時に検出停止
  onMouseLeave: () => void; // マウスが要素から離れた時に検出停止
  onTouchStart: () => void; // タッチ開始時に検出開始
  onTouchEnd: () => void; // タッチ終了時に検出停止
  isPress: boolean;
};

/**
 * Used:
 * const handleLongPress = useLongPress(関数, インターバル時間)
 * <button {...handleLongPress}>クリック</button>
 */
export const useLongPress = (
  callback: () => void,
  ms: number,
): LongPressSet => {
  const timeout: MutableRefObject<NodeJS.Timeout | undefined> = useRef();
  const [isPress, setIsPress] = useState(false);

  const start = () => {
    setIsPress(true);
    timeout.current = setTimeout(callback, ms);
  };

  const stop = () => {
    setIsPress(false);
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
    timeout.current = undefined;
  };

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    isPress,
  };
};
