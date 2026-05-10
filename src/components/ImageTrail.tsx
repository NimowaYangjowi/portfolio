import { useEffect, useRef, type CSSProperties, type ComponentType, type SVGProps } from 'react';
import { gsap } from 'gsap';
import { FlowerBadge, FlowerBurst, FlowerCluster, FlowerDaisy } from './ui/icons';
import './ImageTrail.css';

type FlowerIconName = 'badge' | 'burst' | 'cluster' | 'daisy';

export type ImageTrailItem =
  | string
  | {
      icon: FlowerIconName;
      color: string;
      rotation?: number;
    };

type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

const flowerIcons: Record<FlowerIconName, IconComponent> = {
  badge: FlowerBadge,
  burst: FlowerBurst,
  cluster: FlowerCluster,
  daisy: FlowerDaisy,
};

const defaultItems: ImageTrailItem[] = [
  { icon: 'daisy', color: 'rgb(var(--brand-coral-rgb))', rotation: -10 },
  { icon: 'burst', color: 'rgb(var(--brand-aura-pink-rgb))', rotation: -22 },
  { icon: 'badge', color: 'rgb(var(--brand-pink-rgb))', rotation: 18 },
  { icon: 'cluster', color: 'rgb(var(--brand-mint-rgb))', rotation: -18 },
  { icon: 'daisy', color: 'rgb(var(--brand-aura-pink-rgb))', rotation: 14 },
  { icon: 'burst', color: 'rgb(var(--brand-coral-rgb))', rotation: 24 },
  { icon: 'badge', color: 'rgb(var(--brand-peach-rgb))', rotation: -14 },
  { icon: 'cluster', color: 'rgb(var(--brand-coral-rgb))', rotation: 10 },
];

function lerp(a: number, b: number, n: number) {
  return (1 - n) * a + n * b;
}

function getLocalPointerPos(e: MouseEvent | TouchEvent, rect: DOMRect) {
  if ('touches' in e && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }

  return {
    x: (e as MouseEvent).clientX - rect.left,
    y: (e as MouseEvent).clientY - rect.top,
  };
}

function getMouseDistance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;

  return Math.hypot(dx, dy);
}

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function getInitialRevealDelays(count: number, revealWindow: number) {
  if (count <= 0) {
    return [];
  }

  const delays = [0];
  const minGap = 110;
  const firstGap = randomBetween(minGap, Math.min(240, revealWindow));
  const remainingWindow = Math.max(minGap, revealWindow - firstGap);

  if (count > 1) {
    delays.push(firstGap);
  }

  if (count > 2) {
    delays.push(firstGap + randomBetween(minGap, remainingWindow));
  }

  while (delays.length < count) {
    delays.push(randomBetween(0, revealWindow));
  }

  return delays;
}

function getRandomPointInContainer(container: HTMLElement) {
  const rect = container.getBoundingClientRect();

  return {
    x: randomBetween(rect.width * 0.16, rect.width * 0.84),
    y: randomBetween(rect.height * 0.32, rect.height * 0.76),
  };
}

class ImageItem {
  DOM: { el: HTMLElement; inner: HTMLElement };
  defaultStyle = { scale: 1, x: 0, y: 0, opacity: 0 };
  rect: DOMRect;
  private resize: () => void;

  constructor(DOMEl: HTMLElement) {
    const inner = DOMEl.querySelector<HTMLElement>('.image-trail__inner');

    if (!inner) {
      throw new Error('ImageTrail inner element not found');
    }

    this.DOM = { el: DOMEl, inner };
    this.rect = this.DOM.el.getBoundingClientRect();
    this.resize = () => {
      gsap.set(this.DOM.el, this.defaultStyle);
      this.getRect();
    };
    window.addEventListener('resize', this.resize);
  }

  getRect() {
    this.rect = this.DOM.el.getBoundingClientRect();
  }

  destroy() {
    window.removeEventListener('resize', this.resize);
    gsap.killTweensOf([this.DOM.el, this.DOM.inner]);
  }
}

