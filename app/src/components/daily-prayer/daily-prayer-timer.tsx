"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "../../hooks/use-toast";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const DURATION_OPTIONS = [
  { value: "1", label: "1 min" },
  { value: "3", label: "3 min" },
  { value: "5", label: "5 min" },
  { value: "10", label: "10 min" },
  { value: "15", label: "15 min" },
  { value: "20", label: "20 min" },
];

const DEFAULT_DURATION = "5";

type Props = {
  onComplete: () => void;
};

export default function DailyPrayerTimer({ onComplete }: Props) {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(DEFAULT_DURATION);
  const [timeRemainingInSeconds, setTimeRemainingInSeconds] = useState(
    parseInt(DEFAULT_DURATION) * 60,
  );

  const progress = useMemo(() => {
    if (!isTimerActive) {
      return 0;
    }
    const durationInSeconds = parseInt(timerDuration) * 60;
    return (
      ((durationInSeconds - timeRemainingInSeconds + 1) / durationInSeconds) *
      100
    );
  }, [isTimerActive, timeRemainingInSeconds, timerDuration]);

  const formattedTime = useMemo(() => {
    const mins = Math.floor(timeRemainingInSeconds / 60);
    const secs = timeRemainingInSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, [timeRemainingInSeconds]);

  const handleStartTimer = useCallback(() => {
    setTimeRemainingInSeconds(parseInt(timerDuration) * 60);
    setIsTimerActive(true);
  }, [timerDuration]);

  const handleStopTimer = useCallback(() => {
    setIsTimerActive(false);
  }, []);

  const handleTimerToggle = useCallback(() => {
    if (isTimerActive) {
      handleStopTimer();
    } else {
      handleStartTimer();
    }
  }, [isTimerActive, handleStartTimer, handleStopTimer]);

  const handleFinishPrayer = useCallback(() => {
    handleStopTimer();
    onComplete();
  }, [handleStopTimer, onComplete]);

  const handleDurationChange = useCallback((value: string) => {
    setTimerDuration(value);
    setTimeRemainingInSeconds(parseInt(value) * 60);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemainingInSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingInSeconds((prev) => prev - 1);
      }, 1000);
    } else if (isTimerActive && timeRemainingInSeconds === 0) {
      setIsTimerActive(false);
      onComplete();
      toast({
        title: "Prayer complete!",
        description: "Summarize your prayer and save it.",
      });
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timeRemainingInSeconds, onComplete]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Prayer Timer:</span>
            {isTimerActive ? (
              <span className="text-lg font-bold">{formattedTime}</span>
            ) : (
              <Select
                value={timerDuration}
                onValueChange={handleDurationChange}
                disabled={isTimerActive}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleTimerToggle}
              variant={isTimerActive ? "destructive" : "secondary"}
              size="sm"
            >
              {isTimerActive ? "Stop" : "Start Prayer"}
            </Button>
            {isTimerActive && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleFinishPrayer}
              >
                Finish prayer
              </Button>
            )}
          </div>
        </div>

        {isTimerActive && <Progress value={progress} className="mt-4 h-2" />}
      </CardContent>
    </Card>
  );
}
