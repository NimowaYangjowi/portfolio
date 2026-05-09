import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function IconBase({ size = 18, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </IconBase>
  );
}

export function BriefcaseBusiness(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1" />
      <path d="M4 7h16v12H4z" />
      <path d="M4 12h16" />
      <path d="M9 12v2h6v-2" />
    </IconBase>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m6 9 6 6 6-6" />
    </IconBase>
  );
}

export function Code2(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m18 16 4-4-4-4" />
      <path d="m6 8-4 4 4 4" />
      <path d="m14.5 4-5 16" />
    </IconBase>
  );
}

export function Mail(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </IconBase>
  );
}

export function FlowerBurst({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 2.8c1.76 0 3.18 2.42 3.18 4.12 0 .43-.08.82-.24 1.16.32-.18.72-.28 1.16-.28 1.7 0 4.12 1.42 4.12 3.18s-2.42 3.18-4.12 3.18c-.44 0-.84-.1-1.16-.28.16.34.24.73.24 1.16 0 1.7-1.42 4.12-3.18 4.12s-3.18-2.42-3.18-4.12c0-.43.08-.82.24-1.16-.32.18-.72.28-1.16.28-1.7 0-4.12-1.42-4.12-3.18S6.2 7.8 7.9 7.8c.44 0 .84.1 1.16.28a2.7 2.7 0 0 1-.24-1.16C8.82 5.22 10.24 2.8 12 2.8Z" />
      <circle cx="12" cy="11" r="2.4" fill="rgb(var(--background-rgb))" />
    </svg>
  );
}

export function FlowerCluster({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="12" cy="5.2" rx="3.2" ry="4.2" transform="rotate(12 12 5.2)" />
      <ellipse cx="18" cy="9.2" rx="3.1" ry="4.1" transform="rotate(68 18 9.2)" />
      <ellipse cx="16" cy="16.2" rx="3.1" ry="4.1" transform="rotate(140 16 16.2)" />
      <ellipse cx="8" cy="16.2" rx="3.1" ry="4.1" transform="rotate(220 8 16.2)" />
      <ellipse cx="6" cy="9.2" rx="3.1" ry="4.1" transform="rotate(292 6 9.2)" />
      <circle cx="12" cy="12" r="2" fill="rgb(var(--background-rgb))" />
    </svg>
  );
}

export function FlowerBadge({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <ellipse cx="12" cy="4.8" rx="3.35" ry="4.35" />
      <ellipse cx="18.25" cy="8.4" rx="3.35" ry="4.35" transform="rotate(60 18.25 8.4)" />
      <ellipse cx="18.25" cy="15.6" rx="3.35" ry="4.35" transform="rotate(120 18.25 15.6)" />
      <ellipse cx="12" cy="19.2" rx="3.35" ry="4.35" />
      <ellipse cx="5.75" cy="15.6" rx="3.35" ry="4.35" transform="rotate(60 5.75 15.6)" />
      <ellipse cx="5.75" cy="8.4" rx="3.35" ry="4.35" transform="rotate(120 5.75 8.4)" />
      <circle cx="12" cy="12" r="3.1" fill="rgb(var(--background-rgb))" />
    </svg>
  );
}

export function PanelsTopLeft(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M4 5h16v14H4z" />
      <path d="M4 10h16" />
      <path d="M10 10v9" />
    </IconBase>
  );
}

export function Sparkles(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 3 9.8 8.8 4 11l5.8 2.2L12 19l2.2-5.8L20 11l-5.8-2.2L12 3Z" />
      <path d="M19 3v4" />
      <path d="M21 5h-4" />
    </IconBase>
  );
}
