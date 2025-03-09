"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Play, Download, Mic, AlertTriangle, Moon, Sun, Heart } from 'lucide-react'
import Head from 'next/head'

// 明星数据类型
interface Celebrity {
  id: string;
  name: string;
  avatar: string;
  description: string;
}

// 情感数据类型
interface Emotion {
    value: string;
    desc: string;
  }

// 模拟明星数据
const celebrities: Celebrity[] = [
  { 
    id: 'celeb1', 
    name: '周杰伦', 
    avatar: '/api/placeholder/100/100', 
    description: '华语流行乐坛天王' 
  },
  { 
    id: 'celeb2', 
    name: '张国荣', 
    avatar: '/api/placeholder/100/100', 
    description: '华语乐坛传奇' 
  },
  { 
    id: 'celeb3', 
    name: '王菲', 
    avatar: '/api/placeholder/100/100', 
    description: '华语乐坛天后' 
  },
  { 
    id: 'celeb4', 
    name: '邓紫棋', 
    avatar: '/api/placeholder/100/100', 
    description: '流行乐坛实力唱将' 
  },
  { 
    id: 'celeb5', 
    name: '林俊杰', 
    avatar: '/api/placeholder/100/100', 
    description: '华语流行乐坛创作歌手' 
  },
]

// 情感数据
const EMOTION_MAP: Record<string, Emotion> = {
    happy: { value: 'Happy', desc: '高兴' },
    sad: { value: 'Sad', desc: '悲伤' },
    surprised: { value: 'surprised', desc: '惊讶' },
    angry: { value: 'Angry', desc: '愤怒' },
    fearful: { value: 'Fearful', desc: '恐惧' },
    disgusted: { value: 'Disgusted', desc: '厌恶' },
    calm: { value: 'Calm', desc: '冷静' },
    serious: { value: 'Serious', desc: '严肃' },
  };

