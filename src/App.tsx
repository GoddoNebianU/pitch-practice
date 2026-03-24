import { Play } from 'lucide-react';
import { cn } from './lib/cn';
import { useEffect, useRef, useState } from 'react';
import { PIANO_KEYS } from './lib/piano';
import { delay } from './lib/delay';

function App() {
  const ctxRef = useRef<null | AudioContext>(null);
  const [lastPitch, setLastPitch] = useState("");

  useEffect(() => {
    ctxRef.current = new AudioContext();
    return () => {
      ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, [ctxRef]);

  const pitches = PIANO_KEYS.filter(
    key =>
      // ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"].some(p => p === key.scientificName)
      ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"]
        .map(p => p.replace("5", "6").replace("4", "5"))
        .some(p => p === key.scientificName)
  );

  const playRandomKey = async () => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    const getOsc = () => {
      const osc = ctx.createOscillator();
      osc.connect(ctx.destination);
      osc.type = "sine";
      return osc;
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

    let osc = getOsc();
    osc.start();
    for (const pitch of pitches) {
      osc.frequency.value = pitch.frequency;
      await delay(2000 / 8);
    }
    osc.stop();

    await delay(1000);

    osc = getOsc();
    osc.frequency.value = pitches[index].frequency;
    osc.start();
    await delay(1000);
    osc.stop();
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
      </div>
    </>
  );
}

export default App;
