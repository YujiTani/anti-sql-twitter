import React, { useState, useEffect } from 'react';

type CircleLoaderProps = {
  width?: number;
  height?: number;
  milliseconds?: number;
  infinite?: boolean;
  followCursor?: boolean;
  isPressed?: boolean;
};

function CircleLoader({
  width = 400,
  height = 400,
  milliseconds = 1000,
  infinite = true,
  followCursor = false,
  isPressed = false,
}: CircleLoaderProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationDuration = milliseconds / 1000;
  const iterationCount = infinite ? 'infinite' : '1';
  const fillMode = infinite ? 'none' : 'forwards';
  const circleAnimationStyle = {
    animation: `drawCircle ${animationDuration}s ${iterationCount} linear`,
    animationFillMode: fillMode,
  };

  const containerStyle: React.CSSProperties = followCursor
    ? {
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        transform: `translate(${mousePosition.x - width / 2}px, ${mousePosition.y - height / 2}px)`,
        opacity: isPressed ? 1 : 0, // isPressedがtrueの場合のみ表示
        transition: 'opacity 0.1s ease',
      }
    : {};

  useEffect(() => {
    if (!followCursor) return;

    // マウス移動イベントのハンドラー
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    // イベントリスナーの登録
    document.addEventListener('mousemove', handleMouseMove);

    // クリーンアップ関数
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [followCursor]);

  // 表示条件：followCursorがfalseの場合は常に表示、trueの場合はisPressedに依存
  if (followCursor && !isPressed) return null;

  const svgContent = (
    <svg width={width} height={height} viewBox="0 0 400 400">
      <circle
        cx={200}
        cy={200}
        r={150}
        fill="none"
        stroke="#f0f0f0"
        strokeWidth={20}
      />
      <circle
        cx={200}
        cy={200}
        r={150}
        fill="none"
        stroke="green"
        strokeWidth={20}
        strokeDasharray={942}
        strokeDashoffset={942}
        strokeLinecap="round"
        style={circleAnimationStyle}
        transform="rotate(-85, 200, 200)"
      />
      <style>
        {`
                @keyframes drawCircle {
                    0% {
                        stroke-dashoffset: 942;
                    }
                    100% {
                        stroke-dashoffset: 0;
                    }
                }
                `}
      </style>
    </svg>
  );

  return followCursor ? (
    <div style={containerStyle}>{svgContent}</div>
  ) : (
    svgContent
  );
}

export default CircleLoader;
