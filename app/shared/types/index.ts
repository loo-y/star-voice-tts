// 情感数据类型
interface Emotion {
    value: string
    desc: string
}

// 情感数据
export const EMOTION_MAP: Record<string, Emotion> = {
    happy: { value: 'Happy', desc: '高兴' },
    sad: { value: 'Sad', desc: '悲伤' },
    surprised: { value: 'surprised', desc: '惊讶' },
    angry: { value: 'Angry', desc: '愤怒' },
    fearful: { value: 'Fearful', desc: '恐惧' },
    disgusted: { value: 'Disgusted', desc: '厌恶' },
    calm: { value: 'Calm', desc: '冷静' },
    serious: { value: 'Serious', desc: '严肃' },
}

// 明星数据类型
export interface Celebrity {
    id: string
    name: string
    avatar?: string
    description?: string
}
