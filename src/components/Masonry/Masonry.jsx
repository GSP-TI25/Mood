import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Masonry.scss';

gsap.registerPlugin(ScrollTrigger);

const useMedia = (queries, values, defaultValue) => {
  const get = () =>
    values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;
  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener('change', handler));
    return () =>
      queries.forEach((q) =>
        matchMedia(q).removeEventListener('change', handler),
      );
  }, [queries]);

  return value;
};

const useMeasure = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        }),
    ),
  );
};

const Masonry = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  onItemClick = null,
}) => {
  const columns = useMedia(
    [
      '(min-width:1500px)',
      '(min-width:1000px)',
      '(min-width:600px)',
      '(min-width:400px)',
    ],
    [4, 3, 2, 1],
    1,
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const hasMounted = useRef(false);
  const ctxRef = useRef(gsap.context(() => {}));

  // 🌟 AQUÍ ESTÁ LA MAGIA Y LA SOLUCIÓN AL BUG
  const getInitialPosition = (item) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: item.y - 150 }; // Antes usaba window.innerHeight
      case 'bottom':
        return { x: item.x, y: item.y + 150 }; // 🌟 Antes mandaba la imagen debajo del footer
      case 'left':
        return { x: item.x - 150, y: item.y };
      case 'right':
        return { x: item.x + 150, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2,
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, finalHeight } = useMemo(() => {
    if (!width) return { grid: [], finalHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const gridItems = items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    return { grid: gridItems, finalHeight: Math.max(...colHeights) };
  }, [columns, items, width]);

  useLayoutEffect(() => {
    if (!imagesReady || !grid.length) return;

    if (!hasMounted.current) {
      ctxRef.current.add(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        });

        grid.forEach((item, index) => {
          const selector = `[data-key="${item.id}"]`;
          const initialPos = getInitialPosition(item);

          gsap.set(selector, {
            opacity: 0,
            x: initialPos.x,
            y: initialPos.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' }),
          });

          tl.to(
            selector,
            {
              opacity: 1,
              x: item.x,
              y: item.y,
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: duration,
              ease: ease,
            },
            index * stagger,
          );
        });

        setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      });

      hasMounted.current = true;
    } else {
      ctxRef.current.add(() => {
        grid.forEach((item) => {
          const selector = `[data-key="${item.id}"]`;
          gsap.to(selector, {
            x: item.x,
            y: item.y,
            width: item.w,
            height: item.h,
            duration: duration,
            ease: ease,
            overwrite: 'auto',
          });
        });
      });
    }
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  useEffect(() => {
    return () => ctxRef.current.revert();
  }, []);

  const handleMouseEnter = (e, item) => {
    if (scaleOnHover)
      gsap.to(`[data-key="${item.id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out',
      });
  };

  const handleMouseLeave = (e, item) => {
    if (scaleOnHover)
      gsap.to(`[data-key="${item.id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
  };

  return (
    <div
      ref={containerRef}
      className='list'
      style={{ height: finalHeight }}
    >
      {grid.map((item) => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className='item-wrapper'
            onClick={() =>
              onItemClick
                ? onItemClick(item)
                : window.open(item.url, '_blank', 'noopener')
            }
            onMouseEnter={(e) => handleMouseEnter(e, item)}
            onMouseLeave={(e) => handleMouseLeave(e, item)}
          >
            <div
              className='item-img'
              style={{ backgroundImage: `url(${item.img})` }}
            ></div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