export default function Home() {
    const [selectedCelebrity, setSelectedCelebrity] = useState<Celebrity | null>(null);
    const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
    const [text, setText] = useState<string>('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    const MAX_TEXT_LENGTH = 100;
  
    useEffect(() => {
      // 检查用户偏好的主题
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        
        setIsDarkMode((savedTheme != undefined && (savedTheme === 'dark')));
      }
      
      // 监听窗口大小变化
      const handleResize = () => {
        setIsSmallScreen(window.innerWidth < 768);
      };
      
      handleResize();
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      // 应用暗色/亮色模式
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDarkMode]);
  
    // 切换暗色/亮色模式
    const toggleDarkMode = () => {
      setIsDarkMode(!isDarkMode);
    };
  
    // 模拟生成音频的函数
    const generateAudio = async () => {
      if (!selectedCelebrity || !selectedEmotion || !text.trim()) return;
      
      setIsLoading(true);
      
      // 这里实际项目中应该是调用API生成音频
      // 这里使用setTimeout模拟API调用延迟
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        // 模拟返回的音频URL，实际项目中这应该来自API响应
        setAudioUrl('/api/audio-sample');
      } catch (error) {
        console.error('生成音频出错:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const handlePlayAudio = () => {
      if (audioRef.current && audioUrl) {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      }
    };
  
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };
  
    const handleDownload = () => {
      if (audioUrl && selectedCelebrity) {
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = `${selectedCelebrity.name}_${selectedEmotion}_配音.mp3`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
  
    const handleSelectCelebrity = (celebrity: Celebrity) => {
      setSelectedCelebrity(celebrity);
      setAudioUrl(null);
      setIsPlaying(false);
    };
  
    const handleSelectEmotion = (emotionKey: string) => {
      setSelectedEmotion(emotionKey);
      setAudioUrl(null);
      setIsPlaying(false);
    };
  
    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newText = e.target.value;
      if (newText.length <= MAX_TEXT_LENGTH) {
        setText(newText);
      }
    };
  
    return (
      <div className={`${isDarkMode ? 'dark' : ''}`}>
        <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
          <Head>
            <title>明星声音复刻</title>
            <meta name="description" content="使用AI复刻明星声音" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <main className={`flex min-h-screen flex-col items-center p-4 md:p-8 `}>
            <div className="w-full max-w-6xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  明星声音复刻
                </h1>
                
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label={isDarkMode ? '切换至亮色模式' : '切换至暗色模式'}
                >
                  {isDarkMode ? (
                    <Sun className="h-5 w-5 text-yellow-400" />
                  ) : (
                    <Moon className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 明星和情感选择区域 */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  {/* 明星选择 */}
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Mic className="mr-2 h-5 w-5" />
                      选择明星
                    </h2>
                    
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-3">
                      {celebrities.map((celebrity) => (
                        <div 
                          key={celebrity.id}
                          onClick={() => handleSelectCelebrity(celebrity)}
                          className={`cursor-pointer p-3 rounded-lg transition-all duration-300 text-center ${
                            selectedCelebrity?.id === celebrity.id 
                              ? 'bg-blue-100 dark:bg-blue-900 shadow-md' 
                              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="font-medium">{celebrity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* 情感选择 */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Heart className="mr-2 h-5 w-5" />
                      选择情感
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
                      {Object.entries(EMOTION_MAP).map(([key, emotion]) => (
                        <div 
                          key={key}
                          onClick={() => handleSelectEmotion(key)}
                          className={`cursor-pointer p-3 rounded-lg transition-all duration-300 text-center ${
                            selectedEmotion === key 
                              ? 'bg-purple-100 dark:bg-purple-900 shadow-md' 
                              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                          }`}
                        >
                          <span className="font-medium">{emotion.desc}</span>
                          <span className="text-xs block text-gray-500 dark:text-gray-400">
                            {emotion.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 文本输入和音频生成区域 */}
                <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">输入文本</h2>
                  
                  <div className="mb-4">
                    <textarea
                      value={text}
                      onChange={handleTextChange}
                      placeholder="请输入想要转换的文字内容..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                      rows={5}
                    ></textarea>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <span>{text.length}/{MAX_TEXT_LENGTH}</span>
                      {text.length >= MAX_TEXT_LENGTH && (
                        <span className="text-red-500 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          已达到最大字数限制
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4">
                    <button
                      onClick={generateAudio}
                      disabled={!selectedCelebrity || !selectedEmotion || text.trim() === '' || isLoading}
                      className={`px-6 py-3 rounded-lg flex items-center justify-center transition-all duration-300 ${
                        !selectedCelebrity || !selectedEmotion || text.trim() === '' || isLoading
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          生成中...
                        </>
                      ) : (
                        <>
                          生成音频
                        </>
                      )}
                    </button>
                    
                    {selectedCelebrity && selectedEmotion && !isLoading && (
                      <div className="text-gray-600 dark:text-gray-300 text-sm md:self-center">
                        {audioUrl 
                          ? '音频已生成，可以播放或下载' 
                          : `将以 ${selectedCelebrity.name} 的 ${EMOTION_MAP[selectedEmotion].desc} 音色生成`}
                      </div>
                    )}
                  </div>
                  
                  {/* 音频播放区域 */}
                  {audioUrl && (
                    <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <h3 className="font-medium mb-3 flex items-center">
                        {selectedCelebrity?.name} ({EMOTION_MAP[selectedEmotion || ''].desc}) 的配音
                      </h3>
                      
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={handlePlayAudio}
                          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-all shadow-md"
                        >
                          <Play className={`h-5 w-5 ${isPlaying ? 'hidden' : 'block'}`} />
                          <span className={`h-5 w-5 ${isPlaying ? 'block' : 'hidden'}`}>⏸</span>
                        </button>
                        
                        <div className="flex-1 bg-gray-200 dark:bg-gray-600 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full" style={{ width: isPlaying ? '65%' : '0%', transition: 'width 0.3s linear' }}></div>
                        </div>
                        
                        <button
                          onClick={handleDownload}
                          className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-full transition-all shadow-md"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                      
                      <audio 
                        ref={audioRef} 
                        src={audioUrl} 
                        onEnded={handleAudioEnded}
                        className="hidden"
                      ></audio>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 使用说明 */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">使用说明</h2>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>从左侧选择一位明星</li>
                  <li>选择想要的情感语调</li>
                  <li>在文本框中输入想要用明星声音朗读的内容（最多{MAX_TEXT_LENGTH}字）</li>
                  <li>点击"生成音频"按钮</li>
                  <li>等待几秒钟，音频生成后即可播放或下载</li>
                </ol>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }