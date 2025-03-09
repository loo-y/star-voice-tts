import { sampleRate as defaultSampleRate } from '../../shared/constants'
export const fetchAudio = async ({
	audioText,
	SILICONFLOW_API_KEY,
	voice,
	sampleRate,
    format,
}: {
	audioText: string;
	SILICONFLOW_API_KEY: string;
	voice?: string;
	sampleRate?: number;
    format?: string
}): Promise<ArrayBuffer | null> => {
	const siliconflow_api_key = SILICONFLOW_API_KEY || '';
	try {
		let useVoice = `FunAudioLLM/CosyVoice2-0.5B:${voice || 'anna'}`;
		if (voice && voice.indexOf('speech:') > -1) {
			useVoice = voice;
		}
		const response = await fetch(`https://api.siliconflow.cn/v1/audio/speech`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${siliconflow_api_key}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'FunAudioLLM/CosyVoice2-0.5B',
				input: audioText,
				voice: useVoice,
				response_format: format || `mp3`,
				sample_rate: sampleRate || defaultSampleRate,
				stream: false,
			}),
		});
		const result = await response.arrayBuffer();
		console.log(`🐹🐹🐹 fetchAudioPCM result legnth`, result.byteLength);
		return result;
	} catch (e) {
		console.log(`🐹🐹🐹 fetchAudioPCM error`, e);
	}
	return null;
};