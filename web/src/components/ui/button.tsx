import { ComponentProps } from 'react';
import { tv, VariantProps } from 'tailwind-variants';

export const button = tv({
  base: 'flex items-center justify-center rounded-lg outline-none transition-all focus-visible:ring-1 focus-visible:ring-foreground active:transition-none disabled:opacity-60 disabled:pointer-events-none',

  variants: {
    variant: {
      default:
        'bg-border font-medium text-foreground hover:bg-border/90 active:bg-border/80 disabled:bg-border/20',
      primary:
        'bg-primary font-medium text-purple-50 hover:bg-primary/90 active:bg-primary/80 disabled:bg-primary/70',
      success:
        'bg-success font-medium text-green-50 hover:bg-success/90 active:bg-success/80 disabled:bg-success/70',
      warning:
        'bg-warning font-medium text-white hover:bg-warning/90 active:bg-warning/80 disabled:bg-warning/70',
      danger:
        'bg-danger font-medium text-red-50 hover:bg-danger/90 active:bg-danger/80 disabled:bg-danger/70',
      toggle:
        'group rounded-full bg-border/60 hover:bg-border hover:ring-primary focus-visible:ring-primary active:bg-border/80',
      icon: 'invisible hover:bg-border/45',
    },
    size: {
      default: 'text-md py-2.5 px-2',
      minimal: 'p-1.5 text-sm',
      toggle: 'p-2',
      icon: 'p-1',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof button> {}

export const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return <button {...props} className={button({ variant, size, className })} />;
};
