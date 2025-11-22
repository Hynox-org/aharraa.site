"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface CancelConfirmationModalProps {
  onConfirm: () => void;
  children: React.ReactNode;
  isCancellingOrder: boolean;
}

export function CancelConfirmationModal({
  onConfirm,
  children,
  isCancellingOrder,
}: CancelConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white border border-gray-200">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-black text-xl font-bold">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">
            This action cannot be undone. This will permanently cancel your
            order and remove its data from our servers. A refund will be
            initiated according to our cancellation and refund policy. Please
            check the policy for more details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isCancellingOrder}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isCancellingOrder}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {isCancellingOrder ? (
              <Spinner className="w-4 h-4 text-white" />
            ) : (
              "Continue"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
