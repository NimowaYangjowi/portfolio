import { cva, type VariantProps } from 'class-variance-authority';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

const buttonVariants = cva('ui-button', {
  variants: {
    variant: {
      default: 'ui-button-default',
      secondary: 'ui-button-secondary',
      ghost: 'ui-button-ghost',
    },
    size: {
      sm: 'ui-button-sm',
      md: 'ui-button-md',
      lg: 'ui-button-lg',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

type ButtonBaseProps = VariantProps<typeof buttonVariants> & {
  children: ReactNode;
  className?: string;
};

type ButtonProps =
  | (ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
  | (ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string });

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href);
}

export function Button({ children, className, variant, size, href, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);

  if (href) {
    const anchorProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    const target = anchorProps.target ?? (isExternalHref(href) ? '_blank' : undefined);
    const rel = target === '_blank' ? (anchorProps.rel ?? 'noopener noreferrer') : anchorProps.rel;

    return (
      <a className={classes} href={href} {...anchorProps} target={target} rel={rel}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}
