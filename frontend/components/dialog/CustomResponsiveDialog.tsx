import { X } from 'lucide-react';
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { cn } from '@/lib/utils';

interface CustomResponsiveDialogProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  classNameContent?: string;
  classNameBody?: string;
  classNameCloseBtn?: string;
}

export interface CustomResponsiveDialogHandle {
  scrollToTop: () => void;
}

const CustomResponsiveDialog = forwardRef<
  CustomResponsiveDialogHandle,
  CustomResponsiveDialogProps
>(
  (
    { open, setOpen, children, header, footer, classNameContent, classNameBody, classNameCloseBtn },
    ref,
  ) => {
    const bodyRef = useRef<HTMLDivElement | null>(null);

    useImperativeHandle(ref, () => ({
      scrollToTop() {
        bodyRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      },
    }));

    const isDesktop = useMediaQuery('(min-width: 768px)');

    const contentClasses = cn(
      'w-full max-w-lg rounded-xl border-none  [&>button]:hidden  scrollbar-hide bg-background shadow-xl',
      'p-0 flex flex-col overflow-hidden ',
      'max-h-[90dvh] scrollbar-hide', // dynamic viewport height (fixes mobile browser height issues)
      classNameContent,
    );

    const bodyClasses = cn(
      'flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide',
      'px-5 sm:px-8 py-6',
      'scrollbar-thin',
      classNameBody,
    );

    const closeBtnClasses = cn(
      'absolute top-4 right-4 z-50',
      'rounded-full p-2 transition-colors',
      'hover:bg-muted',
      'text-muted-foreground hover:text-foreground',
      'cursor-pointer',
      classNameCloseBtn,
    );

    const CloseButton = (
      <button
        type='button'
        onClick={() => setOpen(false)}
        className={closeBtnClasses}
        aria-label='Close dialog'
      >
        <X className='w-5 h-5' />
      </button>
    );

    if (isDesktop) {
      return (
        <Dialog open={open} onOpenChange={setOpen} modal>
          <DialogContent className={contentClasses}>
            <DialogTitle className='sr-only'>Dialog</DialogTitle>
            {CloseButton}

            {header && <DialogHeader className='px-5 sm:px-8 pt-6 pb-2'>{header}</DialogHeader>}

            <div ref={bodyRef} className={bodyClasses}>
              {children}
            </div>

            {footer && (
              <DialogFooter className='px-5 sm:px-8 pb-6 pt-2 border-t'>{footer}</DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <Drawer open={open} onOpenChange={setOpen} modal>
        <DrawerContent
          className={cn(
            'rounded-t-2xl flex flex-col',
            'max-h-[92dvh]',
            'scrollbar-hide',
            classNameContent,
          )}
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {CloseButton}

          {header && <DrawerHeader className='px-5 pt-6 pb-2'>{header}</DrawerHeader>}

          <div ref={bodyRef} className={bodyClasses}>
            {children}
          </div>

          {footer && <DrawerFooter className='px-5 pb-6 pt-2 border-t'>{footer}</DrawerFooter>}
        </DrawerContent>
      </Drawer>
    );
  },
);

CustomResponsiveDialog.displayName = 'CustomResponsiveDialog';

export default CustomResponsiveDialog;
