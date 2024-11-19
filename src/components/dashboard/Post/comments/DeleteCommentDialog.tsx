import React from "react";
import { useDeleteCommentMutation } from "./mutations";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface DialogDeletePostProps {
  commentId: string;
  open: boolean;
  onClose: () => void;
}

export default function DeleteCommentDialog({
  commentId,
  open,
  onClose,
}: DialogDeletePostProps) {
  const session = useSession();
  const mutation = useDeleteCommentMutation();

  if (!session) return null;

  const handleOpenChange = (open: boolean) => {
    if (!open || !mutation.isPending) {
      onClose();
    }
  };

  const handleDelete = () => {
    mutation.mutate(
      { id: commentId },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete comment?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this comment? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-4">
          <DialogClose asChild>
            <Button type="button" variant="ghost" disabled={mutation.isPending}>
              Cancel
            </Button>
          </DialogClose>

          <Button type="button" variant="destructive" onClick={handleDelete}>
            {mutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}