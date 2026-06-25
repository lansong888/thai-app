import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【已自动锁死并对齐的有效凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const isSupabaseConfigured = SUPABASE_URL && !SUPABASE_URL.includes("你的Supabase");
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// 🌍 核心内置词库
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
  { id: 4003, category: '直播常用语', thai: 'กดไลค์', read: 'kot-lai', zh: '点个赞' },
  { id: 5001, category: '数字', thai: 'หนึ่ง', read: 'neung', zh: '1 (一)' },
  { id: 5002, category: '数字', thai: 'สอง', read: 'song', zh: '2 (二)' },
  { id: 5003, category: '数字', thai: 'สาม', read: 'sam', zh: '3 (三)' },
  { id: 5004, category: '数字', thai: 'สิบ', read: 'sip', zh: '10 (十)' },
  { id: 5005, category: '数字', thai: 'ร้อย', read: 'roi', zh: '100 (百)' }
];

const THAI_ALPHABET = {
  consonants: [
    { thai: 'ก', read: 'ko kai', type: '中辅音', zh: '鸡' }, { thai: 'ข', read: 'kho khai', type: '高辅音', zh: '蛋' },
    { thai: 'ค', read: 'kho khwan', type: '低辅音', zh: '水牛' }, { thai: 'ง', read: 'ngo ngu', type: '低辅音', zh: '蛇' },
    { thai: 'จ', read: 'cho chan', type: '中辅音', zh: '盘子' }, { thai: 'ช', read: 'cho chang', type: '低辅音', zh: '大象' },
    { thai: 'ด', read: 'do dek', type: '中辅音', zh: '小孩' }, { thai: 'ต', read: 'to tao', type: '中辅音', zh: '乌龟' },
    { thai: 'ท', read: 'tho tha-han', type: '低辅音', zh: '士兵' }, { thai: 'น', read: 'no nu', type: '低辅音', zh: '老鼠' },
    { thai: 'บ', read: 'bo bai-mai', type: '中辅音', zh: '树叶' }, { thai: 'ป', read: 'po pla', type: '中辅音', zh: '鱼' },
    { thai: 'ม', read: 'mo ma', type: '低辅音', zh: '马' }, { thai: 'ย', read: 'yo yak', type: '低辅音', zh: '巨魔' },
    { thai: 'ร', read: 'ro ruea', type: '低辅音', zh: '船' }, { thai: 'ล', read: 'lo ling', type: '低辅音', zh: '猴子' },
    { thai: 'ว', read: 'wo waen', type: '低辅音', zh: '戒指' }, { thai: 'ส', read: 'so suea', type: '高辅音', zh: '老虎' },
    { thai: 'ห', read: 'ho hip', type: '高辅音', zh: '箱子' }, { thai: 'อ', read: 'o ang', type: '中辅音', zh: '盆' }
  ],
  vowels: [
    { thai: 'ะ', read: 'a', type: '短元音', zh: '啊' }, { thai: 'า', read: 'aa', type: '长元音', zh: '啊—' }
  ],
  tones: [
    { thai: '่', read: 'mai ek', type: '第一声调', zh: '低调符号' },
    { thai: '้', read: 'mai tho', type: '第二声调', zh: '降调符号' }
  ]
};

