import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【请在此处填写你的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🌍 1. 内置全新精编高频词库
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

// 🔤 2. 全量泰语字母表资源库 (44辅音 + 核心元音与声调)
const THAI_ALPHABET = {
  consonants: [
    { thai: 'ก', read: 'ko kai', type: '中辅音', zh: '鸡' }, { thai: 'ข', read: 'kho khai', type: '高辅音', zh: '蛋' },
    { thai: 'ฃ', read: 'kho khuat', type: '高辅音', zh: '瓶(旧)' }, { thai: 'ค', read: 'kho khwan', type: '低辅音', zh: '水牛' },
    { thai: 'ฅ', read: 'kho khon', type: '低辅音', zh: '人(旧)' }, { thai: 'ฆ', read: 'kho ra-khang', type: '低辅音', zh: '大钟' },
    { thai: 'ง', read: 'ngo ngu', type: '低辅音', zh: '蛇' }, { thai: 'จ', read: 'cho chan', type: '中辅音', zh: '盘子' },
    { thai: 'ฉ', read: 'cho ching', type: '高辅音', zh: '钹' }, { thai: 'ช', read: 'cho chang', type: '低辅音', zh: '大象' },
    { thai: 'ซ', read: 'so so', type: '低辅音', zh: '锁链' }, { thai: 'ฌ', read: 'cho choe', type: '低辅音', zh: '树木' },
    { thai: 'ญ', read: 'yo ying', type: '低辅音', zh: '女性' }, { thai: 'ฎ', read: 'do cha-da', type: '中辅音', zh: '尖顶冠' },
    { thai: 'ฏ', read: 'to pa-tak', type: '中辅音', zh: '牛冲突' }, { thai: 'ฐ', read: 'tho thand', type: '高辅音', zh: '底座' },
    { thai: 'ฑ', read: 'tho mon-tho', type: '低辅音', zh: '曼陀妃' }, { thai: 'ฒ', read: 'tho phu-thao', type: '低辅音', zh: '老人' },
    { thai: 'ณ', read: 'no nen', type: '低辅音', zh: '沙弥' }, { thai: 'ด', read: 'do dek', type: '中辅音', zh: '小孩' },
    { thai: 'ต', read: 'to tao', type: '中辅音', zh: '乌龟' }, { thai: 'ถ', read: 'tho thung', type: '高辅音', zh: '袋子' },
    { thai: 'ท', read: 'tho tha-han', type: '低辅音', zh: '士兵' }, { thai: 'ธ', read: 'tho thong', type: '低辅音', zh: '旗帜' },
    { thai: 'น', read: 'no nu', type: '低辅音', zh: '老鼠' }, { thai: 'บ', read: 'bo bai-mai', type: '中辅音', zh: '树叶' },
    { thai: 'ป', read: 'po pla', type: '中辅音', zh: '鱼' }, { thai: 'ผ', read: 'pho pheung', type: '高辅音', zh: '蜜蜂' },
    { thai: 'ฝ', read: 'fo fa', type: '高辅音', zh: '盖子' }, { thai: 'พ', read: 'pho phan', type: '低辅音', zh: '托盘' },
    { thai: 'ฟ', read: 'fo fan', type: '低辅音', zh: '牙齿' }, { thai: 'ภ', read: 'pho sam-phao', type: '低辅音', zh: '帆船' },
    { thai: 'ม', read: 'mo ma', type: '低辅音', zh: '马' }, { thai: 'ย', read: 'yo yak', type: '低辅音', zh: '巨魔' },
    { thai: 'ร', read: 'ro ruea', type: '低辅音', zh: '船' }, { thai: 'ล', read: 'lo ling', type: '低辅音', zh: '猴子' },
    { thai: 'ว', read: 'wo waen', type: '低辅音', zh: '戒指' }, { thai: 'ศ', read: 'so sa-la', type: '高辅音', zh: '凉亭' },
    { thai: 'ษ', read: 'so reu-see', type: '高辅音', zh: '隐士' }, { thai: 'ส', read: 'so suea', type: '高辅音', zh: '老虎' },
    { thai: 'ห', read: 'ho hip', type: '高辅音', zh: '箱子' }, { thai: 'ฬ', read: 'lo chu-la', type: '低辅音', zh: '风筝' },
    { thai: 'อ', read: 'o ang', type: '中辅音', zh: '盆' }, { thai: 'ฮ', read: 'ho nok-huk', type: '低辅音', zh: '猫头鹰' }
  ],
  vowels: [
    { thai: 'ะ', read: 'a', type: '短元音', zh: '啊' }, { thai: 'า', read: 'aa', type: '长元音', zh: '啊—' },
    { thai: 'ิ', read: 'i', type: '短元音', zh: '衣' }, { thai: 'ี', read: 'ee', type: '长元音', zh: '衣—' },
    { thai: 'ึ', read: 'ue', type: '短元音', zh: '俄' }, { thai: 'ื', read: 'uee', type: '长元音', zh: '俄—' },
    { thai: 'ุ', read: 'u', type: '短元音', zh: '呜' }, { thai: 'ู', read: 'uu', type: '长元音', zh: '呜—' }
  ],
  tones: [
    { thai: '่', read: 'mai ek', type: '第一声调', zh: '低调/平调变调符号' },
    { thai: '้', read: 'mai tho', type: '第二声调', zh: '降调符号' },
    { thai: '๊', read: 'mai tri', type: '第三声调', zh: '高调符号' },
    { thai: '๋', read: 'mai chat-ta-wa', type: '第四声调', zh: '升调符号' }
  ]
};

