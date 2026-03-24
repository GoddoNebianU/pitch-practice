// 钢琴键位频率数组 (索引0对应键位1)
export const PIANO_FREQUENCIES: number[] = [
    27.5,      // 键位1  A0
    29.1352,   // 键位2  A♯0/B♭0
    30.8677,   // 键位3  B0
    32.7032,   // 键位4  C1 (Pedal C)
    34.6478,   // 键位5  C♯1/D♭1
    36.7081,   // 键位6  D1
    38.8909,   // 键位7  D♯1/E♭1
    41.2034,   // 键位8  E1
    43.6535,   // 键位9  F1
    46.2493,   // 键位10 F♯1/G♭1
    48.9994,   // 键位11 G1
    51.9131,   // 键位12 G♯1/A♭1
    55.0,      // 键位13 A1
    58.2705,   // 键位14 A♯1/B♭1
    61.7354,   // 键位15 B1
    65.4064,   // 键位16 C2
    69.2957,   // 键位17 C♯2/D♭2
    73.4162,   // 键位18 D2
    77.7817,   // 键位19 D♯2/E♭2
    82.4069,   // 键位20 E2
    87.3071,   // 键位21 F2
    92.4986,   // 键位22 F♯2/G♭2
    97.9989,   // 键位23 G2
    103.826,   // 键位24 G♯2/A♭2
    110.0,     // 键位25 A2
    116.541,   // 键位26 A♯2/B♭2
    123.471,   // 键位27 B2
    130.813,   // 键位28 C3
    138.591,   // 键位29 C♯3/D♭3
    146.832,   // 键位30 D3
    155.563,   // 键位31 D♯3/E♭3
    164.814,   // 键位32 E3
    174.614,   // 键位33 F3
    184.997,   // 键位34 F♯3/G♭3
    195.998,   // 键位35 G3
    207.652,   // 键位36 G♯3/A♭3
    220.0,     // 键位37 A3
    233.082,   // 键位38 A♯3/B♭3
    246.942,   // 键位39 B3
    261.626,   // 键位40 C4 (Middle C/中央C)
    277.183,   // 键位41 C♯4/D♭4
    293.665,   // 键位42 D4
    311.127,   // 键位43 D♯4/E♭4
    329.628,   // 键位44 E4
    349.228,   // 键位45 F4
    369.994,   // 键位46 F♯4/G♭4
    391.995,   // 键位47 G4
    415.305,   // 键位48 G♯4/A♭4
    440.0,     // 键位49 A4 (A440)
    466.164,   // 键位50 A♯4/B♭4
    493.883,   // 键位51 B4
    523.251,   // 键位52 C5
    554.365,   // 键位53 C♯5/D♭5
    587.33,    // 键位54 D5
    622.254,   // 键位55 D♯5/E♭5
    659.255,   // 键位56 E5
    698.456,   // 键位57 F5
    739.989,   // 键位58 F♯5/G♭5
    783.991,   // 键位59 G5
    830.609,   // 键位60 G♯5/A♭5
    880.0,     // 键位61 A5
    932.328,   // 键位62 A♯5/B♭5
    987.767,   // 键位63 B5
    1046.5,    // 键位64 C6
    1108.73,   // 键位65 C♯6/D♭6
    1174.66,   // 键位66 D6
    1244.51,   // 键位67 D♯6/E♭6
    1318.51,   // 键位68 E6
    1396.91,   // 键位69 F6
    1479.98,   // 键位70 F♯6/G♭6
    1567.98,   // 键位71 G6
    1661.22,   // 键位72 G♯6/A♭6
    1760.0,    // 键位73 A6
    1864.66,   // 键位74 A♯6/B♭6
    1975.53,   // 键位75 B6
    2093.0,    // 键位76 C7
    2217.46,   // 键位77 C♯7/D♭7
    2349.32,   // 键位78 D7
    2489.02,   // 键位79 D♯7/E♭7
    2637.02,   // 键位80 E7
    2793.83,   // 键位81 F7
    2959.96,   // 键位82 F♯7/G♭7
    3135.96,   // 键位83 G7
    3322.44,   // 键位84 G♯7/A♭7
    3520.0,    // 键位85 A7
    3729.31,   // 键位86 A♯7/B♭7
    3951.07,   // 键位87 B7
    4186.01,   // 键位88 C8
];

export interface PianoKey {
  index: number;           // 键位编号 (1-88)
  frequency: number;       // 频率 (Hz)
  scientificName: string;  // 科学音高记法名称，如 A4, C4
  noteName: string;        // 音名，如 A, A#, B, C
  octave: number;          // 八度编号
  accidental?: string;     // 变音记号 ('#' 或 'b')，白键无此字段
}

// 音名映射，根据键位索引计算
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// 生成钢琴键数据
export const PIANO_KEYS: PianoKey[] = PIANO_FREQUENCIES.map((freq, index) => {
  const keyIndex = index + 1; // 1-88
  
  // 计算科学音高记法
  // 键位4是C1，键位40是C4 (中央C)
  // 每个八度12个键
  const c4Index = 40; // 中央C的键位编号
  const halfStepsFromC4 = keyIndex - c4Index;
  const octaveOffset = Math.floor(halfStepsFromC4 / 12);
  const noteIndexInOctave = ((halfStepsFromC4 % 12) + 12) % 12;
  
  const noteName = NOTE_NAMES[noteIndexInOctave];
  const octave = 4 + octaveOffset;
  const scientificName = `${noteName}${octave}`;
  
  // 提取基本音名（不含变音记号）
  const baseNoteName = noteName.replace('#', '');
  
  // 为降号提供备用表示（用于显示）
  let accidental: string | undefined;
  let alternateName: string | undefined;
  
  if (noteName.includes('#')) {
    accidental = '#';
    // 计算降号表示
    const flatMap: Record<string, string> = {
      'C#': 'Db',
      'D#': 'Eb',
      'F#': 'Gb',
      'G#': 'Ab',
      'A#': 'Bb'
    };
    alternateName = flatMap[noteName];
  }
  
  return {
    index: keyIndex,
    frequency: freq,
    scientificName,
    noteName: baseNoteName,
    octave,
    accidental,
    ...(alternateName && { alternateScientificName: `${alternateName}${octave}` })
  };
});

export function getFreqOfKey(n: number): number {
    if (n < 1 || n > 88) {
        throw new Error(`Invalid key number: ${n}. Must be between 1 and 88.`);
    }
    return PIANO_FREQUENCIES[n - 1];
}

/**
 * 根据频率查找最接近的钢琴键位数（使用二分查找）
 * @param freq 输入的频率值（Hz）
 * @returns 最接近的键位数（1-88）
 */
export function getKeyByFreq(freq: number): number {
    let left = 0;
    let right = PIANO_FREQUENCIES.length - 1;

    // 二分查找找到插入位置
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (PIANO_FREQUENCIES[mid] < freq) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    // 此时 left 是第一个 >= freq 的位置索引
    // 比较 left 和 left-1，找出更接近的
    if (left === 0) {
        return 1;
    }

    const diffLeft = Math.abs(PIANO_FREQUENCIES[left] - freq);
    const diffPrev = Math.abs(PIANO_FREQUENCIES[left - 1] - freq);

    return diffLeft < diffPrev ? left + 1 : left;
}
