import React, { useRef, useState } from 'react';
import { RefreshCw } from 'lucide-react';

const THRESHOLD = 65;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(null);
  const isPullingRef = useRef(false);

  const onTouchStart = (e) => {
    if (window.scrollY === 0) {
      startYRef.current = e.touches[0].clientY;
    }
  };

  const onTouchMove = (e) => {
    if (startYRef.current === null || refreshing) return;
    const dy = e.touches[0].clientY - startYRef.current;
    if (dy > 0 && window.scrollY === 0) {
      isPullingRef.current = true;
      setPullY(Math.min(dy * 0.45, 80));
    }
  };

  const onTouchEnd = async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;
    const captured = pullY;
    setPullY(0);
    startYRef.current = null;
    if (captured >= THRESHOLD) {
      setRefreshing(true);
      await onRefresh();
      setRefreshing(false);
    }
  };

  const progress = Math.min(pullY / THRESHOLD, 1);
  const showIndicator = pullY > 0 || refreshing;

  return (
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      <div
        className="flex justify-center items-center overflow-hidden transition-all duration-200 ease-out"
        style={{ height: refreshing ? 44 : showIndicator ? pullY * 0.6 : 0 }}
      >
        <RefreshCw
          className={`w-5 h-5 text-[#1B4332] ${refreshing ? 'animate-spin' : 'transition-transform'}`}
          style={{ opacity: refreshing ? 1 : progress, transform: `rotate(${progress * 180}deg)` }}
        />
      </div>
      {children}
    </div>
  );
}