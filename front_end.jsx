import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const WordIterator = () => {
  const [inputText, setInputText] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(150);
  const [charThreshold, setCharThreshold] = useState(10);
  const [charOffset, setCharOffset] = useState(100);
  const [periodOffset, setPeriodOffset] = useState(100);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && words.length > 0 && currentWordIndex < words.length) {
      let delay = speed;
      const currentWord = words[currentWordIndex];

      if (currentWord.endsWith(".")) {
        delay += periodOffset;
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
  }, [isRunning, words, currentWordIndex, speed, charThreshold, charOffset, periodOffset]);

  const handleStart = () => {
    if (inputText.trim()) {
      setWords(inputText.trim().split(/\s+/));
      setCurrentWordIndex(0);
      setIsRunning(true);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
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
        <label className="block text-lg font-medium">Period Offset (ms)</label>
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
