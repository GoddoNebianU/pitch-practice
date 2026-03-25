import { Pause, Play } from 'lucide-react';
import { cn } from './lib/cn';
import { useEffect, useRef, useState } from 'react';
import { emaStep } from './lib/math';
import { playRandomKey } from './lib/audio';
import { delay } from './lib/delay';
import AccuracyForm from './components/AccuracyForm';
import type { PianoKey } from './lib/piano';

const CDEFGAB = "CDEFGAB";

function App() {
  const ctxRef = useRef<null | AudioContext>(null);
  const [accuracy, setAccuracy] = useState(Array.from({ length: 7 }).fill(-1) as number[]);
  const [lastPitch, setLastPitch] = useState("");
  const [lastKey, setLastKey] = useState<null | PianoKey>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    ctxRef.current = new AudioContext();
    return () => {
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [ctxRef]);

  const onPlayClick = async () => {
    if (!ctxRef.current) return;
    if (!startedRef.current) return;

    await playRandomKey(ctxRef.current, (key) => {
      setLastPitch(key.scientificName + " " + {
        "C": "Do",
        "D": "Re",
        "E": "Mi",
        "F": "Fa",
        "G": "Sol",
        "A": "La",
        "B": "Si"
      }[key.noteName]);
      setLastKey(key);
      setShowAnswer(false);
    });
    await delay(2000);
    setShowAnswer(true);
    setStarted(false);
  };

  const calAccuracy = (bingo: boolean) => {
    if (!lastKey) return;

    const index = CDEFGAB.indexOf(lastKey.noteName);

    if (accuracy[index] === -1) {
      setAccuracy(acc => acc.map((ac, i) => i === index ? bingo ? 100 : 0 : ac));
    } else {
      setAccuracy(acc => acc.map((ac, i) => i === index ? emaStep(ac, bingo ? 100 : 0, 0.07) : ac));
    }
  };

  return (
    <>
      <div className={cn(
        "mx-auto p-8 w-fit my-8",
        "shadow rounded",
        "flex justify-center items-center flex-col",
        "gap-4"
      )}>
        <h1 className={cn(
          "text-4xl"
        )}>建立音感</h1>
        <AccuracyForm accuracy={accuracy} />
        <button
          className={cn(
            "p-2 shadow rounded font-bold",
            "flex flex-row items-center justify-center"
          )}
          onClick={() => {
            if (!started) {
              setStarted(true);
              startedRef.current = true;
              onPlayClick();
            } else {
              setStarted(false);
              startedRef.current = false;
            }
          }}>
          {started && <Pause /> || <Play />}
          <span>{started && "停" || "听"}</span>
        </button>
        {lastPitch.length > 0 && <p className={cn(
          ""
        )}>当前：<button className={cn(
          ""
        )}
          onClick={() => setShowAnswer(b => !b)}>
            {
              (showAnswer && lastKey !== null) && lastKey.scientificName || "点击查看"
            }
          </button></p>}
        <div>
          <button
            className={cn(
              "p-2 shadow rounded font-bold",
              "flex flex-row items-center justify-center"
            )}
            onClick={() => {
              calAccuracy(true);
              if (!started) {
                setStarted(true);
                startedRef.current = true;
                onPlayClick();
              } else {
                setStarted(false);
                startedRef.current = false;
              }
            }}>
            <span>听出来了</span>
          </button>
          <button
            className={cn(
              "p-2 shadow rounded font-bold",
              "flex flex-row items-center justify-center"
            )}
            onClick={() => {
              calAccuracy(false);
              if (!started) {
                setStarted(true);
                startedRef.current = true;
                onPlayClick();
              } else {
                setStarted(false);
                startedRef.current = false;
              }
            }}>
            <span>没听出来</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
