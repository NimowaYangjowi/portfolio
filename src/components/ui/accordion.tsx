import * as AccordionPrimitive from '@radix-ui/react-accordion';
import type { ComponentPropsWithoutRef } from 'react';
import { ChevronDown } from './icons';
import { cn } from '../../lib/utils';

export function Accordion({ className, ...props }: ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root className={cn('ui-accordion', className)} {...props} />;
}

export function AccordionItem({ className, ...props }: ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn('ui-accordion-item', className)} {...props} />;
}

export function AccordionTrigger({ children, className, ...props }: ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="ui-accordion-header">
      <AccordionPrimitive.Trigger className={cn('ui-accordion-trigger', className)} {...props}>
        <span>{children}</span>
        <ChevronDown className="ui-accordion-icon" aria-hidden="true" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, ...props }: ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content className={cn('ui-accordion-content', className)} {...props} />
  );
}