// 📖 3. 系统化泰语核心语法库
const GRAMMAR_LESSONS = [
  { title: "📌 核心词序：语序与中文的异同", content: "泰语的基本语序和中文一样，都是主谓宾（SVO结构）。但是！泰语的【修饰语（定语/状语）必须放在被修饰语的后面】。\n\n例如：\n中文说“大象”，泰语说“象大”（ช้างใหญ่）。\n中文说“炒饭”，泰语说“饭炒”（ข้าวผัด）。" },
  { title: "🎵 声调黄金法则：拼读初探", content: "泰语有五个声调（五个音调，四个声调符号）。声调的最终判定由【辅音的类别（中/高/低辅音） + 元音的长短（长/短元音） + 尾音的类型】共同决定，这是泰语最核心的门槛。" },
  { title: "🤝 常用礼貌敬语尾词", content: "在泰语交流中，句尾必须加上敬语助词以示礼貌：\n- 男性使用：ครับ (khrap)\n- 女性使用：ค่ะ (kha) 或 คะ (kha，用于疑问句)\n\n示例：สวัสดีครับ (sa-wat-dee-khrap) —— 男版“你好”。" },
  { title: "🎙️ 直播与日常高频实用句型", content: "1. 多少钱？: เท่าไหร่ (thao-rai)\n2. 帮我点赞关注: ช่วยกดไลค์กดติดตามด้วยครับ (chuai kot lai kot tit tam duai khrap)\n3. 太好吃了: อร่อยมาก (a-roi mak)" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ streak_days: 0, total_words_learned: 0, today_words_learned: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('study'); // 初始默认停留在高保真学习卡片上
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); loadUserData(session.user.id); }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) loadUserData(session.user.id);
    });
    loadBuiltinWords();
  }, [currentCategory]);

  function loadBuiltinWords() {
    const filtered = ONLINE_BUILTIN_WORDS.filter(w => w.category === currentCategory);
    setWords(filtered);
    setCurrentIndex(0);
  }

  async function loadUserData(userId) {
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
    if (!email || !password) return alert("请完整填写账号密码");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message); else if (type === 'register') alert("注册账号成功，进度已无缝云端托管！");
  }
  
  async function handleSignOut() { await supabase.auth.signOut(); setUser(null); }
  function playAudio(text) { new Audio(`/api/tts?text=${encodeURIComponent(text)}`).play(); }

  async function toggleFavorite(wordId) {
    if (!user) return alert("请先登录，即可激活云端个性化同步功能！");
    if (favorites.includes(wordId)) {
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('word_id', wordId);
      setFavorites(favorites.filter(id => id !== wordId));
    } else {
      await supabase.from('user_favorites').insert({ user_id: user.id, word_id: wordId });
      setFavorites([...favorites, wordId]);
    }
  }

  async function markAsLearned(wordId, isCorrect = true) {
    if (!user) return;
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
      setTestFeedback({ success: true, text: "✨ 正确！回答得干净利落！" });
      markAsLearned(correct.id, true);
    } else {
      setTestFeedback({ success: false, text: `❌ 稍显遗憾，正确答案是: ${correct.zh}` });
      markAsLearned(correct.id, false);
    }
  }

  return (
    <div className={`${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50/70 text-slate-800'} min-h-screen transition-colors duration-300 font-sans`}>
      
      {/* 🔮 顶部微现代轻奢导航栏 */}
      <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-700/50 p-4 sticky top-0 z-50 transition-all shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-tr from-emerald-400 to-teal-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center font-black shadow-md shadow-emerald-200/50 text-xl">🇹🇭</div>
            <div>
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">TRAE DUO THAI</span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">高级自适应互联架构</p>
            </div>
            <button onClick={() => setDarkMode(!darkMode)} className="ml-2 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-xl text-xs font-bold border hover:bg-slate-200 transition-colors">🌓 调色盘</button>
          </div>

          {/* 右上角极简内嵌账户体系 */}
          <div className="flex items-center gap-2 text-sm">
            {!user ? (
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl border">
                <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} className="p-1.5 text-xs bg-transparent focus:outline-none w-28 text-slate-800 dark:text-white"/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} className="p-1.5 text-xs bg-transparent focus:outline-none w-24 text-slate-800 dark:text-white"/>
                <button onClick={()=>handleAuth('login')} className="bg-slate-800 dark:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-xl text-xs shadow-sm hover:opacity-90 transition-opacity">登录</button>
                <button onClick={()=>handleAuth('register')} className="px-2 py-1.5 rounded-xl text-xs text-slate-500 font-medium hover:text-slate-800">注册</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-2xl">
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">🔥 连续打卡 {profile.streak_days} 天</span>
                <span className="opacity-60 text-xs font-medium">{user.email}</span>
                <button onClick={handleSignOut} className="text-xs text-rose-500 font-semibold hover:underline">退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 📐 扁平高级感主网格排版 */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* 左侧无缝高级菜单控制台 */}
        <aside className="space-y-1">
          <h3 className="font-bold text-slate-400 text-[11px] tracking-widest uppercase px-3 mb-2">泰语核心课程分类</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold border transition-all text-sm flex justify-between items-center ${currentCategory === cat && currentTab === 'study' ? 'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600 dark:border-emerald-600 shadow-md shadow-slate-900/10' : 'bg-white dark:bg-slate-800 border-slate-200/60 dark:border-slate-700/30 hover:bg-slate-100/60'}`}>
              <span>📂 {cat}</span>
              <span className="text-[10px] opacity-40 font-mono">▸</span>
            </button>
          ))}
          <hr className="my-4 border-slate-200 dark:border-slate-700/60"/>
          <h3 className="font-bold text-slate-400 text-[11px] tracking-widest uppercase px-3 mb-2">极精美进阶扩展模块</h3>
          <button onClick={() => setCurrentTab('alphabet')} className={`w-full text-left px-4 py-3 rounded-xl font-bold border text-sm transition-all ${currentTab==='alphabet'?'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600':'bg-white dark:bg-slate-800 border-slate-200/60 hover:bg-slate-100/60'}`}>🔤 泰语全量字母表表盘</button>
          <button onClick={() => setCurrentTab('grammar')} className={`w-full text-left px-4 py-3 rounded-xl font-bold border text-sm transition-all ${currentTab==='grammar'?'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600':'bg-white dark:bg-slate-800 border-slate-200/60 hover:bg-slate-100/60'}`}>📖 泰语核心语法体系拆解</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} className={`w-full text-left px-4 py-3 rounded-xl font-bold border text-sm transition-all ${currentTab==='test'?'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600':'bg-white dark:bg-slate-800 border-slate-200/60 hover:bg-slate-100/60'}`}>🎯 多功能趣味挑战卡片</button>
          <button onClick={() => setCurrentTab('home')} className={`w-full text-left px-4 py-3 rounded-xl font-bold border text-sm transition-all ${currentTab==='home'?'bg-slate-900 border-slate-900 text-white dark:bg-emerald-600':'bg-white dark:bg-slate-800 border-slate-200/60 hover:bg-slate-100/60'}`}>🏠 个人数据复习看板</button>
          <button onClick={() => setCurrentTab('love')} className={`w-full text-left px-4 py-3 rounded-xl font-black border text-sm transition-all text-rose-500 border-rose-200/60 dark:border-rose-950/40 ${currentTab==='love'?'bg-gradient-to-r from-rose-400 to-pink-500 !text-white shadow-md shadow-rose-200':''}`}>❤️ 专属致白：致周玉平</button>
        </aside>

        {/* 右侧高级感核心交互主舞台 */}
        <section className="md:col-span-3">

          {/* 【大改版新增】：100%全量字母表模块 */}
          {currentTab === 'alphabet' && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 rounded-3xl p-6 space-y-8 shadow-sm">
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">🔤 泰语声韵母全景表盘</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">包含全量44个辅音、核心元音及四大声调符号，点击任意卡片即可触发纯正真人发音。</p>
              </div>
              
              <div className="space-y-6">
                <div><span className="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-3">Ⅰ . 44个基础辅音（自带中/高/低音属性识别）</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {THAI_ALPHABET.consonants.map((item, idx) => (
                      <div key={idx} onClick={()=>playAudio(item.thai)} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-center cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-all hover:-translate-y-0.5">
                        <h4 className="text-3xl font-black text-slate-800 dark:text-white">{item.thai}</h4>
                        <p className="text-xs font-bold font-mono text-emerald-600 mt-1">[{item.read}]</p>
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium mt-2 border-t pt-1.5"><span>{item.type}</span><span>{item.zh}</span></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div><span className="text-xs font-black text-blue-500 uppercase tracking-wider block mb-3">Ⅱ . 核心拼读元音表</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.vowels.map((item, idx) => (
                        <div key={idx} onClick={()=>playAudio(item.thai)} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border text-center cursor-pointer hover:border-blue-500 transition-all">
                          <h4 className="text-2xl font-black">{item.thai}</h4>
                          <p className="text-xs font-bold text-blue-500 font-mono">[{item.read}]</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{item.type} ({item.zh})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div><span className="text-xs font-black text-purple-500 uppercase tracking-wider block mb-3">Ⅲ . 四大基础变调符号</span>
                    <div className="grid grid-cols-2 gap-3">
                      {THAI_ALPHABET.tones.map((item, idx) => (
                        <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border text-center">
                          <h4 className="text-2xl font-black text-purple-600">{item.thai}</h4>
                          <p className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">[{item.read}]</p>
                          <span className="text-[10px] text-slate-400 block mt-1">{item.zh}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 【大改版新增】：泰语基础语法讲解模块 */}
          {currentTab === 'grammar' && (
            <div className="space-y-4">
              <div className="mb-2">
                <h2 className="text-2xl font-black">📖 泰语现代化语法精讲大纲</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">摒弃学术偏见，用大白话和清晰对照帮你快速构建泰语底层逻辑。</p>
              </div>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl p-5 shadow-sm space-y-3">
                  <h3 className="text-md font-black text-slate-800 dark:text-emerald-400 flex items-center gap-2">⏱️ {lesson.title}</h3>
                  <p className="text-sm opacity-80 whitespace-pre-line leading-relaxed font-medium">{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 【大改版新增】：专属于 周玉平 的高级表白浪漫单页 */}
          {currentTab === 'love' && (
            <div className="bg-gradient-to-br from-rose-50/60 via-pink-100/30 to-amber-50/50 dark:from-rose-950/40 dark:via-slate-900 dark:to-slate-900 border border-rose-200/40 rounded-3xl p-8 md:p-12 text-center shadow-xl shadow-rose-100/30 space-y-8 relative overflow-hidden animate-fade-in">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-pink-500 to-amber-400"></div>
              <div className="space-y-2">
                <span className="text-3xl block animate-bounce">❤️</span>
                <h2 className="text-3xl font-black tracking-wide text-rose-600 dark:text-rose-400 font-mono">致周玉平：世间万般皆平淡，唯你是特例</h2>
                <p className="text-xs font-bold tracking-widest uppercase text-rose-400/80">A Dedicated Love Space for Zhou Yuping</p>
              </div>
              <div className="max-w-md mx-auto bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-rose-100 dark:border-rose-950/50 p-6 md:p-8 rounded-3xl shadow-sm space-y-6 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded-full">泰语深情白话</span>
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} className="text-2xl font-black text-slate-800 dark:text-rose-300 tracking-wide cursor-pointer hover:opacity-80">ผมรักคุณหมดหัวใจ 🔊</h3>
                  <p className="text-xs font-bold text-slate-400 font-mono">[Phom rak khun mot hua-chai]</p>
                  <p className="text-sm font-black text-slate-700 dark:text-slate-200 pt-1">中文释义：我用尽我的全部内心，深深爱着你。</p>
                </div>
                <hr className="border-rose-100/60"/>
                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">浪漫微风长诗</span>
                  <p className="text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-300 italic pt-2">
                    “在这座风很温柔、水果很甜的城市里，<br />
                    每当我看着日落和星空，脑海里全都是你的轮廓。<br />
                    代码有逻辑和对错，但爱你这件事，是不需要编译的本能。<br />
                    周玉平，愿未来的所有浪漫与日常，都能与你携手同航。”
                  </p>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold tracking-wide">✨ 本页面已完成云端永久托管，爱意永不下线 ✨</p>
            </div>
          )}

          {/* 单词自学/高保真闪卡核心交互面板 */}
          {currentTab === 'study' && (
            <div className="space-y-6">
              {words.length === 0 ? (
                <div className="p-12 text-center text-slate-400 font-medium">资源库正在对齐，请稍后...</div>
              ) : (
                <div className="space-y-6">
                  {/* Duolingo 微立体奢华闪卡结构 */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} className="bg-white dark:bg-slate-800 border-2 border-b-[6px] border-slate-200/80 dark:border-slate-700 rounded-3xl p-10 md:p-14 text-center cursor-pointer hover:border-green-400 dark:hover:border-emerald-500 transition-all duration-200 active:border-b-2 active:translate-y-1 shadow-sm">
                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 block mb-3">CURRENT CATEGORY · {currentCategory}</span>
                    <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white mb-6 tracking-wide font-mono">{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div className="space-y-2 animate-fade-in">
                        <p className="text-lg text-green-500 dark:text-emerald-400 font-mono font-bold">[{words[currentIndex]?.read}]</p>
                        <p className="text-2xl font-black text-slate-700 dark:text-slate-200">{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p className="text-[10px] text-slate-400 font-medium mt-6">💡 轻轻点击卡片任何位置，即可翻面显示含义与读音</p>
                  </div>

                  {/* 发音与收藏快捷操作底栏 */}
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 border border-slate-200/60 dark:border-slate-700/40 rounded-2xl shadow-sm">
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} className="bg-slate-900 dark:bg-emerald-600 text-white font-black px-6 py-3 rounded-xl shadow-md text-xs tracking-wider active:scale-95 transition-transform">🔊 听标准原音</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} className={`font-bold px-5 py-3 rounded-xl text-xs border transition-all ${favorites.includes(words[currentIndex]?.id)?'bg-amber-400 border-amber-400 text-white shadow-sm':'bg-white dark:bg-slate-700 border-slate-200 text-slate-700 dark:text-slate-200'}`}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已加入收藏本' : '☆ 收藏此词'}
                    </button>
                  </div>

                  {/* 切词流向控制 */}
                  <div className="flex gap-4">
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 font-bold p-4 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-100/50 transition-colors">◁ 阅览上一个</button>
                    <button onClick={()=>{ setShowPhonetic(false); if(words[currentIndex]) markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} className="flex-1 bg-slate-900 border-b-4 border-slate-950 dark:bg-emerald-600 dark:border-emerald-700 text-white p-4 rounded-xl font-black text-xs tracking-wider shadow-sm active:border-b-0 active:translate-y-0.5 transition-all">掌握，进入下一个 ▷</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 4选1 趣味关卡挑战模块 */}
          {currentTab === 'test' && (
            <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/40 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="flex gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${testType==='thai_to_zh'?'bg-slate-900 text-white dark:bg-emerald-600':'bg-slate-100 text-slate-600'}`}>泰译中关卡</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${testType==='zh_to_thai'?'bg-slate-900 text-white dark:bg-emerald-600':'bg-slate-100 text-slate-600'}`}>中译泰关卡</button>
              </div>
              {testOptions.length > 0 && (
                <div className="space-y-6">
                  <div className="text-center py-8 px-4 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">请从下方选出对应的正确解：</span>
                    {testType === 'thai_to_zh' ? <h3 className="text-4xl font-black tracking-wide">{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 className="text-4xl font-black">{(words[currentIndex] || testOptions[0]).zh}</h3>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} className="p-4 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200/80 dark:border-slate-700 hover:border-slate-800 dark:hover:border-emerald-500 rounded-xl text-left font-bold text-sm transition-all active:border-b-2 active:translate-y-0.5">
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                  {testFeedback && (
                    <div className={`p-4 rounded-xl text-center font-bold text-xs ${testFeedback.success?'bg-green-50 text-green-800 border border-green-200':'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                      {testFeedback.text}
                      <button onClick={prepareTest} className="block mx-auto mt-3 bg-slate-900 dark:bg-emerald-600 text-white text-[11px] font-bold px-4 py-2 rounded-lg">斩获下一题 ➡️</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* 历史复习大盘 */}
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-blue-100 dark:border-slate-700 p-6 rounded-2xl text-center shadow-sm">
                <p className="text-slate-400 text-xs font-bold">今日目标进度</p>
                <h4 className="text-3xl font-black mt-2 text-blue-500">{profile.today_words_learned} / 10</h4>
              </div>
              <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-emerald-100 dark:border-slate-700 p-6 rounded-2xl text-center shadow-sm">
                <p className="text-slate-400 text-xs font-bold">累计解密词汇</p>
                <h4 className="text-3xl font-black mt-2 text-emerald-500">{profile.total_words_learned} 个</h4>
              </div>
              <div className="bg-white dark:bg-slate-800 border-2 border-b-4 border-purple-100 dark:border-slate-700 p-6 rounded-2xl text-center shadow-sm">
                <p className="text-slate-400 text-xs font-bold">个性化收藏池</p>
                <h4 className="text-3xl font-black mt-2 text-purple-500">🌟 {favorites.length} 个词</h4>
              </div>
            </div>
          )}

        </section>
      </div>
    </div>
  );
}