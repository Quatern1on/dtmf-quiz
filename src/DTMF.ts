export enum Key {
    k1,
    k2,
    k3,
    k4,
    k5,
    k6,
    k7,
    k8,
    k9,
    kAsterisk,
    k0,
    kHash,
}

const COLUMN_FREQUENCIES = [1209, 1336, 1477, 1633];

const ROW_FREQUENCIES = [697, 770, 852, 941];

class _DTMF {
    private readonly context: AudioContext;
    private readonly gain: GainNode;
    private oscillatorRow: OscillatorNode | undefined;
    private oscillatorColumn: OscillatorNode | undefined;
    private _volume: number;

    public constructor() {
        this.context = new AudioContext();
        this.gain = this.context.createGain();
        this.gain.connect(this.context.destination);
        this._volume = 0.5;
    }

    public get volume(): number {
        return this._volume * 2;
    }

    public set volume(value: number) {
        this._volume = value / 2;
    }

    public playKey(key: Key, time?: number) {
        const column = key % 3;
        const row = Math.floor(key / 3);

        this.playColumn(column);
        this.playRow(row);

        if (time) {
            setTimeout(() => {
                this.stop();
            }, time);
        }
    }

    public playColumn(column: number, time?: number) {
        if (this.oscillatorColumn !== undefined) {
            this.stop();
        }

        this.gain.gain.cancelScheduledValues(0);
        this.gain.gain.value = 0.00001;
        this.gain.gain.exponentialRampToValueAtTime(this._volume, this.context.currentTime + 0.005);

        this.oscillatorColumn = this.context.createOscillator();
        this.oscillatorColumn.frequency.value = COLUMN_FREQUENCIES[column];
        this.oscillatorColumn.connect(this.gain);
        this.oscillatorColumn.start();

        if (time) {
            setTimeout(() => {
                this.stop();
            }, time);
        }
    }

    public playRow(row: number, time?: number) {
        if (this.oscillatorRow !== undefined) {
            this.stop();
        }

        this.gain.gain.cancelScheduledValues(0);
        this.gain.gain.value = 0.00001;
        this.gain.gain.exponentialRampToValueAtTime(this._volume, this.context.currentTime + 0.005);

        this.oscillatorRow = this.context.createOscillator();
        this.oscillatorRow.frequency.value = ROW_FREQUENCIES[row];
        this.oscillatorRow.connect(this.gain);
        this.oscillatorRow.start();

        if (time) {
            setTimeout(() => {
                this.stop();
            }, time);
        }
    }

    public stop() {
        this.gain.gain.value = this._volume;
        this.gain.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + 0.01);

        const oscColumn = this.oscillatorColumn;
        this.oscillatorColumn = undefined;
        const oscRow = this.oscillatorRow;
        this.oscillatorRow = undefined;

        setTimeout(() => {
            oscColumn?.stop();
            oscColumn?.disconnect();
            oscRow?.stop();
            oscRow?.disconnect();
        }, 10);
    }
}

export const DTMF = new _DTMF();
