'use client';

import type { FormHTMLAttributes, ReactNode } from 'react';
import { type FieldValues, FormProvider as RHFProvider, type UseFormReturn } from 'react-hook-form';

import { cn } from '@/lib/utils';

type Props<
  TFieldValues extends FieldValues,
  TContext extends object = object,
  TTransformedValues extends FieldValues | undefined = undefined,
> = {
  children: ReactNode;
  methods: UseFormReturn<TFieldValues, TContext, TTransformedValues>;
  onSubmit?: FormHTMLAttributes<HTMLFormElement>['onSubmit'];
  className?: string;
};

export default function FormProvider<
  TFieldValues extends FieldValues,
  TContext extends object = object,
  TTransformedValues extends FieldValues | undefined = undefined,
>({ children, onSubmit, methods, className }: Props<TFieldValues, TContext, TTransformedValues>) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={onSubmit} className={cn('w-full', className)}>
        {children}
      </form>
    </RHFProvider>
  );
}
