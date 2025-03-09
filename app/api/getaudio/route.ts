import { fetchAudio } from '../utils/fetches'
import { type NextRequest } from 'next/server'
export async function GET(request: NextRequest) {
    const headers = request.headers;
    const STAR_VOICE_TTS_KV = headers.get("x-STAR_VOICE_TTS_KV")
    console.log(`STAR_VOICE_TTS_KV`, STAR_VOICE_TTS_KV)

    const apiKey = headers.get("x-SILICONFLOW_API_KEY") as string;
    // 确保 apiKey 存在
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "API key is missing in headers" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    const searchParams = request.nextUrl.searchParams
    const message = searchParams.get('message') || ''
    const voice = searchParams.get('voice') || ''
    return commonResponse({message, voice, apiKey})
}
export async function POST(request: Request) {
    const headers = request.headers;
    const apiKey = headers.get("x-SILICONFLOW_API_KEY") as string;
    // 确保 apiKey 存在
    if (!apiKey) {
        return new Response(JSON.stringify({ error: "API key is missing in headers" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const { message, voice } = await (request.json() as Promise<Record<string,any>>)
    return commonResponse({message, voice, apiKey})
}


const commonResponse = async ({message, voice, apiKey}: {
    message: string,
    voice: string,
    apiKey: string
})=>{
    if(!message || !voice){
        return new Response(JSON.stringify({ eerror: "message and voice are missing in headers" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    try{
        const audioBuffer = await fetchAudio({
            audioText: message,
            SILICONFLOW_API_KEY: apiKey,
            voice,
        });
        // 确保 audioBuffer 是 ArrayBuffer
        if (!(audioBuffer instanceof ArrayBuffer)) {
            console.error("fetchAudioPCM did not return an ArrayBuffer:", audioBuffer);
            return new Response(JSON.stringify({ error: "Failed to fetch audio data" }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg', // 或者 'audio/wav'，根据实际情况修改
                'Content-Length': audioBuffer.byteLength.toString(), // 设置 Content-Length
            },
        });
       
    }catch(error){
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({ error: (error as Record<string, any>)?.message || "Internal Server Error" }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}