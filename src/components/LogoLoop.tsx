import type { CSSProperties, ReactNode } from 'react';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './LogoLoop.css';

const ANIMATION_CONFIG = {
  SMOOTH_TAU: 0.25,
  MIN_COPIES: 2,
  COPY_HEADROOM: 2,
} as const;

const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(' ');

const useResizeObserver = (
  callback: () => void,
  elements: Array<React.RefObject<HTMLDivElement | null>>,
  dependencies: unknown[],
): void => {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!window.ResizeObserver) {
      const handleResize = () => callback();
      window.addEventListener('resize', handleResize);
      callback();
      return () => window.removeEventListener('resize', handleResize);
    }

    const observers = elements
      .map((ref) => {
        if (!ref.current) return null;
        const observer = new ResizeObserver(callback);
        observer.observe(ref.current);
        return observer;
      })
      .filter(Boolean) as ResizeObserver[];

    callback();

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [callback, elements, dependencies]);
};

const useImageLoader = (
  seqRef: React.RefObject<HTMLDivElement | null>,
  onLoad: () => void,
  dependencies: unknown[],
): void => {
  useEffect(() => {
    const container = seqRef.current;
    if (!container) {
      onLoad();
      return;
    }

    const images = container.querySelectorAll('img');

    if (images.length === 0) {
      onLoad();
      return;
    }

    let remainingImages = images.length;
    const handleImageLoad = () => {
      remainingImages -= 1;
      if (remainingImages === 0) {
        onLoad();
      }
    };

    images.forEach((img) => {
      const htmlImg = img as HTMLImageElement;
      if (htmlImg.complete) {
        handleImageLoad();
      } else {
        htmlImg.addEventListener('load', handleImageLoad, { once: true });
        htmlImg.addEventListener('error', handleImageLoad, { once: true });
      }
    });

    return () => {
      images.forEach((img) => {
        const htmlImg = img as HTMLImageElement;
        htmlImg.removeEventListener('load', handleImageLoad);
        htmlImg.removeEventListener('error', handleImageLoad);
      });
    };
  }, [onLoad, seqRef, dependencies]);
};