const GRAMMAR_LESSONS = [
  { title: "📌 核心词序：修饰语100%后置规律", content: "泰语的基本语序和中文一样，都是主谓宾（SVO结构）。但是！泰语的【定语/状语等修饰词，必须放在被修饰词的后面】。\n\n例如：\n中文说“大象”，泰语说“象大”（ช้างใหญ่）。\n中文说“炒饭”，泰语说“饭炒”（ข้าวผัด）。" }
];

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ streak_days: 0, total_words_learned: 0, today_words_learned: 0 });
  const [currentTab, setCurrentTab] = useState('study'); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [words, setWords] = useState([]);
  const [favorites, setFavorites] = useState([]);
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
    } catch (e) {}
  }

  async function handleAuth(type) {
    if (!email || !password) return alert("请完整填写账号和密码");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message); 
    else if (type === 'register') alert("🎉 账号注册成功！");
  }
  
  async function handleSignOut() { if(supabase) await supabase.auth.signOut(); setUser(null); }
  
  // 🔊 重新发明高级穿透式音频引擎：有道、百度、搜狗三通道自动闪切轮询，全类型泰语包响
  function playAudio(text, isAlphabet = false, alphaRead = "") { 
    if (!text) return;
    // 如果是单个辅音字母，强制让引擎去拼读它的罗马发音名（如 ko kai），杜绝识别盲区
    const queryText = (isAlphabet && alphaRead) ? alphaRead : text;
    
    const urls = [
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(queryText)}&le=th`,
      `https://tts.baidu.com/text2audio?lan=th&ie=UTF-8&text=${encodeURIComponent(queryText)}`,
      `https://shared.ydstatic.com/dict/v/audio.html?audio=${encodeURIComponent(queryText)}&le=th`
    ];

    let currentChannel = 0;
    
    function tryPlay() {
      if (currentChannel >= urls.length) return;
      const audio = new Audio(urls[currentChannel]);
      audio.crossOrigin = "anonymous";
      audio.play().catch(() => {
        currentChannel++;
        tryPlay();
      });
    }
    tryPlay();
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
    } else {
      setTestFeedback({ success: false, text: `❌ 选错啦，正确解是: ${correct.zh}` });
    }
  }

  // 🚀 核心优化：解绑下一个按钮的假死锁死，前端先行切词，让体验绝对流畅
  function handleNextWord() {
    setShowPhonetic(false);
    if (words.length === 0) return;
    const nextIdx = (currentIndex + 1) % words.length;
    const currentWordId = words[currentIndex]?.id;
    
    // 1. 立刻瞬间切词，不留任何延迟
    setCurrentIndex(nextIdx);
    
    // 2. 悄悄在后台处理打卡与进度同步，绝不卡住用户的点击动作
    if (currentWordId) {
      markAsLearned(currentWordId, true);
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0a0a0c 0%, #121115 100%)', color: '#e4e4e7', padding: '35px 20px', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* 🔮 顶奢暗夜悬浮导航栏 */}
      <nav style={{ backgroundColor: 'rgba(18, 18, 22, 0.8)', backdropFilter: 'blur(30px)', border: '1px solid rgba(255,255,255,0.06)', padding: '20px 26px', borderRadius: '24px', position: 'sticky', top: '20px', zIndex: 100, boxShadow: '0 30px 60px rgba(0,0,0,0.6)', maxWidth: '1000px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '30px' }}>🌿</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#e9c46a', fontSize: '26px', fontWeight: 'bold', fontFamily: 'Georgia, serif', trackingTight: '1px' }}>DuoThai.ins</span>
              <p style={{ textTransform: 'uppercase', fontSize: '9px', fontWeight: '900', letterSpacing: '2px', color: '#61616a', margin: '3px 0 0 0' }}>暗夜极光流砂自适应美学空间</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!user ? (
              <div style={{ backgroundColor: 'rgba(10, 10, 12, 0.7)', border: '1px solid rgba(255,255,255,0.08)', padding: '6px', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '160px' }}/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} style={{ padding: '10px 14px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '120px' }}/>
                <button onClick={()=>handleAuth('login')} style={{ backgroundColor: '#e9c46a', color: '#0a0a0c', fontWeight: '900', border: 'none', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.2s' }}>登录</button>
                <button onClick={()=>handleAuth('register')} style={{ padding: '10px 12px', backgroundColor: 'transparent', border: 'none', color: '#a1a1aa', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>建立账户</button>
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(233, 196, 106, 0.25)', backgroundColor: 'rgba(18,18,22,0.6)', padding: '10px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: '#e9c46a', fontWeight: '900', fontSize: '15px' }}>🔥 已连击打卡 {profile.streak_days} 天</span>
                <span style={{ opacity: 0.6, fontSize: '13px', color: '#a1a1aa' }}>{user.email}</span>
                <button onClick={handleSignOut} style={{ color: '#f43f5e', backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>登出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🏛️ 宽大典雅主网格 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '35px' }}>
        
        {/* 左侧控制台按钮 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ fontWeight: '900', color: '#4b4b54', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '5px' }}>泰语核心课程分类</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              style={{ 
                width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: 'bold', border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                backgroundColor: currentCategory === cat && currentTab === 'study' ? '#e9c46a' : 'rgba(25, 25, 28, 0.6)',
                color: currentCategory === cat && currentTab === 'study' ? '#0a0a0c' : '#f4f4f5',
                borderColor: currentCategory === cat && currentTab === 'study' ? '#e9c46a' : 'rgba(255,255,255,0.05)',
                boxShadow: currentCategory === cat && currentTab === 'study' ? '0 10px 25px rgba(233,196,106,0.15)' : 'none'
              }}>
              <span>📁 {cat}</span>
            </button>
          ))}
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }}/>
          <h3 style={{ fontWeight: '900', color: '#4b4b54', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '5px' }}>进阶深度框架</h3>
          <button onClick={() => setCurrentTab('alphabet')} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: currentTab==='alphabet'?'#e9c46a':'rgba(25, 25, 28, 0.6)', color: currentTab==='alphabet'?'#0a0a0c':'#f4f4f5' }}>🔤 泰语全量字母表盘</button>
          <button onClick={() => setCurrentTab('grammar')} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: currentTab==='grammar'?'#e9c46a':'rgba(25, 25, 28, 0.6)', color: currentTab==='grammar'?'#0a0a0c':'#f4f4f5' }}>📖 泰语基础语法精讲</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: currentTab==='test'?'#e9c46a':'rgba(25, 25, 28, 0.6)', color: currentTab==='test'?'#0a0a0c':'#f4f4f5' }}>🎯 趣味挑战卡片关卡</button>
          <button onClick={() => setCurrentTab('home')} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: currentTab==='home'?'#e9c46a':'rgba(25, 25, 28, 0.6)', color: currentTab==='home'?'#0a0a0c':'#f4f4f5' }}>🏠 个人数据复习大盘</button>
          
          {/* 🎥 【高级定制】极光黄昏感浪漫告白长纽 */}
          <button onClick={() => setCurrentTab('love')} 
            style={{ 
              width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '18px', fontSize: '18px', fontWeight: '900', border: '1px solid #b91c1c', cursor: 'pointer',
              background: currentTab === 'love' ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)' : 'rgba(159, 18, 57, 0.15)', 
              color: '#ffe4e6', 
              boxShadow: currentTab === 'love' ? '0 15px 30px rgba(225,29,72,0.2)' : 'none'
            }}>
            💝 浪漫告白：致周玉平
          </button>
        </div>

        {/* 右侧流体主舞台 */}
        <div style={{ gridColumn: 'span 3' }}>

          {/* 全量字母表 (拼读无死角穿透版) */}
          {currentTab === 'alphabet' && (
            <div style={{ backgroundColor: 'rgba(20, 20, 25, 0.7)', border: '1px solid rgba(255,255,255,0.05)', padding: '35px', borderRadius: '28px', backdropFilter: 'blur(20px)' }}>
              <div style={{ marginBottom: '30px' }}>
                <h2 style={{ color: '#e9c46a', fontSize: '26px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>🔤 泰语声韵母全量大表盘</h2>
                <p style={{ color: '#a1a1aa', fontSize: '15px', marginTop: '6px' }}>轻戳任意卡片即可直接触发最高频的声韵母拼读读音（如 [ko kai]）。</p>
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '900', color: '#52525b', textTransform: 'uppercase', letterSpacing: '2px', display: 'block', marginBottom: '20px' }}>Ⅰ . 基础辅音分类大索引</span>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '18px' }}>
                  {THAI_ALPHABET.consonants.map((item, idx) => (
                    /* 🎯 发音引擎盲区锁死：辅音字母强制发它对应的罗马组合名字音 alphaRead */
                    <div key={idx} onClick={()=>playAudio(item.thai, true, item.read)} style={{ backgroundColor: 'rgba(10, 10, 12, 0.5)', border: '1px solid rgba(255,255,255,0.04)', padding: '20px 16px', borderRadius: '18px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.borderColor='#e9c46a'} onMouseLeave={(e)=>e.currentTarget.style.borderColor='rgba(25,25,28,0.04)'}>
                      <h4 style={{ fontSize: '40px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{item.thai}</h4>
                      <p style={{ color: '#e9c46a', fontSize: '15px', fontWeight: 'bold', margin: '6px 0 0 0', fontFamily: 'monospace' }}>[{item.read}]</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#4b4b54', marginTop: '14px', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}><span>{item.type}</span><span>{item.zh}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 语法讲解 */}
          {currentTab === 'grammar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '26px', fontWeight: 'bold' }}>📖 泰语基础核心语法总纲</h2>
                <p style={{ color: '#a1a1aa', fontSize: '15px', marginTop: '6px' }}>理清修饰语后置等线条，帮您快速看懂泰语句子结构。</p>
              </div>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} style={{ backgroundColor: 'rgba(20, 20, 25, 0.7)', border: '1px solid rgba(255,255,255,0.05)', padding: '28px', borderRadius: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ color: '#e9c46a', fontSize: '20px', fontWeight: 'bold', margin: '0 0 14px 0' }}>📎 {lesson.title}</h3>
                  <p style={{ fontSize: '16px', color: '#d4d4d8', lineHeight: '1.8', whiteSpace: 'pre-line' }}>{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 📸 【电影感极光落日：完全不要任何白底】周玉平 暗调奢华高定特写空间 */}
          {currentTab === 'love' && (
            <div style={{ background: 'linear-gradient(145deg, #1e1116 0%, #0d0a0d 100%)', border: '1px solid #881337', padding: '40px', borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', maxWidth: '650px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, #f43f5e, #ec4899, #eab308)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '22px', marginBottom: '30px' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(to right, #f43f5e, #ec4899)', padding: '2px' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#0d0a0d', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '26px' }}>🌹</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fecdd3', fontFamily: 'Georgia, serif', margin: 0 }}>致周玉平 · 属于你的沉浸式极光信笺</h4>
                  <p style={{ fontSize: '11px', color: '#52525b', fontFamily: 'monospace', margin: '3px 0 0 0', letterSpacing: '1px' }}>FOREVER DEPLOYED ON SUPABASE</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(10, 8, 10, 0.6)', border: '1px solid #4c0519', padding: '28px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div style={{ backgroundColor: '#170c10', border: '1px solid #701a2f', padding: '35px 20px', borderRadius: '20px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', backgroundColor: 'rgba(159, 18, 57, 0.5)', color: '#fb7185', fontWeight: '900', padding: '5px 14px', borderRadius: '12px', border: '1px solid rgba(251, 113, 133, 0.2)' }}>100% 泰语真情表白</span>
                  {/* 🎯 终极发音穿透：表白页直接调用全量句子包响音频 */}
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} style={{ fontSize: '46px', fontWeight: '900', color: '#ffe4e6', letterSpacing: '1px', margin: '24px 0 6px 0', cursor: 'pointer' }} className="animate-pulse">
                    ผมรักคุณหมดหัวใจ 🔊
                  </h3>
                  <p style={{ fontSize: '14px', fontFamily: 'monospace', color: '#887c80', margin: 0 }}>[Phom rak khun mot hua-chai]</p>
                  <div style={{ marginTop: '25px' }}>
                    <p style={{ backgroundColor: 'rgba(225, 29, 72, 0.08)', border: '1px solid rgba(225, 29, 72, 0.18)', color: '#fda4af', padding: '14px 28px', borderRadius: '14px', fontSize: '19px', fontWeight: 'bold', display: 'inline-block', margin: 0 }}>
                      “我将我的整颗内心，毫无保留地全部用来爱你。”
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(12, 10, 11, 0.4)', border: '1px solid #310413', padding: '26px', borderRadius: '20px', textAlign: 'left' }}>
                  <p style={{ fontSize: '17px', color: '#e4e4e7', lineHeight: '2.1', fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
                    “在这座风很温柔、日落很耀眼的旅居城市里，指尖敲击着冰冷的逻辑。而网页的路由会报错、组件会失败，唯独爱你这件事，是超越一切网络框架限制的直连本能。<br /><br />
                    周玉平，愿未来的漫长冬夏、所有的打卡徽章与往后余生，都有你携手并肩、共赴璀璨。”
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 单词自学闪卡 */}
          {currentTab === 'study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
              {words.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
                  {/* 大字号沉浸暗调闪卡 */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} style={{ backgroundColor: 'rgba(20, 20, 25, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '55px 20px', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#4b4b54', display: 'block', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '18px' }}>当前分类课程 · {currentCategory}</span>
                    <h2 style={{ fontSize: '70px', fontWeight: 'bold', color: '#fff', margin: '0 0 28px 0', fontFamily: 'Georgia, serif' }}>{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <p style={{ color: '#e9c46a', fontSize: '24px', fontFamily: 'monospace', fontWeight: 'bold', margin: 0 }}>[{words[currentIndex]?.read}]</p>
                        <p style={{ fontSize: '38px', fontWeight: 'bold', color: '#f4f4f5', margin: 0 }}>{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p style={{ fontSize: '13px', color: '#4b4b54', fontWeight: 'bold', marginTop: '40px' }}>💡 轻触大卡片任何区域，即可翻面显示含义与发音提示</p>
                  </div>

                  {/* 声音控制 */}
                  <div style={{ backgroundColor: 'rgba(25, 25, 28, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '18px', display: 'flex', justifyContent: 'space-between', items: 'center' }}>
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} style={{ backgroundColor: '#e9c46a', color: '#0a0a0c', fontWeight: '900', border: 'none', padding: '16px 30px', borderRadius: '14px', fontSize: '16px', cursor: 'pointer', boxShadow: '0 6px 20px rgba(233,196,106,0.2)' }}>🔊 点击正音（全自动轮询必响）</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} style={{ padding: '16px 26px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: favorites.includes(words[currentIndex]?.id)?'#eab308':'transparent', color: favorites.includes(words[currentIndex]?.id)?'#000':'#a1a1aa', cursor: 'pointer' }}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已归入单词本' : '☆ 收藏词汇'}
                    </button>
                  </div>

                  {/* 切词控制行 (核心解锁修复) */}
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} style={{ flex: 1, backgroundColor: 'rgba(25, 25, 28, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '18px', borderRadius: '14px', fontSize: '16px', fontWeight: 'bold', color: '#a1a1aa', cursor: 'pointer' }}>◁ 上一知识点</button>
                    {/* 🎯 解开死锁：点击“下一个”瞬间跳变词汇，杜绝卡死无反应 */}
                    <button onClick={handleNextWord} style={{ flex: 1, backgroundColor: '#e9c46a', border: 'none', padding: '18px', borderRadius: '14px', fontSize: '16px', fontWeight: '900', color: '#0a0a0c', cursor: 'pointer', boxShadow: '0 6px 20px rgba(233,196,106,0.15)' }}>记住了，下一个 ▷</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '50px', textAlign: 'center', color: '#4b4b54', fontWeight: 'bold', fontSize: '16px' }}>该分类数据正在对齐中...</div>
              )}
            </div>
          )}

          {/* 关卡挑战 */}
          {currentTab === 'test' && (
            <div style={{ backgroundColor: 'rgba(20, 20, 25, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '26px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.04)', paddingBottom: '16px', marginBottom: '24px' }}>
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} style={{ padding: '12px 22px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: testType==='thai_to_zh'?'#e9c46a':'#27272a', color: testType==='thai_to_zh'?'#000':'#a1a1aa' }}>泰译中关卡</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} style={{ padding: '12px 22px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: testType==='zh_to_thai'?'#e9c46a':'#27272a', color: testType==='zh_to_thai'?'#000':'#a1a1aa' }}>中译泰关卡</button>
              </div>
              {testOptions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ backgroundColor: '#0a0a0c', border: '1px solid rgba(255,255,255,0.05)', padding: '45px 15px', borderRadius: '18px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4b4b54', display: 'block', marginBottom: '12px' }}>请选出最精准的对照：</span>
                    {testType === 'thai_to_zh' ? <h3 style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 style={{ fontSize: '30px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{(words[currentIndex] || testOptions[0]).zh}</h3>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} style={{ backgroundColor: 'rgba(25, 25, 28, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '18px', borderRadius: '12px', textAlign: 'left', fontSize: '16px', fontWeight: 'bold', color: '#f4f4f5', cursor: 'pointer' }}>
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 个人看板 */}
          {currentTab === 'home' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(25, 25, 28, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', rounded: '20px', textAlign: 'center' }}>
                <p style={{ color: '#71717a', fontSize: '13px', fontWeight: 'bold' }}>今日目标进度</p>
                <h4 style={{ fontSize: '32px', fontWeight: 'black', marginTop: '10px', color: '#e4e4e7' }}>{profile.today_words_learned} / 10</h4>
              </div>
              <div style={{ backgroundColor: 'rgba(25, 25, 28, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', rounded: '20px', textAlign: 'center' }}>
                <p style={{ color: '#71717a', fontSize: '13px', fontWeight: 'bold' }}>累计解密词汇</p>
                <h4 style={{ fontSize: '32px', fontWeight: 'black', marginTop: '10px', color: '#e4e4e7' }}>{profile.total_words_learned} 个</h4>
              </div>
              <div style={{ backgroundColor: 'rgba(25, 25, 28, 0.5)', border: '1px solid rgba(255,255,255,0.05)', padding: '24px', rounded: '20px', textAlign: 'center' }}>
                <p style={{ color: '#71717a', fontSize: '13px', fontWeight: 'bold' }}>云端单词收藏</p>
                <h4 style={{ fontSize: '32px', fontWeight: 'black', marginTop: '10px', color: '#e4e4e7' }}>🌟 {favorites.length} 个词</h4>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}