class ImageTrailBase {
  protected container: HTMLElement;
  protected images: ImageItem[];
  protected imagesTotal: number;
  protected imgPosition = 0;
  protected zIndexVal = 1;
  protected activeImagesCount = 0;
  protected isIdle = true;
  protected threshold = 80;
  protected cacheLerp = 0.1;
  protected mousePos = { x: 0, y: 0 };
  protected lastMousePos = { x: 0, y: 0 };
  protected cacheMousePos = { x: 0, y: 0 };
  private frameId: number | null = null;
  private hasStarted = false;
  private handlePointerMove: (ev: MouseEvent | TouchEvent) => void;
  private initRender: (ev: MouseEvent | TouchEvent) => void;

  constructor(container: HTMLElement) {
    this.container = container;
    this.images = [...container.querySelectorAll<HTMLElement>('.image-trail__item')].map((img) => new ImageItem(img));
    this.imagesTotal = this.images.length;

    this.handlePointerMove = (ev) => {
      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
    };

    this.initRender = (ev) => {
      if (this.hasStarted) {
        return;
      }

      const rect = this.container.getBoundingClientRect();
      this.mousePos = getLocalPointerPos(ev, rect);
      this.cacheMousePos = { ...this.mousePos };
      this.hasStarted = true;
      this.scheduleRender();
      this.container.removeEventListener('mousemove', this.initRender);
      this.container.removeEventListener('touchmove', this.initRender);
    };

    this.container.addEventListener('mousemove', this.handlePointerMove);
    this.container.addEventListener('touchmove', this.handlePointerMove, { passive: true });
    this.container.addEventListener('mousemove', this.initRender);
    this.container.addEventListener('touchmove', this.initRender, { passive: true });
  }

  destroy() {
    this.container.removeEventListener('mousemove', this.handlePointerMove);
    this.container.removeEventListener('touchmove', this.handlePointerMove);
    this.container.removeEventListener('mousemove', this.initRender);
    this.container.removeEventListener('touchmove', this.initRender);

    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }

    this.images.forEach((image) => image.destroy());
  }

  protected scheduleRender() {
    this.frameId = requestAnimationFrame(() => this.render());
  }

  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);
    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, this.cacheLerp);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, this.cacheLerp);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }

    this.scheduleRender();
  }

  protected nextImage() {
    this.zIndexVal += 1;
    this.imgPosition = this.imgPosition < this.imagesTotal - 1 ? this.imgPosition + 1 : 0;

    return this.images[this.imgPosition];
  }

  protected randomImage() {
    this.zIndexVal += 1;

    if (this.imagesTotal > 1) {
      let nextPosition = Math.floor(Math.random() * this.imagesTotal);

      while (nextPosition === this.imgPosition) {
        nextPosition = Math.floor(Math.random() * this.imagesTotal);
      }

      this.imgPosition = nextPosition;
    }

    return this.images[this.imgPosition];
  }

  protected showNextImage() {}

  showAt(x: number, y: number) {
    const point = { x, y };

    this.mousePos = point;
    this.cacheMousePos = point;
    this.lastMousePos = point;
    this.showNextImage();
  }

  protected onImageActivated() {
    this.activeImagesCount += 1;
    this.isIdle = false;
  }

  protected onImageDeactivated() {
    this.activeImagesCount -= 1;

    if (this.activeImagesCount === 0) {
      this.isIdle = true;
    }
  }
}

class ImageTrailVariant1 extends ImageTrailBase {
  protected showNextImage() {
    const img = this.nextImage();
    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: 'power1',
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      )
      .to(
        img.DOM.el,
        {
          duration: 0.4,
          ease: 'power3',
          opacity: 0,
          scale: 0.2,
        },
        0.4,
      );
  }
}

class ImageTrailVariant2 extends ImageTrailBase {
  protected showNextImage() {
    const img = this.nextImage();
    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        { scale: 2.8, filter: 'brightness(250%)' },
        { duration: 0.4, ease: 'power1', scale: 1, filter: 'brightness(100%)' },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, scale: 0.2 }, 0.45);
  }
}

