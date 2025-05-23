import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WordIterator = () => {
  const [inputText, setInputText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(120);
  const [charThreshold, setCharThreshold] = useState(7);
  const [charOffset, setCharOffset] = useState(150);
  const [periodOffset, setPeriodOffset] = useState(150);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused && words.length > 0 && currentWordIndex < words.length) {
      let delay = speed;
      const currentWord = words[currentWordIndex];

      const isOnlyPeriods = /^\.+$/.test(currentWord);
      if (!isOnlyPeriods) {
        const nonAlphaCount = (currentWord.match(/[^a-zA-Z]/g) || []).length;
        delay += periodOffset * nonAlphaCount;
      }

      const extraDelay = Math.floor(currentWord.length / charThreshold) * charOffset;
      delay += extraDelay;

      timeoutRef.current = setTimeout(() => {
        if (currentWordIndex < words.length - 1) {
          setCurrentWordIndex((prevIndex) => prevIndex + 1);
        } else {
          setIsRunning(false);
        }
      }, delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRunning, isPaused, words, currentWordIndex, speed, charThreshold, charOffset, periodOffset]);

  const handleStart = () => {
    if (inputText.trim()) {
      setWords(inputText.trim().split(/\s+/));
      setCurrentWordIndex(0);
      setIsPaused(false);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused((prev) => !prev);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <div className="w-full max-w-lg space-y-2">
        <label className="block text-lg font-medium">Input Text</label>
        <textarea
          className="w-full h-32 p-2 border rounded resize-none text-base"
          placeholder="Drop your text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>
      <div className="w-full max-w-lg space-y-2">
        <label className="block text-lg font-medium">Base Speed (ms)</label>
        <Input
          type="number"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>
      <div className="w-full max-w-lg space-y-2">
        <label className="block text-lg font-medium">Characters per Offset</label>
        <Input
          type="number"
          value={charThreshold}
          onChange={(e) => setCharThreshold(Number(e.target.value))}
        />
      </div>
      <div className="w-full max-w-lg space-y-2">
        <label className="block text-lg font-medium">Offset per Threshold (ms)</label>
        <Input
          type="number"
          value={charOffset}
          onChange={(e) => setCharOffset(Number(e.target.value))}
        />
      </div>
      <div className="w-full max-w-lg space-y-2">
        <label className="block text-lg font-medium">Non Alphabet character Offset (ms)</label>
        <Input
          type="number"
          value={periodOffset}
          onChange={(e) => setPeriodOffset(Number(e.target.value))}
        />
      </div>
      <div className="flex space-x-4">
        <Button onClick={handleStart} disabled={isRunning}>
          Start
        </Button>
        <Button onClick={handlePause} disabled={!isRunning}>
          {isPaused ? "Resume" : "Pause"}
        </Button>
        <Button onClick={handleStop} disabled={!isRunning}>
          Stop
        </Button>
      </div>
      <div className="text-4xl font-bold text-center">
        {words.length > 0 ? words[currentWordIndex] : ""}
      </div>
    </div>
  );
};

export default WordIterator;
