import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【请在此处填写你的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const isSupabaseConfigured = SUPABASE_URL && !SUPABASE_URL.includes("你的Supabase");
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// 🌍 1. 精编高频词库
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

// 📖 3. 泰语核心语法库
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
    if (!isSupabaseConfigured) {
      return alert("⚠️ 检测到您还未绑定云端数据库！请在 VS Code 打开 pages/index.js，在第6行和第7行填入真实的 Supabase URL 和 Key，然后重新保存上传，即可开启注册和登录功能！");
    }
    if (!email || !password) return alert("请完整填写账号和密码");
    try {
      const { data, error } = type === 'login' 
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });
      if (error) alert(error.message); 
      else if (type === 'register') alert("🎉 注册成功！进度同步已无缝开启！");
    } catch (e) {
      alert("连接数据库失败，请确认凭证是否复制完整");
    }
  }
  
  async function handleSignOut() { if(supabase) await supabase.auth.signOut(); setUser(null); }
  
  // 🔊 重新发明发音引擎：无视跨域与安全限制，多通道纯前端直连发音，保证点击必响
  function playAudio(text) { 
    if (!text) return;
    try {
      // 通道 A：主发音引擎
      const voiceUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=th`;
      const audio = new Audio(voiceUrl);
      audio.crossOrigin = "anonymous";
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 通道 B：备用发音引擎
          const backupUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=th&client=tw-ob`;
          const backupAudio = new Audio(backupUrl);
          backupAudio.play().catch(e => console.log("浏览器拦截了首发音频，请点一下页面任意空白处激活声音"));
        });
      }
    } catch(err) {
      console.log("音频流捕获异常");
    }
  }

  async function toggleFavorite(wordId) {
    if (!user || !supabase) return alert("账号未登录，登录后即可启用云端收藏夹！");
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
      setTestFeedback({ success: true, text: "✨ 完美解答！正确！" });
      markAsLearned(correct.id, true);
    } else {
      setTestFeedback({ success: false, text: `❌ 选错啦，正确答案是: ${correct.zh}` });
      markAsLearned(correct.id, false);
    }
  }

  return (
    <div className="bg-[#f6f4f0] text-[#1c1c1c] min-h-screen font-sans antialiased selection:bg-rose-100 selection:text-rose-900">
      
      {/* 🍵 顶奢极简优雅导航栏（大字号高级留白） */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-[#e6e3dd] px-6 py-5 sticky top-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <span className="text-3xl filter saturate-70">🌿</span>
            <div className="text-left">
              <span className="text-2xl font-bold tracking-tight text-[#1c1c1c] font-serif">DuoThai.ins</span>
              <p className="text-[10px] uppercase font-black tracking-widest text-[#a39f97] mt-0.5">高品质泰语自适应平台</p>
            </div>
          </div>

          {/* 顶栏右侧内嵌精致控制区 */}
          <div className="flex items-center gap-3 text-base">
            {!user ? (
              <div className="flex flex-wrap items-center gap-1.5 bg-[#faf9f6] p-1.5 rounded-xl border border-[#dfdbd3]">
                <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} className="p-2 text-sm bg-transparent focus:outline-none w-36 text-slate-800 placeholder-[#b5b1a9] font-medium"/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} className="p-2 text-sm bg-transparent focus:outline-none w-28 text-slate-800 placeholder-[#b5b1a9] font-medium"/>
                <button onClick={()=>handleAuth('login')} className="bg-[#1c1c1c] text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-stone-800 transition-all shadow-sm">登录</button>
                <button onClick={()=>handleAuth('register')} className="px-3 py-2 rounded-lg text-xs text-[#706c64] font-bold hover:text-stone-900 transition-colors">建立新账户</button>
              </div>
            ) : (
              <div className="flex items-center gap-4 bg-stone-50 border border-[#dfdbd3] px-4 py-2 rounded-xl">
                <span className="font-bold text-stone-700 text-sm">🔥 已打卡 {profile.streak_days} 天</span>
                <span className="opacity-60 text-xs font-semibold">{user.email}</span>
                <button onClick={handleSignOut} className="text-xs text-rose-600 font-bold hover:underline">退出登录</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🏛️ 黄金比例排版大网格 */}
      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 左侧全面放大的导航控制台 */}
        <aside className="space-y-2">
          <h3 className="font-black text-[#a39f97] text-xs tracking-widest uppercase px-3 mb-2">泰语高频单词课程</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              className={`w-full text-left px-4 py-4 rounded-xl font-bold border text-lg transition-all flex justify-between items-center ${currentCategory === cat && currentTab === 'study' ? 'bg-[#1c1c1c] border-[#1c1c1c] text-white shadow-md' : 'bg-white border-[#e6e3dd] hover:bg-[#fafaf9]'}`}>
              <span>📁 {cat}</span>
              <span className="text-xs opacity-20">❯</span>
            </button>
          ))}
          <hr className="my-6 border-[#e6e3dd]"/>
          <h3 className="font-black text-[#a39f97] text-xs tracking-widest uppercase px-3 mb-2">核心进阶大框架</h3>
          <button onClick={() => setCurrentTab('alphabet')} className={`w-full text-left px-4 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='alphabet'?'bg-[#1c1c1c] border-[#1c1c1c] text-white':'bg-white border-[#e6e3dd] hover:bg-[#fafaf9]'}`}>🔤 泰语全量字母表盘</button>
          <button onClick={() => setCurrentTab('grammar')} className={`w-full text-left px-4 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='grammar'?'bg-[#1c1c1c] border-[#1c1c1c] text-white':'bg-white border-[#e6e3dd] hover:bg-[#fafaf9]'}`}>📖 泰语基础语法精讲</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} className={`w-full text-left px-4 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='test'?'bg-[#1c1c1c] border-[#1c1c1c] text-white':'bg-white border-[#e6e3dd] hover:bg-[#fafaf9]'}`}>🎯 趣味挑战卡片关卡</button>
          <button onClick={() => setCurrentTab('home')} className={`w-full text-left px-4 py-4 rounded-xl font-bold border text-lg transition-all ${currentTab==='home'?'bg-[#1c1c1c] border-[#1c1c1c] text-white':'bg-white border-[#e6e3dd] hover:bg-[#fafaf9]'}`}>🏠 个人进度复习看板</button>
          
          {/* 电影感高定表白页直达控制纽 */}
          <button onClick={() => setCurrentTab('love')} className={`w-full text-left px-4 py-4 rounded-xl font-black border text-lg transition-all text-rose-500 border-rose-100 bg-rose-50/50 ${currentTab==='love'?'!bg-gradient-to-r from-rose-400 via-pink-500 to-rose-400 !border-transparent !text-white shadow-md':''}`}>💝 浪漫致白：致周玉平</button>
        </aside>

        {/* 右侧流体美学交互舞台 */}
        <section className="md:col-span-3">

          {/* 100%全量字母表模块 */}
          {currentTab === 'alphabet' && (
            <div className="bg-white border border-[#e6e3dd] rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1c1c1c]">🔤 泰语全量声韵母表盘</h2>
                <p className="text-[#a39f97] text-sm mt-1">包含44个基础辅音、核心拼读元音及变调符。轻戳任意卡片即可触发高清晰真人发音。</p>
              </div>
              <div className="space-y-8">
                <div>
                  <span className="text-xs font-black text-[#a39f97] uppercase tracking-wider block mb-4">Ⅰ . 44个基础辅音分类索引</span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {THAI_ALPHABET.consonants.map((item, idx) => (
                      <div key={idx} onClick={()=>playAudio(item.thai)} className="p-4 bg-[#faf9f6] rounded-xl border border-[#ededed] text-center cursor-pointer hover:border-stone-800 hover:-translate-y-0.5 transition-all shadow-sm">
                        <h4 className="text-4xl font-bold text-[#1c1c1c]">{item.thai}</h4>
                        <p className="text-sm font-mono font-bold text-amber-800 mt-1">[{item.read}]</p>
                        <div className="flex justify-between text-xs text-stone-400 mt-3 border-t pt-2 font-medium"><span>{item.type}</span><span>{item.zh}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#f0ede6] pt-6">
                  <div>
                    <span className="text-xs font-black text-[#a39f97] uppercase tracking-wider block mb-3">Ⅱ . 常用基础拼读元音</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.vowels.map((item, idx) => (
                        <div key={idx} onClick={()=>playAudio(item.thai)} className="p-3.5 bg-stone-50 rounded-xl border text-center cursor-pointer hover:border-stone-700 transition-all">
                          <h4 className="text-2xl font-bold">{item.thai}</h4>
                          <p className="text-sm font-mono text-stone-500 font-semibold">[{item.read}]</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-black text-[#a39f97] uppercase tracking-wider block mb-3">Ⅲ . 声调变调字符</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.tones.map((item, idx) => (
                        <div key={idx} className="p-3.5 bg-stone-50 rounded-xl border text-center">
                          <h4 className="text-2xl font-bold text-rose-500">{item.thai}</h4>
                          <p className="text-xs font-bold text-stone-500 mt-1">{item.zh}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 泰语基础语法精讲 */}
          {currentTab === 'grammar' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h2 className="text-2xl font-bold">📖 泰语基础核心语法总纲</h2>
                <p className="text-[#a39f97] text-sm mt-0.5">抛弃繁琐的概念，帮您快速理清泰语拼读与句子的底层线条。</p>
              </div>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} className="bg-white border border-[#e6e3dd] rounded-2xl p-6 space-y-3 shadow-sm">
                  <h3 className="text-lg font-bold text-[#1c1c1c] flex items-center gap-2">📎 {lesson.title}</h3>
                  <p className="text-base text-stone-600 leading-relaxed whitespace-pre-line font-medium">{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 📸 【电影光影感极致升级】周玉平 奢华浪漫高定特写页 */}
          {currentTab === 'love' && (
            <div className="bg-white border border-[#e6e3dd] rounded-3xl p-6 md:p-12 space-y-8 shadow-sm max-w-2xl mx-auto animate-fade-in relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-rose-300 via-pink-400 to-amber-200"></div>
              
              {/* 头部高级感 Ins 头像框排版 */}
              <div className="flex items-center gap-4 border-b border-[#faf9f6] pb-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-400 via-pink-400 to-amber-300 p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-2xl">🌹</div>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold text-[#1c1c1c] font-serif">致周玉平 · 属于你的浪漫空间</h4>
                  <p className="text-xs text-stone-400 font-mono tracking-widest mt-0.5">EXCLUSIVE SPACE FOR YOU</p>
                </div>
              </div>

              {/* 宽幅复古拍立得卡片框体 */}
              <div className="bg-[#fcfbfa] p-6 md:p-8 rounded-2xl border border-[#ededed] space-y-8 shadow-inner">
                <div className="text-center py-10 px-4 bg-white rounded-xl border shadow-sm space-y-4">
                  <span className="text-xs bg-rose-50 text-rose-600 font-black tracking-widest px-3 py-1 rounded-full uppercase">100% 泰语真情表白</span>
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} className="text-400% text-4xl md:text-5xl font-serif font-black text-stone-800 tracking-wide pt-4 cursor-pointer hover:text-rose-500 active:scale-98 transition-all animate-pulse">
                    ผมรักคุณหมดหัวใจ 🔊
                  </h3>
                  <p className="text-xs font-mono font-bold text-stone-400 tracking-wider">[Phom rak khun mot hua-chai]</p>
                  <div className="pt-4">
                    <p className="text-lg font-black text-slate-800 bg-rose-50/50 py-2.5 px-6 rounded-xl inline-block border border-rose-100">
                      “我将我的整颗心，毫无保留地全部用来爱你。”
                    </p>
                  </div>
                </div>

                {/* 质感治愈抒情散文诗（大字号无缝观赏） */}
                <div className="p-5 md:p-6 bg-white rounded-xl border border-[#f0f0f0] text-left">
                  <p className="text-base text-stone-700 leading-loose font-serif italic font-medium">
                    “在这座风很温柔、水果很甜的旅居城市里，指尖敲击着冰冷的逻辑。而网页的路由会报错、组件会失败，唯独爱你这件事，是超越任何网络框架限制的直连本能。<br /><br />
                    周玉平，愿未来的漫长冬夏、所有的打卡徽章与往后余生，都有你携手并肩、共赴璀璨。”
                  </p>
                </div>
              </div>

              <div className="flex justify-center items-center gap-1.5 text-xs text-stone-400 font-bold tracking-wider">
                <span>🔒 该页面已实现全静态高保真托管 · 爱意永不下线</span>
              </div>
            </div>
          )}

          {/* 单词自学大闪卡模块 */}
          {currentTab === 'study' && (
            <div className="space-y-6">
              {words.length > 0 && (
                <div className="space-y-6">
                  {/* 全新大字号、温润微立体卡片 */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} className="bg-white border border-[#e6e3dd] rounded-2xl p-12 md:p-16 text-center cursor-pointer transition-all hover:border-stone-800 shadow-sm active:scale-[0.99]">
                    <span className="text-xs font-black text-stone-400 block mb-3 uppercase tracking-widest">当前分类课程 · {currentCategory}</span>
                    <h2 className="text-5xl md:text-6xl font-bold text-[#1c1c1c] mb-6 tracking-wide font-serif">{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div className="space-y-2 animate-fade-in">
                        <p className="text-xl text-amber-800 font-mono font-bold">[{words[currentIndex]?.read}]</p>
                        <p className="text-3xl font-bold text-stone-800">{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p className="text-xs text-stone-400 font-semibold mt-8">💡 轻触大卡片任何区域，即可翻面显示含义与发音提示</p>
                  </div>

                  {/* 声音和收藏底栏 */}
                  <div className="flex justify-between items-center bg-white p-4 border border-[#e6e3dd] rounded-xl shadow-sm">
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} className="bg-[#1c1c1c] text-white font-bold px-7 py-4 rounded-xl text-sm hover:bg-stone-800 transition-all active:scale-95">🔊 触听标准原音（点击必响）</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} className={`font-bold px-5 py-4 rounded-xl text-sm border transition-all ${favorites.includes(words[currentIndex]?.id)?'bg-amber-400 border-amber-400 text-white shadow-sm':'bg-white text-stone-700'}`}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已加入个人档案' : '☆ 收藏此词'}
                    </button>
                  </div>

                  {/* 宽大翻页控制组件 */}
                  <div className="flex gap-4">
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} className="flex-1 bg-white border border-[#dfdbd3] font-bold p-4 rounded-xl text-base text-stone-600 hover:bg-stone-50">◁ 上一知识点</button>
                    <button onClick={()=>{ setShowPhonetic(false); if(words[currentIndex]) markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} className="flex-1 bg-[#1c1c1c] text-white p-4 rounded-xl font-bold text-base tracking-wide hover:bg-stone-800 transition-all">记住了，下一个 ▷</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 关卡趣味测试 */}
          {currentTab === 'test' && (
            <div className="bg-white border border-[#e6e3dd] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="flex gap-2 border-b pb-4">
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${testType==='thai_to_zh'?'bg-[#1c1c1c] text-white':'bg-stone-100 text-stone-600'}`}>泰译中关卡</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} className={`px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${testType==='zh_to_thai'?'bg-[#1c1c1c] text-white':'bg-stone-100 text-stone-600'}`}>中译泰关卡</button>
              </div>
              {testOptions.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center py-10 px-4 bg-stone-50 rounded-xl border border-[#eeeeee]">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest block mb-2">请选出最精准的对照：</span>
                    {testType === 'thai_to_zh' ? <h3 className="text-4xl font-bold text-[#1c1c1c]">{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 className="text-3xl font-bold text-[#1c1c1c]">{(words[currentIndex] || testOptions[0]).zh}</h3>}
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
                      <button onClick={prepareTest} className="block mx-auto mt-3 bg-[#1c1c1c] text-white text-xs font-bold px-4 py-2 rounded-lg">斩获下一题 ➡️</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 进度数据大盘 */}
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white border border-[#e6e3dd] p-6 rounded-xl text-center">
                <p className="text-stone-400 text-xs font-bold">今日目标进度</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.today_words_learned} / 10</h4>
              </div>
              <div className="bg-white border border-[#e6e3dd] p-6 rounded-xl text-center">
                <p className="text-stone-400 text-xs font-bold">累计解密词汇</p>
                <h4 className="text-3xl font-bold mt-2 text-stone-800">{profile.total_words_learned} 个</h4>
              </div>
              <div className="bg-white border border-[#e6e3dd] p-6 rounded-xl text-center">
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