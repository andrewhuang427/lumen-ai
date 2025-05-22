"use client";

import "../../styles/tiptap.css";

import { generateJSON, generateText } from "@tiptap/react";
import { useCallback, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { api } from "../../trpc/react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import DailyPrayerEditor, {
  dailyPrayerEditorExtensions,
} from "./daily-prayer-editor";
import DailyPrayerTimer from "./daily-prayer-timer";

type Props = {
  isDefaultShown?: boolean;
};

export default function DailyPrayer({ isDefaultShown = false }: Props) {
  const [isShown, setIsShown] = useState(isDefaultShown);

  return (
    <Dialog open={isShown} onOpenChange={setIsShown}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-2 right-2 z-50 h-12 w-12 rounded-full bg-muted text-lg shadow-md"
        >
          🙏
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Daily Prayer</DialogTitle>
          <DialogDescription>
            Prayer is our way of connecting with God and taking our needs to
            Him. It can be a prayer of thanksgiving, a prayer of supplication,
            or a prayer of praise.
            <br />
            <br />
            Take a moment to pray for yourself and for others.
          </DialogDescription>
        </DialogHeader>
        <DailyPrayerForm onClose={() => setIsShown(false)} />
      </DialogContent>
    </Dialog>
  );
}

function DailyPrayerForm({ onClose }: { onClose?: () => void }) {
  const [isPrayerTimerShown, setIsPrayerTimerShown] = useState(true);
  const [prayer, setPrayer] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { mutate: createDailyPrayer, isPending: isCreatingDailyPrayer } =
    api.user.createDailyPrayer.useMutation();

  function handleSave() {
    if (!prayer.trim()) {
      toast({
        title: "Prayer cannot be empty",
        description: "Please enter your prayer before saving.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);

      console.log({ prayer });

      const prayerJson = generateJSON(prayer, dailyPrayerEditorExtensions);
      const plainText = generateText(prayerJson, dailyPrayerEditorExtensions);

      console.log({ plainText, prayerJson });
      // createDailyPrayer({
      //   prayerText: html,
      //   prayerJson,
      // });
      toast({
        title: "Prayer saved",
        description: "Your daily prayer has been saved.",
      });
    } catch (error) {
      toast({
        title: "Error saving prayer",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }

  const handleFinishPrayer = useCallback(() => {
    setIsPrayerTimerShown(false);
  }, []);

  return (
    <>
      {isPrayerTimerShown ? (
        <>
          <DailyPrayerTimer onComplete={handleFinishPrayer} />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogFooter>
        </>
      ) : (
        <>
          <DailyPrayerEditor value={prayer} onChange={setPrayer} />
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!prayer.trim()}>
              Save
            </Button>
          </DialogFooter>
        </>
      )}
    </>
  );
}
