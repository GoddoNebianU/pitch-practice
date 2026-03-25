import { delay } from "./delay";
import { PIANO_KEYS, type PianoKey } from "./piano";

const range = (([start, end]: [string, string]) => {
    const CDEFGAB = "CDEFGAB";

    const a1 = start[0];
    const a2 = end[0];
    const n1 = Number(start[1]);
    const n2 = Number(end[1]);

    if (n1 === n2)
        return CDEFGAB
            .slice(CDEFGAB.indexOf(a1), CDEFGAB.indexOf(a2) + 1).split("")
            .map(r => r + n1.toString());

    if (n2 - n1 > 1) {
        // 处理跨多个八度的情况
        const result: string[] = [];

        // 第一个八度：从a1到G
        const firstOctave = CDEFGAB
            .slice(CDEFGAB.indexOf(a1))
            .split("")
            .map(r => r + n1.toString());
        result.push(...firstOctave);

        // 中间完整的八度
        for (let octave = n1 + 1; octave < n2; octave++) {
            const fullOctave = CDEFGAB
                .split("")
                .map(r => r + octave.toString());
            result.push(...fullOctave);
        }

        // 最后一个八度：从C到a2
        const lastOctave = CDEFGAB
            .slice(0, CDEFGAB.indexOf(a2) + 1)
            .split("")
            .map(r => r + n2.toString());
        result.push(...lastOctave);

        return result;
    }

    // n2 - n1 === 1 的情况（相邻八度）
    const firstOctave = CDEFGAB
        .slice(CDEFGAB.indexOf(a1))
        .split("")
        .map(r => r + n1.toString());

    const secondOctave = CDEFGAB
        .slice(0, CDEFGAB.indexOf(a2) + 1)
        .split("")
        .map(r => r + n2.toString());

    return [...firstOctave, ...secondOctave];
})(["C5", "C6"]);
const root = "C5";

export const playRandomKey = async (ctx: AudioContext, callback: (key: PianoKey) => void) => {
    const getOsc = () => {
        const osc = ctx.createOscillator();
        osc.connect(ctx.destination);
        osc.type = "sine";
        osc.onended = osc.disconnect;
        return osc;
    };
    const findKey = (sn: string) => PIANO_KEYS.filter(k => k.scientificName === sn)[0];

    const playKey = async (sn: string, ms: number) => {
        const osc = getOsc();
        osc.frequency.value = findKey(sn).frequency;
        osc.start();
        await delay(ms);
        osc.stop();
    };

    const index = Math.floor(Math.random() * range.length);
    callback(findKey(range[index]));

    for (const pitch of range) {
        await playKey(pitch, 1500 / range.length);
    }

    const interval_ms = 100;
    const play_ms = 300;

    await delay(interval_ms);
    await playKey(root, play_ms);
    await delay(interval_ms);
    await playKey(root, play_ms);
    await delay(interval_ms);
    await playKey(root, play_ms);
    await delay(interval_ms);
    await playKey(range[index], play_ms);
};