class ImageTrailVariant3 extends ImageTrailBase {
  protected showNextImage() {
    const img = this.nextImage();
    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          xPercent: 0,
          yPercent: 0,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      )
      .fromTo(img.DOM.inner, { scale: 1.2 }, { duration: 0.4, ease: 'power1', scale: 1 }, 0)
      .to(
        img.DOM.el,
        {
          duration: 0.6,
          ease: 'power2',
          opacity: 0,
          scale: 0.2,
          xPercent: () => gsap.utils.random(-30, 30),
          yPercent: -200,
        },
        0.6,
      );
  }
}

class ImageTrailVariant4 extends ImageTrailBase {
  protected render() {
    const distance = getMouseDistance(this.mousePos, this.lastMousePos);

    if (distance > this.threshold) {
      this.showNextImage();
      this.lastMousePos = { ...this.mousePos };
    }

    this.cacheMousePos.x = lerp(this.cacheMousePos.x, this.mousePos.x, this.cacheLerp);
    this.cacheMousePos.y = lerp(this.cacheMousePos.y, this.mousePos.y, this.cacheLerp);

    if (this.isIdle && this.zIndexVal !== 1) {
      this.zIndexVal = 1;
    }

    this.scheduleRender();
  }

  protected showNextImage() {
    const img = this.nextImage();
    gsap.killTweensOf(img.DOM.el);

    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }

