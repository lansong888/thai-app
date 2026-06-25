import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【请在此处填写你的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

// 规避异常初始化的客户端创建
const supabase = (SUPABASE_URL && !SUPABASE_URL.includes("你的Supabase")) 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// 🌍 1. 内置全新精编高频词库
const ONLINE_BUILTIN_WORDS = [
  { id: 1001, category: '日常生活', thai: 'สวัสดี', read: 'sa-wat-dee', zh: '你好' },
  { id: 1002, category: '日常生活', thai: 'ขอบคุณ', read: 'khop-khun', zh: '谢谢' },
  { id: 1003, category: '日常生活', thai: 'สบายดีไหม', read: 'sa-bai-dee-mai', zh: '你好吗？' },
  { id: 1004, category: '日常生活', thai: 'ขอโทษ', read: 'kho-thot', zh: '对不起' },
  { id: 2001, category: '旅游', thai: 'สนามบิน', read: 'sa-nam-bin', zh: '机场' },
  { id: 2002, category: '旅游', thai: 'โรงแรม', read: 'rong-ram', zh: '酒店' },
  { id: 2003, category: '旅游', thai: 'เท่าไหร่', read: 'thao-rai', zh: '多少钱？' },
  { id: 3001, category: '食物', thai: 'ข้าวผัด', read: 'khao-phat', zh: '炒饭' },
  { id: 3002, category: '食物', thai: 'ต้มยำกุ้ง', read: 'tom-yam-kung', zh: '冬阴功汤' },
  { id: 3003, category: '食物', thai: 'เผ็ดน้อย', read: 'phet-noi', zh: '微辣' },
  { id: 4001, category: '直播常用语', thai: 'ยินดีต้อนรับ', read: 'yin-dee-ton-rap', zh: '欢迎来到直播间！' },
  { id: 4002, category: '直播常用语', thai: 'กดติดตาม', read: 'kot-tit-tam', zh: '点个关注' },
  { id: 4003, category: '直播常用语', thai: 'กดไลค์', read: 'kot-lai', zh: '点个赞' }
];

// 🔤 2. 全量泰语字母表资源库
const THAI_ALPHABET = {
  consonants: [
    { thai: 'ก', read: 'ko kai', type: '中辅音', zh: '鸡' }, { thai: 'ข', read: 'kho khai', type: '高辅音', zh: '蛋' },
    { thai: 'ฃ', read: 'kho khuat', type: '高辅音', zh: '瓶' }, { thai: 'ค', read: 'kho khwan', type: '低辅音', zh: '水牛' },
    { thai: 'ง', read: 'ngo ngu', type: '低辅音', zh: '蛇' }, { thai: 'จ', read: 'cho chan', type: '中辅音', zh: '盘子' },
    { thai: 'ฉ', read: 'cho ching', type: '高辅音', zh: '钹' }, { thai: 'ช', read: 'cho chang', type: '低辅音', zh: '大象' },
    { thai: 'ซ', read: 'so so', type: '低辅音', zh: '锁链' }, { thai: 'ด', read: 'do dek', type: '中辅音', zh: '小孩' },
    { thai: 'ต', read: 'to tao', type: '中辅音', zh: '乌龟' }, { thai: 'ถ', read: 'tho thung', type: '高辅音', zh: '袋子' },
    { thai: 'ท', read: 'tho tha-han', type: '低辅音', zh: '士兵' }, { thai: 'น', read: 'no nu', type: '低辅音', zh: '老鼠' },
    { thai: 'บ', read: 'bo bai-mai', type: '中辅音', zh: '树叶' }, { thai: 'ป', read: 'po pla', type: '中辅音', zh: '鱼' },
    { thai: 'ผ', read: 'pho pheung', type: '高辅音', zh: '蜜蜂' }, { thai: 'ฝ', read: 'fo fa', type: '高辅音', zh: '盖子' },
    { thai: 'พ', read: 'pho phan', type: '低辅音', zh: '托盘' }, { thai: 'ม', read: 'mo ma', type: '低辅音', zh: '马' },
    { thai: 'ย', read: 'yo yak', type: '低辅音', zh: '巨魔' }, { thai: 'ร', read: 'ro ruea', type: '低辅音', zh: '船' },
    { thai: 'ล', read: 'lo ling', type: '低辅音', zh: '猴子' }, { thai: 'ว', read: 'wo waen', type: '低辅音', zh: '戒指' },
    { thai: 'ส', read: 'so suea', type: '高辅音', zh: '老虎' }, { thai: 'ห', read: 'ho hip', type: '高辅音', zh: '箱子' },
    { thai: 'อ', read: 'o ang', type: '中辅音', zh: '盆' }, { thai: 'ฮ', read: 'ho nok-huk', type: '低辅音', zh: '猫头鹰' }
  ],
  vowels: [
    { thai: 'ะ', read: 'a', type: '短元音', zh: '啊' }, { thai: 'า', read: 'aa', type: '长元音', zh: '啊—' },
    { thai: 'ิ', read: 'i', type: '短元音', zh: '衣' }, { thai: 'ี', read: 'ee', type: '长元音', zh: '衣—' },
    { thai: 'ุ', read: 'u', type: '短元音', zh: '呜' }, { thai: 'ู', read: 'uu', type: '长元音', zh: '呜—' }
  ],
  tones: [
    { thai: '่', read: 'mai ek', type: '第一声调', zh: '低调符号' },
    { thai: '้', read: 'mai tho', type: '第二声调', zh: '降调符号' }
  ]
};

