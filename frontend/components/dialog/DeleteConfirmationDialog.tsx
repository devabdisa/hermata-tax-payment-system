'use client';

import { AlertTriangle, type LucideIcon, X } from 'lucide-react';
import React from 'react';

import PrimaryButton from '../button/PrimaryButton';
import CustomResponsiveDialog from './CustomResponsiveDialog';

interface DeleteConfirmationDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;

  title?: string;
  description?: string;

  cancelLabel?: string;
  confirmLabel?: string;
  deletingLabel?: string;

  maxHeight?: string;

  /** 🔥 Lucide icon instead of SVG */
  icon?: LucideIcon;
  requireExplicitAction?: boolean;
}

const DeleteConfirmationDialog: React.FC<DeleteConfirmationDialogProps> = ({
  title = 'Delete Confirmation',
  description = 'Are you sure you want to delete this item?',
  open,
  setOpen,
  onConfirm,
  isLoading = false,
  cancelLabel = 'Cancel',
  confirmLabel = 'Delete',
  deletingLabel,

  maxHeight = 'sm:max-h-[400px] lg:max-h-[541px]',

  icon: Icon = AlertTriangle,
  requireExplicitAction = false,
}) => {
  const handleClose = () => {
    if (isLoading) {
      return;
    }
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && (isLoading || requireExplicitAction)) {
      return;
    }
    setOpen(nextOpen);
  };

  return (
    <CustomResponsiveDialog
      open={open}
      setOpen={handleOpenChange}
      classNameCloseBtn={requireExplicitAction ? 'hidden' : undefined}
      classNameContent={`bg-background sm:max-w-full sm:h-full lg:max-w-[420px] xl:max-w-[520px] sm:px-3 overflow-y-auto ${maxHeight}`}
      header={
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-1.5'>
            <p className='text-primary font-bold text-lg'>{title}</p>
            <p className='text-foreground text-sm'>{description}</p>
          </div>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className='hidden w-10 h-10 md:flex items-center justify-center rounded-full border border-border hover:border-primary hover:text-primary transition'
          >
            <X size={20} />
          </button>
        </div>
      }
      footer={
        <div className='flex gap-3 justify-end w-full border-t pt-4'>
          <PrimaryButton
            variant='outline'
            title={cancelLabel}
            onClick={handleClose}
            className='h-10 w-32 rounded-lg border-border bg-background text-foreground hover:bg-accent/35'
          />

          <PrimaryButton
            variant='default'
            title={isLoading ? deletingLabel || `${confirmLabel}...` : confirmLabel}
            onClick={onConfirm}
            isLoading={isLoading}
            isDisabled={isLoading}
            className='h-10 w-32 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90'
          />
        </div>
      }
    >
      <div className='flex flex-col items-center justify-center gap-4 py-6'>
        <Icon size={72} className='text-destructive' />

        <p className='text-primary font-semibold text-xl text-center'>{title}</p>

        <p className='text-foreground text-sm text-center max-w-sm'>{description}</p>
      </div>
    </CustomResponsiveDialog>
  );
};

export default DeleteConfirmationDialog;