    dx *= distance / 100;
    dy *= distance / 100;

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      )
      .fromTo(
        img.DOM.inner,
        {
          scale: 2,
          filter: `brightness(${Math.max((400 * distance) / 100, 100)}%) contrast(${Math.max(
            (400 * distance) / 100,
            100,
          )}%)`,
        },
        {
          duration: 0.4,
          ease: 'power1',
          scale: 1,
          filter: 'brightness(100%) contrast(100%)',
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: 'power3', opacity: 0 }, 0.4)
      .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 110}`, y: `+=${dy * 110}` }, 0.05);
  }
}

class ImageTrailVariant5 extends ImageTrailVariant4 {
  private lastAngle = 0;

  protected showNextImage() {
    let dx = this.mousePos.x - this.cacheMousePos.x;
    let dy = this.mousePos.y - this.cacheMousePos.y;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    if (angle < 0) {
      angle += 360;
    }

    if (angle > 90 && angle <= 270) {
      angle += 180;
    }

    const isMovingClockwise = angle >= this.lastAngle;
    this.lastAngle = angle;
    const startAngle = isMovingClockwise ? angle - 10 : angle + 10;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance !== 0) {
      dx /= distance;
      dy /= distance;
    }

    dx *= distance / 150;
    dy *= distance / 150;

    const img = this.nextImage();
    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          filter: 'brightness(80%)',
          scale: 0.1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotation: startAngle,
        },
        {
          duration: 1,
          ease: 'power2',
          scale: 1,
          filter: 'brightness(100%)',
          x: this.mousePos.x - img.rect.width / 2 + dx * 70,
          y: this.mousePos.y - img.rect.height / 2 + dy * 70,
          rotation: this.lastAngle,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: 'expo', opacity: 0 }, 0.5)
      .to(img.DOM.el, { duration: 1.5, ease: 'power4', x: `+=${dx * 120}`, y: `+=${dy * 120}` }, 0.05);
  }
}

class ImageTrailVariant6 extends ImageTrailBase {
  protected cacheLerp = 0.3;

  private mapSpeedToSize(speed: number, minSize: number, maxSize: number) {
    const maxSpeed = 200;

    return minSize + (maxSize - minSize) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToBrightness(speed: number, minB: number, maxB: number) {
    const maxSpeed = 70;

    return minB + (maxB - minB) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToBlur(speed: number, minBlur: number, maxBlur: number) {
    const maxSpeed = 90;

    return minBlur + (maxBlur - minBlur) * Math.min(speed / maxSpeed, 1);
  }

  private mapSpeedToGrayscale(speed: number, minG: number, maxG: number) {
    const maxSpeed = 90;

    return minG + (maxG - minG) * Math.min(speed / maxSpeed, 1);
  }

  protected showNextImage() {
    const dx = this.mousePos.x - this.cacheMousePos.x;
    const dy = this.mousePos.y - this.cacheMousePos.y;
    const speed = Math.sqrt(dx * dx + dy * dy);
    const img = this.nextImage();
    const scaleFactor = this.mapSpeedToSize(speed, 0.3, 2);
    const brightnessValue = this.mapSpeedToBrightness(speed, 0, 1.3);
    const blurValue = this.mapSpeedToBlur(speed, 20, 0);
    const grayscaleValue = this.mapSpeedToGrayscale(speed, 600, 0);

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          scale: 0,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.8,
          ease: 'power3',
          scale: scaleFactor,
          filter: `grayscale(${grayscaleValue * 100}%) brightness(${brightnessValue * 100}%) blur(${blurValue}px)`,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      )
      .fromTo(img.DOM.inner, { scale: 2 }, { duration: 0.8, ease: 'power3', scale: 1 }, 0)
      .to(img.DOM.el, { duration: 0.4, ease: 'power3.in', opacity: 0, scale: 0.2 }, 0.45);
  }
}

function getNewPosition(position: number, offset: number, arr: unknown[]) {
  const realOffset = Math.abs(offset) % arr.length;

  if (position - realOffset >= 0) {
    return position - realOffset;
  }

  return arr.length - (realOffset - position);
}

class ImageTrailVariant7 extends ImageTrailBase {
  protected cacheLerp = 0.3;
  private visibleImagesCount = 0;
  private visibleImagesTotal: number;

  constructor(container: HTMLElement) {
    super(container);
    this.visibleImagesTotal = Math.min(9, this.imagesTotal - 1);
  }

  protected showNextImage() {
    const img = this.nextImage();
    this.visibleImagesCount += 1;
    gsap.killTweensOf(img.DOM.el);

    const scaleValue = gsap.utils.random(0.5, 1.6);

    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .fromTo(
        img.DOM.el,
        {
          scale: scaleValue - Math.max(gsap.utils.random(0.2, 0.6), 0),
          rotationZ: 0,
          opacity: 1,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
        },
        {
          duration: 0.4,
          ease: 'power3',
          scale: scaleValue,
          rotationZ: gsap.utils.random(-3, 3),
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
        },
        0,
      );

    if (this.visibleImagesCount >= this.visibleImagesTotal) {
      const lastInQueue = getNewPosition(this.imgPosition, this.visibleImagesTotal, this.images);
      const oldImg = this.images[lastInQueue];

      gsap.to(oldImg.DOM.el, {
        duration: 0.4,
        ease: 'power4',
        opacity: 0,
        scale: 1.3,
        onComplete: () => {
          if (this.activeImagesCount === 0) {
            this.isIdle = true;
          }
        },
      });
    }
  }

  protected onImageDeactivated() {
    this.activeImagesCount -= 1;
  }
}

class ImageTrailVariant8 extends ImageTrailBase {
  private rotation = { x: 0, y: 0 };
  private cachedRotation = { x: 0, y: 0 };
  private zValue = 0;
  private cachedZValue = 0;

  protected showNextImage() {
    const rect = this.container.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const relX = this.mousePos.x - centerX;
    const relY = this.mousePos.y - centerY;

    this.rotation.x = -(relY / centerY) * 30;
    this.rotation.y = (relX / centerX) * 30;
    this.cachedRotation = { ...this.rotation };

    const distanceFromCenter = Math.sqrt(relX * relX + relY * relY);
    const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
    const proportion = distanceFromCenter / maxDistance;
    this.zValue = proportion * 1200 - 600;
    this.cachedZValue = this.zValue;

    const normalizedZ = (this.zValue + 600) / 1200;
    const brightness = 0.2 + normalizedZ * 2.3;
    const img = this.nextImage();

    gsap.killTweensOf(img.DOM.el);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .set(this.container, { perspective: 1000 }, 0)
      .fromTo(
        img.DOM.el,
        {
          opacity: 1,
          z: 0,
          scale: 1 + this.cachedZValue / 1000,
          zIndex: this.zIndexVal,
          x: this.cacheMousePos.x - img.rect.width / 2,
          y: this.cacheMousePos.y - img.rect.height / 2,
          rotationX: this.cachedRotation.x,
          rotationY: this.cachedRotation.y,
          filter: `brightness(${brightness})`,
        },
        {
          duration: 1,
          ease: 'expo',
          scale: 1 + this.zValue / 1000,
          x: this.mousePos.x - img.rect.width / 2,
          y: this.mousePos.y - img.rect.height / 2,
          rotationX: this.rotation.x,
          rotationY: this.rotation.y,
        },
        0,
      )
      .to(img.DOM.el, { duration: 0.4, ease: 'power2', opacity: 0, z: -800 }, 0.3);
  }
}

class ImageTrailVariant9 extends ImageTrailBase {
  protected threshold = 300;

  protected showNextImage() {
    const img = this.randomImage();
    const randomLean = gsap.utils.random(-7, 7);
    const finalX = this.mousePos.x - img.rect.width / 2;
    const finalY = this.mousePos.y - img.rect.height + 14;

    gsap.killTweensOf([img.DOM.el, img.DOM.inner]);
    gsap
      .timeline({
        onStart: () => this.onImageActivated(),
        onComplete: () => this.onImageDeactivated(),
      })
      .set(img.DOM.el, {
        opacity: 1,
        scale: 1,
        zIndex: this.zIndexVal,
        x: finalX,
        y: finalY + 20,
        rotation: randomLean,
        clipPath: 'inset(76% 0% 0% 0%)',
        transformOrigin: '50% 100%',
      })
      .set(img.DOM.inner, {
        scale: 1,
        filter: 'brightness(100%)',
        transformOrigin: '50% 100%',
      })
      .to(img.DOM.el, {
        duration: 0.5,
        ease: 'back.out(1.6)',
        y: finalY - 4,
        rotation: randomLean / 2,
        clipPath: 'inset(0% 0% 0% 0%)',
      })
      .to(img.DOM.el, {
        duration: 0.24,
        ease: 'sine.inOut',
        y: finalY,
        rotation: 0,
      })
      .set(
        img.DOM.el,
        {
          opacity: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
        },
        '+=0.28',
      );
  }
}

const variantMap = {
  1: ImageTrailVariant1,
  2: ImageTrailVariant2,
  3: ImageTrailVariant3,
  4: ImageTrailVariant4,
  5: ImageTrailVariant5,
  6: ImageTrailVariant6,
  7: ImageTrailVariant7,
  8: ImageTrailVariant8,
  9: ImageTrailVariant9,
};

function getItemStyle(item: ImageTrailItem): CSSProperties {
  if (typeof item === 'string') {
    return { backgroundImage: `url(${item})` };
  }

  return {
    '--image-trail-flower-color': item.color,
    '--image-trail-flower-rotation': `${item.rotation ?? 0}deg`,
  } as CSSProperties;
}

type ImageTrailProps = {
  items?: ImageTrailItem[];
  variant?: number;
  initialRevealCount?: number;
  initialRevealWindow?: number;
};

export default function ImageTrail({
  items = [],
  variant = 1,
  initialRevealCount = 0,
  initialRevealWindow = 500,
}: ImageTrailProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const trailItems = items.length > 0 ? items : defaultItems;

  useEffect(() => {
    const container = containerRef.current;

    if (!container || trailItems.length === 0) {
      return undefined;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const Cls = variantMap[variant as keyof typeof variantMap] || variantMap[1];
    const trail = new Cls(container);
    const initialRevealTimeouts = getInitialRevealDelays(initialRevealCount, initialRevealWindow).map((delay) =>
      window.setTimeout(() => {
        const { x, y } = getRandomPointInContainer(container);
        trail.showAt(x, y);
      }, delay),
    );

    return () => {
      initialRevealTimeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      trail.destroy();
    };
  }, [initialRevealCount, initialRevealWindow, variant, trailItems]);

  return (
    <div className="image-trail" ref={containerRef}>
      {trailItems.map((item, index) => {
        const isFlower = typeof item !== 'string';
        const Icon = isFlower ? flowerIcons[item.icon] : null;

        return (
          <div
            className={`image-trail__item ${isFlower ? 'image-trail__item--flower' : 'image-trail__item--image'}`}
            key={index}
          >
            <div className="image-trail__inner" style={getItemStyle(item)}>
              {Icon ? <Icon className="image-trail__flower" size={96} /> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
