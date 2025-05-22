"use client";

import { Share } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";

export default function BibleStudyShareQuoteDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" onClick={() => {}}>
          <Share size={16} className="text-blue-500" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Quote</DialogTitle>
          <DialogDescription>
            Share the following quote from scripture
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
