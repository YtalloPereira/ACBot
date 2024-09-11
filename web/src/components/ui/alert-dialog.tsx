import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog';

import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

interface AlertDialogProps extends ComponentProps<typeof AlertDialogPrimitive.Root> {}

export const AlertDialog = (props: AlertDialogProps) => {
  return <AlertDialogPrimitive.Root {...props} />;
};

interface AlertDialogOverlayProps
  extends ComponentProps<typeof AlertDialogPrimitive.Overlay> {}

export const AlertDialogOverlay = ({ className, ...props }: AlertDialogOverlayProps) => {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay
        className={twMerge(
          'bg-transluced fixed inset-0 z-10 flex items-center justify-center',
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  );
};

interface AlertDialogContentProps
  extends ComponentProps<typeof AlertDialogPrimitive.Content> {}

export const AlertDialogContent = ({ className, ...props }: AlertDialogContentProps) => {
  return (
    <AlertDialogPrimitive.Content
      className={twMerge(
        'bg-background mx-auto flex w-full max-w-lg flex-col gap-5 rounded-xl border p-5 shadow-xl',
        className,
      )}
      {...props}
    />
  );
};

interface AlertDialogTitleProps
  extends ComponentProps<typeof AlertDialogPrimitive.Title> {}

export const AlertDialogTitle = ({ className, ...props }: AlertDialogTitleProps) => {
  return (
    <AlertDialogPrimitive.Title
      className={twMerge('text-xl font-bold', className)}
      {...props}
    />
  );
};

interface AlertDialogDescriptionProps
  extends ComponentProps<typeof AlertDialogPrimitive.Description> {}

export const AlertDialogDescription = ({
  className,
  ...props
}: AlertDialogDescriptionProps) => {
  return (
    <AlertDialogPrimitive.Description
      className={twMerge('text-base font-light leading-relaxed', className)}
      {...props}
    />
  );
};
