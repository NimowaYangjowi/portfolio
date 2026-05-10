import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react';
import { FlowerBadge, FlowerBurst, FlowerCluster, FlowerDaisy } from './ui/icons';
import './ClickSpark.css';

type FlowerIconName = 'badge' | 'burst' | 'cluster' | 'daisy';

export type ClickSparkFlowerItem = {
  icon: FlowerIconName;
  color: string;
  rotation?: number;
};

type ClickBloom = {
  id: number;
  x: number;
  y: number;
  size: number;
  flower: ClickSparkFlowerItem;
};

type ClickBloomStyle = CSSProperties & {
  '--click-bloom-color': string;
  '--click-bloom-duration': string;
  '--click-bloom-rotation': string;
};

type ClickSparkProps = {
  flowerItems?: ClickSparkFlowerItem[];
  sparkColor?: string;
  sparkSize?: number;
  sparkCount?: number;
  duration?: number;
  extraScale?: number;
  shouldSpark?: (event: MouseEvent<HTMLDivElement>) => boolean;
  children: ReactNode;
};

const flowerIcons = {
  badge: FlowerBadge,
  burst: FlowerBurst,
  cluster: FlowerCluster,
  daisy: FlowerDaisy,
} satisfies Record<FlowerIconName, typeof FlowerBadge>;

const defaultFlowerItems: ClickSparkFlowerItem[] = [
  { icon: 'daisy', color: 'rgb(var(--brand-coral-rgb))', rotation: -18 },
  { icon: 'burst', color: 'rgb(var(--brand-aura-pink-rgb))', rotation: -8 },
  { icon: 'badge', color: 'rgb(var(--brand-peach-rgb))', rotation: 22 },
  { icon: 'cluster', color: 'rgb(var(--brand-mint-rgb))', rotation: -24 },
];

export default function ClickSpark({
  flowerItems = defaultFlowerItems,
  sparkColor = 'rgb(var(--foreground-rgb))',
  sparkSize = 82,
  sparkCount = 1,
  duration = 1020,
  extraScale = 1,
  shouldSpark,
  children,
}: ClickSparkProps) {
  const [blooms, setBlooms] = useState<ClickBloom[]>([]);
  const nextBloomIdRef = useRef(0);
  const lastFlowerIndexRef = useRef<number | null>(null);
  const timeoutRefs = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
    };
  }, []);

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (shouldSpark && !shouldSpark(event)) return;

    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const flowers = flowerItems.length > 0 ? flowerItems : defaultFlowerItems;
    const count = Math.max(1, sparkCount);
    let lastPickedIndex = lastFlowerIndexRef.current;

    const nextBlooms = Array.from({ length: count }, () => {
      let flowerIndex = Math.floor(Math.random() * flowers.length);

      while (flowers.length > 1 && flowerIndex === lastPickedIndex) {
        flowerIndex = Math.floor(Math.random() * flowers.length);
      }

      lastPickedIndex = flowerIndex;
      lastFlowerIndexRef.current = flowerIndex;

      const flower = flowers[flowerIndex] ?? {
        icon: 'daisy',
        color: sparkColor,
      };

      return {
        id: nextBloomIdRef.current++,
        x,
        y,
        size: sparkSize * extraScale,
        flower,
      };
    });

    setBlooms((currentBlooms) => [...currentBlooms, ...nextBlooms]);

    const cleanupDelay = duration + 120;
    const timeoutId = window.setTimeout(() => {
      const bloomIds = new Set(nextBlooms.map((bloom) => bloom.id));
      setBlooms((currentBlooms) => currentBlooms.filter((bloom) => !bloomIds.has(bloom.id)));
      timeoutRefs.current = timeoutRefs.current.filter((id) => id !== timeoutId);
    }, cleanupDelay);

    timeoutRefs.current.push(timeoutId);
  };

  return (
    <div className="click-spark" onClick={handleClick}>
      <div className="click-spark__stage" aria-hidden="true">
        {blooms.map((bloom) => {
          const Icon = flowerIcons[bloom.flower.icon];
          const style: ClickBloomStyle = {
            left: bloom.x,
            top: bloom.y,
            width: bloom.size,
            height: bloom.size,
            '--click-bloom-color': bloom.flower.color,
            '--click-bloom-duration': `${duration}ms`,
            '--click-bloom-rotation': `${bloom.flower.rotation ?? 0}deg`,
          };

          return (
            <span className="click-spark__flower-anchor" key={bloom.id} style={style}>
              <Icon className="click-spark__flower" size={bloom.size} />
            </span>
          );
        })}
      </div>
      <div className="click-spark__content">{children}</div>
    </div>
  );
}
