export namespace GameAudio {

    export const context = new AudioContext({
        latencyHint: "interactive"
    });

    export const Master = context.createGain();
    Master.connect(context.destination);
    Master.gain.value = 1.0;

    export const SFX = context.createGain();
    SFX.connect(Master);
    SFX.gain.value = 1.0;

    export const samplesPath = [
        "./assets/select_hard.wav",
        "./assets/click.wav",
        "./assets/back.wav",
    ] as const;

    export const samples: Partial<Record<typeof samplesPath[number], AudioBuffer>> = {};

    export async function loadSample(file: typeof samplesPath[number]) {
        let inf = await fetch(file);
        if (inf.ok) {
            let buff = await context.decodeAudioData(await inf.arrayBuffer());
            samples[file] = buff;
            return buff;
        } else return samples[file] = new AudioBuffer({
            length: 0,
            sampleRate: 44100,
            numberOfChannels: 2
        });
    }

    export function loadAllSamples() {
        return Promise.all(samplesPath.map(v => loadSample(v)));
    }

    export async function playSample(file: typeof samplesPath[number], channel = Master, volume = 1.00) {
        let buff = samples[file];
        if (context.state != "running") await context.resume();

        let node = context.createBufferSource();
        node.buffer = buff;

        let gain = context.createGain();
        gain.gain.value = volume;

        gain.connect(channel);
        node.connect(gain);
        node.start(0);
    }

}