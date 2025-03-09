import { fetchAudio } from '../utils/fetches'
import { type NextRequest } from 'next/server'
import { getEnv } from '../utils'
import { EMOTION_MAP } from '../../shared/types'

export async function GET(request: NextRequest) {
    const headers = request.headers
    const env = await getEnv()
    const STAR_VOICE_TTS_KV = env['STAR_VOICE_TTS_KV']

    const apiKey = env['SILICONFLOW_API_KEY']
    console.log(`apiKey`, apiKey)
    // 确保 apiKey 存在
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key is missing in headers' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }
    const searchParams = request.nextUrl.searchParams
    const message = searchParams.get('message') || ''
    const voice = searchParams.get('voice') || ''
    const emotion = searchParams.get('emotion') || ''
    const input_voice_value = searchParams.get('voice_value') || ''
    const voice_value = (await STAR_VOICE_TTS_KV.get(`voice_${voice}`)) || input_voice_value || ''
    return commonResponse({ message, voice: voice_value, emotion, apiKey })
}
export async function POST(request: Request) {
    const headers = request.headers
    const env = await getEnv()
    const apiKey = env['SILICONFLOW_API_KEY']
    const STAR_VOICE_TTS_KV = env['STAR_VOICE_TTS_KV']

    // 确保 apiKey 存在
    if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key is missing in headers' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const {
        message,
        emotion,
        voice,
        voice_value: input_voice_value,
    } = await (request.json() as Promise<Record<string, any>>)
    const voice_value = (await STAR_VOICE_TTS_KV.get(`voice_${voice}`)) || input_voice_value || ''
    return commonResponse({ message, voice: voice_value, emotion, apiKey })
}

const commonResponse = async ({
    message,
    voice,
    emotion,
    apiKey,
}: {
    message: string
    voice: string
    emotion?: string
    apiKey: string
}) => {
    if (!message || !voice) {
        return new Response(JSON.stringify({ eerror: 'message and voice are missing in headers' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
    try {
        let audioText = message
        if (emotion && EMOTION_MAP?.[emotion]?.desc) {
            audioText = `你能用${EMOTION_MAP[emotion].desc}的情感说吗？<|endofprompt|>${message}`
        }
        const audioBuffer = await fetchAudio({
            audioText,
            SILICONFLOW_API_KEY: apiKey,
            voice,
        })
        // 确保 audioBuffer 是 ArrayBuffer
        if (!(audioBuffer instanceof ArrayBuffer)) {
            console.error('fetchAudioPCM did not return an ArrayBuffer:', audioBuffer)
            return new Response(JSON.stringify({ error: 'Failed to fetch audio data' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        return new Response(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg', // 或者 'audio/wav'，根据实际情况修改
                'Content-Length': audioBuffer.byteLength.toString(), // 设置 Content-Length
            },
        })
    } catch (error) {
        console.error('Error processing request:', error)
        return new Response(
            JSON.stringify({ error: (error as Record<string, any>)?.message || 'Internal Server Error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}