const useAnimationLoop = (
  trackRef: React.RefObject<HTMLDivElement | null>,
  targetVelocity: number,
  seqWidth: number,
  isHovered: boolean,
  hoverSpeed: number | undefined,
): void => {
  const rafRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);
  const offsetRef = useRef(0);
  const velocityRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (seqWidth > 0) {
      offsetRef.current = ((offsetRef.current % seqWidth) + seqWidth) % seqWidth;
      track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
    }

    if (prefersReduced) {
      track.style.transform = 'translate3d(0, 0, 0)';
      return () => {
        lastTimestampRef.current = null;
      };
    }

    const animate = (timestamp: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = timestamp;
      }

      const deltaTime = Math.max(0, timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      const target = isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

      const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
      velocityRef.current += (target - velocityRef.current) * easingFactor;

      if (seqWidth > 0) {
        let nextOffset = offsetRef.current + velocityRef.current * deltaTime;
        nextOffset = ((nextOffset % seqWidth) + seqWidth) % seqWidth;
        offsetRef.current = nextOffset;

        track.style.transform = `translate3d(${-offsetRef.current}px, 0, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimestampRef.current = null;
    };
  }, [targetVelocity, seqWidth, isHovered, hoverSpeed, trackRef]);
};

export interface LogoItem {
  node?: ReactNode;
  src?: string;
  srcSet?: string;
  sizes?: string;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
}

interface LogoLoopProps {
  logos: any[];
  speed?: number;
  direction?: 'left' | 'right';
  logoHeight?: number;
  gap?: number;
  hoverSpeed?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  renderItem?: (item: any, index: number) => JSX.Element;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
  logos,
  speed = 120,
  direction = 'left',
  logoHeight = 28,
  gap = 32,
  hoverSpeed,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor,
  renderItem,
  ariaLabel = 'Partner logos',
  className,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const seqRef = useRef<HTMLDivElement | null>(null);

  const [seqWidth, setSeqWidth] = useState(0);
  const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
  const [isHovered, setIsHovered] = useState(false);

  const effectiveHoverSpeed = useMemo(() => {
    if (hoverSpeed !== undefined) return hoverSpeed;
    return 0;
  }, [hoverSpeed]);

  const targetVelocity = useMemo(() => {
    const magnitude = Math.abs(speed);
    const directionMultiplier = direction === 'left' ? 1 : -1;
    const speedMultiplier = speed < 0 ? -1 : 1;
    return magnitude * directionMultiplier * speedMultiplier;
  }, [speed, direction]);

  const updateDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth ?? 0;
    const sequenceRect = seqRef.current?.getBoundingClientRect();
    const sequenceWidth = sequenceRect?.width ?? 0;

    if (sequenceWidth > 0) {
      setSeqWidth(Math.ceil(sequenceWidth));
      const copiesNeeded = Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
      setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
    }
  }, []);

  useResizeObserver(updateDimensions, [containerRef, seqRef], [logos, gap, logoHeight]);

  useImageLoader(seqRef, updateDimensions, [logos, gap, logoHeight]);

  useAnimationLoop(trackRef, targetVelocity, seqWidth, isHovered, effectiveHoverSpeed);

  const cssVariables = useMemo(
    () => ({
      '--logoloop-gap': `${gap}px`,
      '--logoloop-logoHeight': `${logoHeight}px`,
      ...(fadeOutColor ? { '--logoloop-fadeColor': fadeOutColor } : {}),
    }),
    [gap, logoHeight, fadeOutColor],
  );

  const rootClasses = useMemo(
    () =>
      cx(
        'relative group overflow-x-hidden',
        '[--logoloop-gap:32px]',
        '[--logoloop-logoHeight:28px]',
        '[--logoloop-fadeColorAuto:#ffffff]',
        'dark:[--logoloop-fadeColorAuto:#0b0b0b]',
        scaleOnHover && 'py-[calc(var(--logoloop-logoHeight)*0.1)]',
        className,
      ),
    [scaleOnHover, className],
  );

  const handleMouseEnter = useCallback(() => {
    if (hoverSpeed !== undefined) setIsHovered(true);
  }, [hoverSpeed]);

  const handleMouseLeave = useCallback(() => {
    if (hoverSpeed !== undefined) setIsHovered(false);
  }, [hoverSpeed]);

  const renderLogoItemInternal = useCallback(
    (item: any, index: number) => {
      if (renderItem) {
        return (
          <li
            className={cx(
              'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
              'mr-[var(--logoloop-gap)]',
              scaleOnHover && 'overflow-visible group/item',
            )}
            key={index}
            role="listitem"
          >
            {renderItem(item, index)}
          </li>
        );
      }

      const isNodeItem = typeof item === 'object' && item !== null && 'node' in item;

      const content = isNodeItem ? (
        <span
          className={cx(
            'inline-flex items-center',
            'motion-reduce:transition-none',
            scaleOnHover &&
              'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120',
          )}
          aria-hidden={Boolean(item?.href) && !item?.ariaLabel}
        >
          {item.node as ReactNode}
        </span>
      ) : (
        <img
          className={cx(
            'h-[var(--logoloop-logoHeight)] w-auto block object-contain',
            '[-webkit-user-drag:none] pointer-events-none',
            '[image-rendering:-webkit-optimize-contrast]',
            'motion-reduce:transition-none',
            scaleOnHover &&
              'transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120',
          )}
          src={item?.src}
          srcSet={item?.srcSet}
          sizes={item?.sizes}
          width={item?.width}
          height={item?.height}
          alt={item?.alt ?? ''}
          title={item?.title}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      );

      const itemAriaLabel = isNodeItem ? item?.ariaLabel ?? item?.title : item?.alt ?? item?.title;

      const inner = item?.href ? (
        <a
          className={cx(
            'inline-flex items-center no-underline rounded',
            'transition-opacity duration-200 ease-linear',
            'hover:opacity-80',
            'focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2',
          )}
          href={item.href}
          aria-label={itemAriaLabel || 'logo link'}
          target="_blank"
          rel="noreferrer noopener"
        >
          {content}
        </a>
      ) : (
        content
      );

      return (
        <li
          className={cx(
            'flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]',
            'mr-[var(--logoloop-gap)]',
            scaleOnHover && 'overflow-visible group/item',
          )}
          key={index}
          role="listitem"
        >
          {inner}
        </li>
      );
    },
    [renderItem, scaleOnHover],
  );

  const logoLists = useMemo(() => {
    return Array.from({ length: copyCount }, (_, copyIndex) => (
      <div className="flex items-center" key={`copy-${copyIndex}`} aria-hidden={copyIndex > 0} ref={copyIndex === 0 ? seqRef : undefined}>
        <ul className="flex items-center" role="list">
          {logos.map((item: any, itemIndex: number) => renderLogoItemInternal(item, itemIndex))}
        </ul>
      </div>
    ));
  }, [copyCount, logos, renderLogoItemInternal]);

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      width: '100%',
      ...cssVariables,
      ...style,
    }),
    [cssVariables, style],
  );

  return (
    <div
      ref={containerRef}
      className={rootClasses}
      style={containerStyle}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {fadeOut && (
        <>
          <div
            aria-hidden
            className={cx(
              'pointer-events-none absolute inset-y-0 left-0 z-10',
              'w-[clamp(24px,8%,120px)]',
              'bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
            )}
          />
          <div
            aria-hidden
            className={cx(
              'pointer-events-none absolute inset-y-0 right-0 z-10',
              'w-[clamp(24px,8%,120px)]',
              'bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]',
            )}
          />
        </>
      )}

      <div
        className={cx('flex will-change-transform select-none relative z-0', 'motion-reduce:transform-none', 'flex-row w-max')}
        ref={trackRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {logoLists}
      </div>
    </div>
  );
};

const MemoizedLogoLoop = memo(LogoLoop);

MemoizedLogoLoop.displayName = 'LogoLoop';

export { MemoizedLogoLoop as LogoLoop };
export default MemoizedLogoLoop;
