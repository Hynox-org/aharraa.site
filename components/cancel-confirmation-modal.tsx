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
import { Spinner } from "@/components/ui/spinner"; // Import Spinner

interface CancelConfirmationModalProps {
  onConfirm: () => void;
  children: React.ReactNode;
  isCancellingOrder: boolean; // New prop
}

export function CancelConfirmationModal({
  onConfirm,
  children,
  isCancellingOrder, // Destructure new prop
}: CancelConfirmationModalProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently cancel your
            order and remove its data from our servers. A refund will be
            initiated according to our cancellation and refund policy. Please
            check the policy for more details.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isCancellingOrder}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isCancellingOrder}>
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