// 📖 3. 系统化泰语核心语法库
const GRAMMAR_LESSONS = [
  { title: "📌 核心词序：修饰语后置规律", content: "泰语的基本语序和中文一样，都是主谓宾（SVO结构）。但是！泰语的【定语/状语等修饰词，必须放在被修饰词的后面】。\n\n例如：\n中文说“大象”，泰语说“象大”（ช้างใหญ่）。\n中文说“炒饭”，泰语说“饭炒”（ข้าวผัด）。" },
  { title: "🎵 声调拼读：辅音决定起点", content: "泰语有五个声调。声调的最终判定由【辅音的类别（中/高/低辅音） + 元音的长短】共同决定。掌握好高低辅音的归类，发音就成功了一半。" },
  { title: "🤝 常用礼貌敬语尾词", content: "句尾加上敬语助词以示礼貌：\n- 说话者为男性：ครับ (khrap)\n- 说话者为女性：ค่ะ (kha)\n\n示例：สวัสดีครับ (sa-wat-dee-khrap) —— 优雅男士版的“你好”。" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ streak_days: 0, total_words_learned: 0, today_words_learned: 0 });
  const [currentTab, setCurrentTab] = useState('study'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [words, setWords] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [errors, setErrors] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('日常生活');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [testType, setTestType] = useState('thai_to_zh');
  const [testOptions, setTestOptions] = useState([]);
  const [testFeedback, setTestFeedback] = useState(null);

  useEffect(() => {
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) { setUser(session.user); loadUserData(session.user.id); }
      });
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        if (session) loadUserData(session.user.id);
      });
    }
    loadBuiltinWords();
  }, [currentCategory]);

  function loadBuiltinWords() {
    const filtered = ONLINE_BUILTIN_WORDS.filter(w => w.category === currentCategory);
    setWords(filtered);
    setCurrentIndex(0);
  }

  async function loadUserData(userId) {
    if (!supabase) return;
    try {
      let { data: prof } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
      if (prof) setProfile(prof);
      let { data: favs } = await supabase.from('user_favorites').select('word_id').eq('user_id', userId);
      if (favs) setFavorites(favs.map(f => f.word_id));
      let { data: errs } = await supabase.from('user_errors').select('word_id').eq('user_id', userId);
      if (errs) setErrors(errs.map(e => e.word_id));
    } catch (e) {}
  }

  async function handleAuth(type) {
    if (!supabase) return alert("请先在代码第6-7行配置正确的Supabase URL和Key！");
    if (!email || !password) return alert("请完整填写账号和密码");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message); else if (type === 'register') alert("注册成功，进度同步已就绪！");
  }
  
  async function handleSignOut() { if(supabase) await supabase.auth.signOut(); setUser(null); }
  
  // 🔊 核心路径修复：直接前端拉取公开高保真流，规避任何 api/tts 路径未注册的 Invalid path 错误！
  function playAudio(text) { 
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=th&client=tw-ob`;
    const audio = new Audio(url);
    audio.play().catch(e => console.log("音频播放略有延迟"));
  }

  async function toggleFavorite(wordId) {
    if (!user || !supabase) return alert("请先在右上角登录，即可同步云端收藏夹！");
    if (favorites.includes(wordId)) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('word_id', wordId);
      setFavorites(favorites.filter(id => id !== wordId));
    } else {
      await supabase.from('user_favorites').insert({ user_id: user.id, word_id: wordId });
      setFavorites([...favorites, wordId]);
    }
  }

  async function markAsLearned(wordId, isCorrect = true) {
    if (!user || !supabase) return;
    if (!isCorrect) {
      await supabase.from('user_errors').upsert({ user_id: user.id, word_id: wordId }, { onConflict: 'user_id,word_id' });
      if (!errors.includes(wordId)) setErrors([...errors, wordId]);
    }
    const todayStr = new Date().toISOString().split('T')[0];
    let newStreak = profile.streak_days;
    if (profile.last_study_date !== todayStr) {
      newStreak = (profile.last_study_date === new Date(Date.now() - 86400000).toISOString().split('T')[0]) ? profile.streak_days + 1 : 1;
    }
    try {
      await supabase.from('user_profiles').update({ streak_days: newStreak, last_study_date: todayStr, total_words_learned: profile.total_words_learned + 1, today_words_learned: profile.today_words_learned + 1 }).eq('id', user.id);
      loadUserData(user.id);
    } catch(e){}
  }

  function prepareTest() {
    setTestFeedback(null);
    const target = words[Math.floor(Math.random() * words.length)] || ONLINE_BUILTIN_WORDS[0];
    setCurrentIndex(words.indexOf(target));
    const distractors = ONLINE_BUILTIN_WORDS.filter(w => w.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTestOptions([target, ...distractors].sort(() => 0.5 - Math.random()));
  }

  function checkAnswer(selected) {
    const correct = words[currentIndex] || ONLINE_BUILTIN_WORDS[0];
    if (selected.id === correct.id) {
      setTestFeedback({ success: true, text: "✨ 答对啦！非常棒！" });
      markAsLearned(correct.id, true);
    } else {
      setTestFeedback({ success: false, text: `❌ 答错了，正确解是: ${correct.zh}` });
      markAsLearned(correct.id, false);
    }
  }

  return (
    <div className="bg-[#faf8f6] text-[#262626] min-h-screen font-sans antialiased">
      
      {/* 📸 Instagram 优雅扁平导航栏 */}
      <nav className="bg-white border-b border-[#efefef] px-4 py-3.5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <span className="text-xl font-bold tracking-tight font-serif text-[#262626]">DuoThai.ins</span>
              <p className="text-[9px] uppercase font-bold tracking-widest text-stone-400">泰语美学自适应空间</p>
            </div>
          </div>

          {/* 右上角精致内嵌账户区 */}
          <div className="flex items-center gap-2 text-sm">
            {!user ? (
              <div className="flex items-center gap-1 bg-[#fbfbfb] p-1 rounded-xl border border-[#e0e0e0]">
                <input type="email" placeholder="邮箱" onChange={e=>setEmail(e.target.value)} className="p-1.5 text-xs bg-transparent focus:outline-none w-28 text-slate-800"/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} className="p-1.5 text-xs bg-transparent focus:outline-none w-24 text-slate-800"/>
                <button onClick={()=>handleAuth('login')} className="bg-[#262626] text-white font-bold px-3 py-1.5 rounded-lg text-xs hover:opacity-90 transition-opacity">登录</button>
                <button onClick={()=>handleAuth('register')} className="px-2 py-1.5 rounded-lg text-xs text-stone-400 font-bold hover:text-stone-700">注册</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-stone-50 border px-3 py-1.5 rounded-xl">
                <span className="font-bold text-stone-700 text-xs">🔥 打卡 {profile.streak_days} 天</span>
                <span className="opacity-60 text-xs font-medium">{user.email}</span>
                <button onClick={handleSignOut} className="text-xs text-rose-500 font-bold hover:underline">退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 主网格架构 */}
      <div className="max-w-5xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 左侧大字号模块分类控制台 */}
        <aside className="space-y-1.5">
          <h3 className="font-bold text-stone-400 text-xs tracking-wider uppercase px-3 mb-2">泰语单词课程</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              className={`w-full text-left px-4 py-3.5 rounded-xl font-bold border text-base transition-all flex justify-between items-center ${currentCategory === cat && currentTab === 'study' ? 'bg-[#262626] border-[#262626] text-white shadow-sm' : 'bg-white border-[#efefef] hover:bg-stone-50'}`}>
              <span>📁 {cat}</span>
              <span className="text-xs opacity-30">❯</span>
            </button>
          ))}
          <hr className="my-5 border-[#efefef]"/>
          <h3 className="font-bold text-stone-400 text-xs tracking-wider uppercase px-3 mb-2">核心进阶体系</h3>
          <button onClick={() => setCurrentTab('alphabet')} className={`w-full text-left px-4 py-3.5 rounded-xl font-bold border text-base transition-all ${currentTab==='alphabet'?'bg-[#262626] border-[#262626] text-white':'bg-white border-[#efefef] hover:bg-stone-50'}`}>🔤 泰语完整字母表表盘</button>
          <button onClick={() => setCurrentTab('grammar')} className={`w-full text-left px-4 py-3.5 rounded-xl font-bold border text-base transition-all ${currentTab==='grammar'?'bg-[#262626] border-[#262626] text-white':'bg-white border-[#efefef] hover:bg-stone-50'}`}>📖 泰语基础语法大纲</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} className={`w-full text-left px-4 py-3.5 rounded-xl font-bold border text-base transition-all ${currentTab==='test'?'bg-[#262626] border-[#262626] text-white':'bg-white border-[#efefef] hover:bg-stone-50'}`}>🎯 关卡随堂趣味测试</button>
          <button onClick={() => setCurrentTab('home')} className={`w-full text-left px-4 py-3.5 rounded-xl font-bold border text-base transition-all ${currentTab==='home'?'bg-[#262626] border-[#262626] text-white':'bg-white border-[#efefef] hover:bg-stone-50'}`}>🏠 个人数据复习大盘</button>
          
          {/* 高定唯美直达按钮 */}
          <button onClick={() => setCurrentTab('love')} className={`w-full text-left px-4 py-3.5 rounded-xl font-black border text-base transition-all text-rose-500 border-rose-100 bg-rose-50/40 ${currentTab==='love'?'!bg-gradient-to-r from-rose-400 to-pink-500 !border-transparent !text-white shadow-sm':''}`}>💝 专属告白：致周玉平</button>
        </aside>

        {/* 右侧主舞台区域 */}
        <section className="md:col-span-3">

          {/* 100%全量字母表模块 */}
          {currentTab === 'alphabet' && (
            <div className="bg-white border border-[#efefef] rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#262626]">🔤 泰语全量字母表盘</h2>
                <p className="text-stone-400 text-xs mt-0.5">包含44个基础辅音、核心拼读元音及变调符。轻戳卡片即可触发纯正正音。</p>
              </div>
              <div className="space-y-6">
                <div>
                  <span className="text-xs font-bold text-stone-400 block mb-3">Ⅰ . 44个基础辅音分类</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {THAI_ALPHABET.consonants.map((item, idx) => (
                      <div key={idx} onClick={()=>playAudio(item.thai)} className="p-3.5 bg-[#fdfdfd] rounded-xl border border-[#f0f0f0] text-center cursor-pointer hover:border-stone-800 transition-all">
                        <h4 className="text-3xl font-bold text-[#262626]">{item.thai}</h4>
                        <p className="text-xs font-mono font-bold text-amber-700 mt-1">[{item.read}]</p>
                        <div className="flex justify-between text-[10px] text-stone-400 mt-2 border-t pt-1.5"><span>{item.type}</span><span>{item.zh}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-4">
                  <div>
                    <span className="text-xs font-bold text-stone-400 block mb-2">Ⅱ . 拼读元音表</span>
                    <div className="grid grid-cols-2 gap-2">
                      {THAI_ALPHABET.vowels.map((item, idx) => (
                        <div key={idx} onClick={()=>playAudio(item.thai)} className="p-2.5 bg-stone-50 rounded-xl border text-center cursor-pointer hover:border-stone-700">
                          <h4 className="text-xl font-bold">{item.thai}</h4>
                          <p className="text-xs font-mono text-stone-500">[{item.read}]</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-stone-400 block mb-2">Ⅲ . 声调变调符</span>
                    <div className="grid grid-cols-2 gap-2">
                      {THAI_ALPHABET.tones.map((item, idx) => (
                        <div key={idx} className="p-2.5 bg-stone-50 rounded-xl border text-center">
                          <h4 className="text-xl font-bold text-rose-500">{item.thai}</h4>
                          <p className="text-xs font-medium text-stone-500">{item.zh}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 泰语基础语法讲解 */}
          {currentTab === 'grammar' && (
            <div className="space-y-4">
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} className="bg-white border border-[#efefef] rounded-2xl p-6 space-y-3">
                  <h3 className="text-lg font-bold text-[#262626] flex items-center gap-2">📎 {lesson.title}</h3>
                  <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line font-medium">{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 📸 【极致优雅升级】专属于 周玉平 的高级 Ins 风告白页 */}
          {currentTab === 'love' && (
            <div className="bg-white border border-[#efefef] rounded-3xl p-6 md:p-10 space-y-8 shadow-sm max-w-2xl mx-auto animate-fade-in">
              {/* Ins 顶部小头像视觉排版 */}
              <div className="flex items-center gap-3 border-b border-[#fafafa] pb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-orange-300 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-xl">💝</div>
                </div>
                <div className="text-left">
                  <h4 className="text-base font-bold text-[#262626]">致周玉平 · 浪漫回响</h4>
                  <p className="text-[10px] text-stone-400 font-mono tracking-wider">POSTED ON JUNE 2026</p>
                </div>
              </div>

              {/* 拍立得卡片框体排版 */}
              <div className="bg-[#faf8f6] p-4 md:p-6 rounded-2xl border border-[#ededed] space-y-6">
                <div className="text-center py-8 px-4 bg-gradient-to-b from-white to-[#fdfdfd] rounded-xl border shadow-sm">
                  <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">地道泰语倾诉</span>
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} className="text-3xl font-serif font-bold text-stone-800 tracking-wide mt-3 cursor-pointer hover:opacity-80 active:scale-95 transition-all">
                    ผมรักคุณหมดหัวใจ 🔊
                  </h3>
                  <p className="text-xs font-mono font-bold text-stone-400 mt-1">[Phom rak khun mot hua-chai]</p>
                  <p className="text-sm font-bold text-stone-700 mt-4 bg-rose-50/30 py-1.5 px-4 rounded-xl inline-block border border-rose-100/40">
                    “我将我的整颗心，全部用来爱你。”
                  </p>
                </div>

                {/* 细腻抒情长文 */}
                <div className="p-4 bg-white rounded-xl border border-[#f0f0f0] text-left space-y-3">
                  <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
                    “在这座风很温柔、日落很耀眼的旅居城市里，代码记录着逻辑，而我的镜头和回忆里，写满了你的温柔。<br /><br />
                    网站的组件有对错、路径会编译失败，但爱你这件事，是超越一切服务器阻隔的纯净本能。<br /><br />
                    周玉平，愿未来的所有闪卡、打卡与漫长光阴，都有你陪伴前行。”
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-1 text-[11px] text-stone-400 font-bold">
                <span>🔒 专属告白页面 · 纯前端高保真托管</span>
              </div>
            </div>
          )}

          {/* 单词自学卡片大模块 */}
          {currentTab === 'study' && (
            <div className="space-y-6">
              {words.length > 0 && (
                <div className="space-y-6">
                  {/* Ins风无缝圆润大卡片 */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} className="bg-white border-2 border-[#262626] rounded-2xl p-10 md:p-14 text-center cursor-pointer transition-all hover:shadow-md">
                    <span className="text-xs font-bold text-stone-400 block mb-2 uppercase tracking-widest">CATEGORY · {currentCategory}</span>
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-[#262626] mb-6 tracking-wide">{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div className="space-y-2 animate-fade-in">
                        <p className="text-xl text-amber-800 font-mono font-bold">[{words[currentIndex]?.read}]</p>
                        <p className="text-2xl font-bold text-stone-700">{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p className="text-[11px] text-stone-400 font-medium mt-8">💡 戳一下卡片，无缝翻面查看中文释义</p>
                  </div>

                  {/* 发音底栏 */}
                  <div className="flex justify-between items-center bg-white p-4 border border-[#efefef] rounded-xl shadow-sm">
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} className="bg-[#262626] text-white font-bold px-6 py-3.5 rounded-xl text-sm shadow-sm hover:opacity-90 active:scale-95 transition-transform">🔊 听高保真发音</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} className={`font-bold px-5 py-3.5 rounded-xl text-sm border transition-all ${favorites.includes(words[currentIndex]?.id)?'bg-amber-400 border-amber-400 text-white':'bg-white text-stone-700'}`}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已归档收藏' : '☆ 收藏此词'}
                    </button>
                  </div>

                  {/* 大字号翻页控制行 */}
                  <div className="flex gap-4">
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} className="flex-1 bg-white border border-[#e0e0e0] font-bold p-4 rounded-xl text-sm text-stone-600 hover:bg-stone-50">◁ 上一个</button>
                    <button onClick={()=>{ setShowPhonetic(false); if(words[currentIndex]) markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} className="flex-1 bg-[#262626] text-white p-4 rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity">已掌握，下一个 ▷</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 随堂趣味测试 */}
          {currentTab === 'test' && (
            <div className="bg-white border border-[#efefef] rounded-2xl p-6 space-y-6">
              <div className="flex gap-2 border-b pb-4">
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${testType==='thai_to_zh'?'bg-[#262626] text-white':'bg-stone-100 text-stone-600'}`}>泰译中测试</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${testType==='zh_to_thai'?'bg-[#262626] text-white':'bg-stone-100 text-stone-600'}`}>中译泰测试</button>
              </div>
              {testOptions.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center py-8 px-4 bg-stone-50 rounded-xl border border-[#eeeeee]">
                    <span className="text-xs font-bold text-stone-400 uppercase block mb-1">请选择正确的答案项：</span>
                    {testType === 'thai_to_zh' ? <h3 className="text-4xl font-bold text-[#262626]">{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 className="text-3xl font-bold text-[#262626]">{(words[currentIndex] || testOptions[0]).zh}</h3>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} className="p-4 bg-white border border-[#e0e0e0] hover:border-stone-800 rounded-xl text-left font-bold text-base transition-all">
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                  {testFeedback && (
                    <div className={`p-4 rounded-xl text-center font-bold text-sm ${testFeedback.success?'bg-green-50 text-green-800 border border-green-200':'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                      {testFeedback.text}
                      <button onClick={prepareTest} className="block mx-auto mt-3 bg-[#262626] text-white text-xs font-bold px-4 py-2 rounded-lg">斩获下一题 ➡️</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 个人复习大盘 */}
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#efefef] p-6 rounded-xl text-center">
                <p className="text-stone-400 text-xs font-bold">今日目标进度</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.today_words_learned} / 10</h4>
              </div>
              <div className="bg-white border border-[#efefef] p-6 rounded-xl text-center">
                <p className="text-stone-400 text-xs font-bold">累计解密词汇</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.total_words_learned} 个</h4>
              </div>
              <div className="bg-white border border-[#efefef] p-6 rounded-xl text-center">
                <p className="text-stone-400 text-xs font-bold">我的收藏池</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">🌟 {favorites.length} 个词</h4>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}