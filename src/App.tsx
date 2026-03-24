import { Play } from 'lucide-react';
import { cn } from './lib/cn';
import { useEffect, useRef, useState } from 'react';
import { PIANO_KEYS, type PianoKey } from './lib/piano';
import { delay } from './lib/delay';
import { emaStep } from './lib/math';

function App() {
  const ctxRef = useRef<null | AudioContext>(null);
  const [accuracy, setAccuracy] = useState(-1);
  const [lastPitch, setLastPitch] = useState("");
  const [showBtns, setShowBtns] = useState(false);

  useEffect(() => {
    ctxRef.current = new AudioContext();
    return () => {
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [ctxRef]);

  const tmp_a = 5;
  const pitches = PIANO_KEYS.filter(
    key =>
      // ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"].some(p => p === key.scientificName)
      ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
        .map(p => p.replace("5", (tmp_a + 1).toString()).replace("4", tmp_a.toString()))
        .some(p => p === key.scientificName)
  );

  const calAccuracy = (bingo: boolean) => {
    if (accuracy === -1) {
      setAccuracy(bingo ? 100 : 0);
    } else {
      setAccuracy(emaStep(accuracy, bingo ? 100 : 0, 0.07));
    }
    setShowBtns(false);
  };

  const playRandomKey = async () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    if (!showBtns) setShowBtns(true);

    const getOsc = () => {
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.type = "sine";
      return osc;
    };
    const playKey = async (k: PianoKey, ms: number) => {
      const osc = getOsc();
      osc.frequency.value = k.frequency;
      osc.start();
      await delay(ms);
      osc.stop();
    };

    const index = Math.floor(Math.random() * 8);
    setLastPitch(pitches[index].scientificName + " " + {
      "C": "Do",
      "D": "Re",
      "E": "Mi",
      "F": "Fa",
      "G": "Sol",
      "A": "La",
      "B": "Si"
    }[pitches[index].noteName] + " " + (index + 1));

    for (const pitch of pitches) {
      await playKey(pitch, 1500 / 8);
    }

    const interval_ms = 200;
    const play_ms = 400;

    await delay(interval_ms);
    await playKey(pitches[0], play_ms);
    await delay(interval_ms);
    await playKey(pitches[0], play_ms);
    await delay(interval_ms);
    await playKey(pitches[0], play_ms);
    await delay(interval_ms);
    await playKey(pitches[index], play_ms);
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
        正确率：{accuracy > 0 ? accuracy.toFixed(2) : "NaN"}%
        <button
          className={cn(
            "p-2 shadow rounded font-bold",
            "flex flex-row items-center justify-center"
          )}
          onClick={playRandomKey}>
          <Play /><span>听</span>
        </button>
        <p className={cn(
          ""
        )}>当前：<span className={cn(
          "hover:bg-white",
          "bg-black"
        )}>{lastPitch}</span></p>
        {showBtns && <div>
          <button
            className={cn(
              "p-2 shadow rounded font-bold",
              "flex flex-row items-center justify-center"
            )}
            onClick={() => calAccuracy(true)}>
            <span>听出来了</span>
          </button>
          <button
            className={cn(
              "p-2 shadow rounded font-bold",
              "flex flex-row items-center justify-center"
            )}
            onClick={() => calAccuracy(false)}>
            <span>没听出来</span>
          </button>
        </div>}
      </div>
    </>
  );
}

export default App;
