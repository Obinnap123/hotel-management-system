"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { ReactNode } from "react";

type ModalProps = {
  title: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function Modal({
  title,
  description,
  trigger,
  children,
  open,
  onOpenChange,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[min(calc(100vw-1.5rem),26rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overflow-x-hidden rounded-xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-md)] sm:max-h-[calc(100dvh-3rem)] sm:w-[min(88vw,34rem)] sm:p-5 md:w-[min(82vw,40rem)] lg:w-[min(76vw,45rem)] xl:w-[calc(100vw-2rem)] xl:max-w-xl">
          <div className="mb-5 flex min-w-0 items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <Dialog.Title className="text-lg font-semibold tracking-tight text-slate-950">
                {title}
              </Dialog.Title>
              {description ? (
                <Dialog.Description className="mt-1 break-words text-sm leading-6 text-slate-600">
                  {description}
                </Dialog.Description>
              ) : null}
            </div>
            <Dialog.Close className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--border)] text-slate-500 transition hover:bg-slate-50 hover:text-slate-900">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Dialog.Close>
          </div>
          <div className="min-w-0 max-w-full overflow-x-hidden">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
