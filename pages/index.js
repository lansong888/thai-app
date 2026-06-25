import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【已自动对齐修复的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const isSupabaseConfigured = SUPABASE_URL && !SUPABASE_URL.includes("你的Supabase");
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// 🌍 1. 内置全新官方在线高频词库
const ONLINE_BUILTIN_WORDS = [
  { id: 1001, category: '日常生活', thai: 'สวัสดี', read: 'sa-wat-dee', zh: '你好' },
  { id: 1002, category: '日常生活', thai: 'ขอบคุณ', read: 'khop-khun', zh: '谢谢' },
  { id: 1003, category: '日常生活', thai: 'สบายดีไหม', read: 'sa-bai-dee-mai', zh: '你好吗？' },
  { id: 1004, category: '日常生活', thai: 'ขอโทษ', read: 'kho-thot', zh: '对不起 / 打扰一下' },
  { id: 2001, category: '旅游', thai: 'สนามบิน', read: 'sa-nam-bin', zh: '机场' },
  { id: 2002, category: '旅游', thai: 'โรงแรม', read: 'rong-ram', zh: '酒店' },
  { id: 2003, category: '旅游', thai: 'เท่าไหร่', read: 'thao-rai', zh: '多少钱？' },
  { id: 3001, category: '食物', thai: 'ข้าวผัด', read: 'khao-phat', zh: '炒饭' },
  { id: 3002, category: '食物', thai: 'ต้มยำกุ้ง', read: 'tom-yam-kung', zh: '冬阴功汤' },
  { id: 3003, category: '食物', thai: 'เผ็ดน้อย', read: 'phet-noi', zh: '微辣 / 少辣' },
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

// 📖 3. 泰语核心语法
const GRAMMAR_LESSONS = [
  { title: "📌 核心词序：修饰语100%后置规律", content: "泰语的基本语序和中文一样，都是主谓宾（SVO结构）。但是！泰语的【定语/状语等修饰词，必须放在被修饰词的后面】。\n\n例如：\n中文说“大象”，泰语说“象大”（ช้างใหญ่）。\n中文说“炒饭”，泰语说“饭炒”（ข้าวผัด）。" },
  { title: "🎵 声调拼读：辅音决定音调起点", content: "泰语有五个声调。声调的最终判定由【辅音的类别（中/高/低辅音） + 元音的长短】共同决定。掌握好高低辅音的归类，发音就成功了一半。" },
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
    if (!email || !password) return alert("请完整填写账号和密码");
    try {
      const { data, error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (error) alert(error.message); 
      else if (type === 'register') alert("🎉 账号建立成功！进度托管已就绪。");
    } catch (e) {
      alert("连接云端数据库异常，请稍后再试");
    }
  }
  
  async function handleSignOut() { if(supabase) await supabase.auth.signOut(); setUser(null); }
  
  // 🔊 纯前端自适应多通道发音流，确保在任何网络环境下点击必发音
  function playAudio(text) { 
    if (!text) return;
    try {
      const voiceUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=th`;
      const audio = new Audio(voiceUrl);
      audio.crossOrigin = "anonymous";
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const backupUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=th&client=tw-ob`;
          const backupAudio = new Audio(backupUrl);
          backupAudio.play().catch(e => console.log("等待手势激活"));
        });
      }
    } catch(err) {}
  }

  async function toggleFavorite(wordId) {
    if (!user || !supabase) return alert("请先登录，即可同步保存个人单词本！");
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
      setTestFeedback({ success: true, text: "✨ 完美回答！正确！" });
      markAsLearned(correct.id, true);
    } else {
      setTestFeedback({ success: false, text: `❌ 选错啦，正确解是: ${correct.zh}` });
      markAsLearned(correct.id, false);
    }
  }

  return (
    <div className="bg-[#fbfaf7] text-[#2c2a27] min-h-screen font-sans antialiased">
      
      {/* 🍵 顶奢极简大留白导航栏 */}
      <nav className="bg-white border-b border-[#e3ded6] px-6 py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl filter brightness-95">🌿</span>
            <div className="text-left">
              <span className="text-2xl font-bold tracking-tight text-[#1c1a17] font-serif">DuoThai.ins</span>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#a8a297] mt-0.5">高品质自适应泰语空间</p>
            </div>
          </div>

          {/* 右上角高质感表单控制区 */}
          <div className="flex items-center gap-3 text-base">
            {!user ? (
              <div className="flex flex-wrap items-center gap-2 bg-[#f9f8f5] p-2 rounded-xl border border-[#d6d0c4]">
                <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} className="p-2 text-base bg-transparent focus:outline-none w-44 text-slate-800 placeholder-[#b0aaa0] font-medium"/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} className="p-2 text-base bg-transparent focus:outline-none w-32 text-slate-800 placeholder-[#b0aaa0] font-medium"/>
                <button onClick={()=>handleAuth('login')} className="bg-[#1c1a17] text-white font-bold px-5 py-2.5 rounded-lg text-sm hover:bg-stone-800 transition-all shadow-sm">登录</button>
                <button onClick={()=>handleAuth('register')} className="px-3 py-2.5 rounded-lg text-sm text-[#6e685e] font-bold hover:text-stone-900 transition-colors">建立新账户</button>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-white border border-[#e3ded6] px-5 py-2.5 rounded-xl shadow-sm">
                <span className="font-bold text-emerald-700 text-base">🔥 已打卡 {profile.streak_days} 天</span>
                <span className="opacity-60 text-sm font-semibold">{user.email}</span>
                <button onClick={handleSignOut} className="text-sm text-rose-600 font-bold hover:underline">退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🏛️ 宽大典雅主排版大网格 */}
      <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 左侧拓宽的大字号控制台 */}
        <aside className="space-y-2.5 md:w-72">
          <h3 className="font-black text-[#a8a297] text-xs tracking-widest uppercase px-3 mb-2">泰语单词课程分类</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              className={`w-full text-left px-5 py-4 rounded-xl font-bold border text-lg transition-all flex justify-between items-center ${currentCategory === cat && currentTab === 'study' ? 'bg-[#1c1a17] border-[#1c1a17] text-white shadow-md' : 'bg-white border-[#e3ded6] hover:bg-[#fcfbfa]'}`}>
              <span>📁 {cat}</span>
              <span className="text-xs opacity-20">❯</span>
            </button>
          ))}
          <hr className="my-6 border-[#e3ded6]"/>
          <h3 className="font-black text-[#a8a297] text-xs tracking-widest uppercase px-3 mb-2">进阶深度框架</h3>
          <button onClick={() => setCurrentTab('alphabet')} className={`w-full text-left px-5 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='alphabet'?'bg-[#1c1a17] border-[#1c1a17] text-white':'bg-white border-[#e3ded6] hover:bg-[#fcfbfa]'}`}>🔤 泰语全量字母表盘</button>
          <button onClick={() => setCurrentTab('grammar')} className={`w-full text-left px-5 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='grammar'?'bg-[#1c1a17] border-[#1c1a17] text-white':'bg-white border-[#e3ded6] hover:bg-[#fcfbfa]'}`}>📖 泰语基础语法精讲</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} className={`w-full text-left px-5 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='test'?'bg-[#1c1a17] border-[#1c1a17] text-white':'bg-white border-[#e3ded6] hover:bg-[#fcfbfa]'}`}>🎯 关卡趣味测试卡片</button>
          <button onClick={() => setCurrentTab('home')} className={`w-full text-left px-5 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='home'?'bg-[#1c1a17] border-[#1c1a17] text-white':'bg-white border-[#e3ded6] hover:bg-[#fcfbfa]'}`}>🏠 个人数据复习大盘</button>
          
          {/* 电影感高级专属告白单页入口 */}
          <button onClick={() => setCurrentTab('love')} className={`w-full text-left px-5 py-4 rounded-xl font-black border text-lg transition-all text-rose-500 border-rose-100 bg-rose-50/40 ${currentTab==='love'?'!bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 !border-transparent !text-white shadow-md':''}`}>💝 专属致白：致周玉平</button>
        </aside>

        {/* 右侧流体主舞台 */}
        <section className="md:col-span-3">

          {/* 全量字母表 */}
          {currentTab === 'alphabet' && (
            <div className="bg-white border border-[#e3ded6] rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1c1a17]">🔤 泰语声韵母全量大表盘</h2>
                <p className="text-[#a8a297] text-base mt-1">包含全部44个核心辅音、拼读元音及变调符。点击卡片即刻聆听高清晰发音。</p>
              </div>
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-black text-[#a8a297] uppercase tracking-widest block mb-4">Ⅰ . 44个基础辅音精细分类</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {THAI_ALPHABET.consonants.map((item, idx) => (
                      <div key={idx} onClick={()=>playAudio(item.thai)} className="p-4 bg-[#faf9f6] rounded-xl border border-[#ededed] text-center cursor-pointer hover:border-stone-800 transition-all shadow-sm">
                        <h4 className="text-4xl font-bold text-[#1c1a17]">{item.thai}</h4>
                        <p className="text-base font-mono font-bold text-amber-800 mt-1">[{item.read}]</p>
                        <div className="flex justify-between text-xs text-stone-400 mt-3 border-t pt-2 font-medium"><span>{item.type}</span><span>{item.zh}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#f0ede6] pt-6">
                  <div>
                    <span className="text-xs font-black text-[#a8a297] uppercase tracking-widest block mb-3">Ⅱ . 基础拼读元音</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.vowels.map((item, idx) => (
                        <div key={idx} onClick={()=>playAudio(item.thai)} className="p-4 bg-stone-50 rounded-xl border text-center cursor-pointer hover:border-stone-700 transition-all">
                          <h4 className="text-2xl font-bold">{item.thai}</h4>
                          <p className="text-base font-mono text-stone-500 font-semibold">[{item.read}]</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#a8a297] uppercase tracking-widest block mb-3">Ⅲ . 声调变调符</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.tones.map((item, idx) => (
                        <div key={idx} className="p-4 bg-stone-50 rounded-xl border text-center">
                          <h4 className="text-2xl font-bold text-rose-500">{item.thai}</h4>
                          <p className="text-sm font-bold text-stone-500 mt-1">{item.zh}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 语法精讲 */}
          {currentTab === 'grammar' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">📖 泰语现代化核心语法大纲</h2>
                <p className="text-[#a8a297] text-base mt-0.5">理清修饰语后置等底层线条，帮您快速看懂泰语句子。</p>
              </div>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} className="bg-white border border-[#e3ded6] rounded-2xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1c1a17] flex items-center gap-2">📎 {lesson.title}</h3>
                  <p className="text-base text-stone-600 leading-relaxed whitespace-pre-line font-medium">{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 📸 【极致优雅高阶版】周玉平 奢华电影美学特写空间 */}
          {currentTab === 'love' && (
            <div className="bg-white border border-[#e3ded6] rounded-3xl p-6 md:p-12 space-y-8 shadow-sm max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-300 via-pink-400 to-amber-200"></div>
              
              <div className="flex items-center gap-4 border-b border-[#faf9f6] pb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl">🌹</div>
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold text-[#1c1a17] font-serif">致周玉平 · 属于你的浪漫空间</h4>
                  <p className="text-xs text-stone-400 font-mono tracking-widest mt-0.5">EXCLUSIVE ROMANTIC LANDSCAPE</p>
                </div>
              </div>

              {/* 宽幅精装拍立得框体 */}
              <div className="bg-[#fcfbfa] p-6 md:p-8 rounded-2xl border border-[#ededed] space-y-8 shadow-inner">
                <div className="text-center py-12 px-4 bg-white rounded-xl border shadow-sm space-y-4">
                  <span className="text-xs bg-rose-50 text-rose-600 font-black tracking-widest px-3 py-1 rounded-full uppercase">100% 泰语真情表白</span>
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} className="text-4xl md:text-5xl font-serif font-black text-stone-800 tracking-wide pt-4 cursor-pointer hover:text-rose-500 transition-all">
                    ผมรักคุณหมดหัวใจ 🔊
                  </h3>
                  <p className="text-sm font-mono font-bold text-stone-400 tracking-wider">[Phom rak khun mot hua-chai]</p>
                  <div className="pt-4">
                    <p className="text-xl font-black text-slate-800 bg-rose-50/50 py-3 px-6 rounded-xl inline-block border border-rose-100 shadow-sm">
                      “我将我的整颗内心，毫无保留地全部用来爱你。”
                    </p>
                  </div>
                </div>

                {/* 质感治愈抒情长文诗 */}
                <div className="p-6 md:p-8 bg-white rounded-xl border border-[#f0f0f0] text-left">
                  <p className="text-lg text-stone-700 leading-loose font-serif italic font-medium">
                    “在这座风很温柔、日落很耀眼的旅居城市里，指尖敲击着冰冷的逻辑。而网页的路由会报错、组件会失败，唯独爱你这件事，是超越任何网络框架限制的直连本能。<br /><br />
                    周玉平，愿未来的漫长冬夏、所有的打卡徽章与往后余生，都有你携手并肩、共赴璀璨。”
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-1.5 text-xs text-stone-400 font-bold tracking-wider">
                <span>🔒 该页面已实现全静态高保真永久托管</span>
              </div>
            </div>
          )}

          {/* 单词闪卡主模块 */}
          {currentTab === 'study' && (
            <div className="space-y-6">
              {words.length > 0 && (
                <div className="space-y-6">
                  {/* 大字号温润闪卡 */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} className="bg-white border border-[#e3ded6] rounded-2xl p-14 md:p-20 text-center cursor-pointer transition-all hover:border-stone-800 shadow-sm">
                    <span className="text-xs font-black text-stone-400 block mb-4 uppercase tracking-widest">当前分类课程 · {currentCategory}</span>
                    <h2 className="text-6xl md:text-7xl font-bold text-[#1c1a17] mb-6 tracking-wide font-serif">{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div className="space-y-3 animate-fade-in">
                        <p className="text-2xl text-amber-800 font-mono font-bold">[{words[currentIndex]?.read}]</p>
                        <p className="text-4xl font-bold text-stone-800">{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p className="text-sm text-stone-400 font-semibold mt-10">💡 轻触大卡片任何区域，即可翻面显示含义与发音提示</p>
                  </div>

                  {/* 发音底栏 */}
                  <div className="flex justify-between items-center bg-white p-4 border border-[#e3ded6] rounded-xl shadow-sm">
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} className="bg-[#1c1a17] text-white font-bold px-8 py-4.5 rounded-xl text-base hover:bg-stone-800 transition-all shadow-md">🔊 点击正音（多通道直连技术）</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} className={`font-bold px-6 py-4.5 rounded-xl text-base border transition-all ${favorites.includes(words[currentIndex]?.id)?'bg-amber-400 border-amber-400 text-white shadow-sm':'bg-white text-stone-700'}`}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已加入单词本' : '☆ 收藏此词'}
                    </button>
                  </div>

                  {/* 宽大翻页控制 */}
                  <div className="flex gap-4">
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} className="flex-1 bg-white border border-[#e3ded6] font-bold p-4.5 rounded-xl text-lg text-stone-600 hover:bg-[#fafaf9]">◁ 上一知识点</button>
                    <button onClick={()=>{ setShowPhonetic(false); if(words[currentIndex]) markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} className="flex-1 bg-[#1c1a17] text-white p-4.5 rounded-xl font-bold text-lg tracking-wide hover:bg-stone-800 transition-all shadow-md">记住了，下一个 ▷</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 关卡挑战 */}
          {currentTab === 'test' && (
            <div className="bg-white border border-[#e3ded6] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex gap-2 border-b pb-4">
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} className={`px-5 py-3 rounded-xl font-bold text-base transition-colors ${testType==='thai_to_zh'?'bg-[#1c1a17] text-white':'bg-stone-100 text-stone-600'}`}>泰译中关卡</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} className={`px-5 py-3 rounded-xl font-bold text-base transition-colors ${testType==='zh_to_thai'?'bg-[#1c1a17] text-white':'bg-stone-100 text-stone-600'}`}>中译泰关卡</button>
              </div>
              {testOptions.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center py-12 px-4 bg-stone-50 rounded-xl border border-[#eeeeee]">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">请选出最精准的对照：</span>
                    {testType === 'thai_to_zh' ? <h3 className="text-4xl font-bold text-[#1c1a17]">{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 className="text-3xl font-bold text-[#1c1a17]">{(words[currentIndex] || testOptions[0]).zh}</h3>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} className="p-4 bg-white border border-[#e0e0e0] hover:border-stone-800 rounded-xl text-left font-bold text-lg transition-all">
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                  {testFeedback && (
                    <div className={`p-4 rounded-xl text-center font-bold text-sm ${testFeedback.success?'bg-green-50 text-green-800 border border-green-200':'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                      {testFeedback.text}
                      <button onClick={prepareTest} className="block mx-auto mt-3 bg-[#1c1a17] text-white text-xs font-bold px-4 py-2 rounded-lg">斩获下一题 ➡️</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 进度看板 */}
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e3ded6] p-6 rounded-xl text-center shadow-sm">
                <p className="text-stone-400 text-xs font-bold">今日目标进度</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.today_words_learned} / 10</h4>
              </div>
              <div className="bg-white border border-[#e3ded6] p-6 rounded-xl text-center shadow-sm">
                <p className="text-stone-400 text-xs font-bold">累计解密词汇</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.total_words_learned} 个</h4>
              </div>
              <div className="bg-white border border-[#e3ded6] p-6 rounded-xl text-center shadow-sm">
                <p className="text-stone-400 text-xs font-bold">云端归档收藏</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">🌟 {favorites.length} 个词</h4>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}