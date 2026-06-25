import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【已自动对齐更新的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const isSupabaseConfigured = SUPABASE_URL && !SUPABASE_URL.includes("你的Supabase");
const supabase = isSupabaseConfigured ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// 🌍 1. 内置全新精编高频词库（含数字分类无缝对接）
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
    { thai: 'ะ', read: 'a', type: '短元音', zh: '啊' }, { thai: 'า', read: 'aa', type: '长元音', zh: '啊—' },
    { thai: 'ิ', read: 'i', type: '短元音', zh: '衣' }, { thai: 'ี', read: 'ee', type: '长元音', zh: '衣—' }
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
    else if (type === 'register') alert("🎉 账号建立成功！");
  }
  
  async function handleSignOut() { if(supabase) await supabase.auth.signOut(); setUser(null); }
  
  // 🔊 终极声音穿透引擎：百度高优先级泰语流 + 有道备用流，免跨域拦截直连
  function playAudio(text) { 
    if (!text) return;
    try {
      const url = `https://tts.baidu.com/text2audio?lan=th&ie=UTF-8&text=${encodeURIComponent(text)}`;
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          const fallbackUrl = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&le=th`;
          new Audio(fallbackUrl).play().catch(e => console.log("等待手势激活"));
        });
      }
    } catch(err) {}
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
      setTestFeedback({ success: true, text: "✨ 正确！回答完美！" });
    } else {
      setTestFeedback({ success: false, text: `❌ 选错啦，正确解是: ${correct.zh}` });
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #141210 0%, #1e1a17 100%)', color: '#f5f5f4', padding: '30px 15px', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* 🍵 顶奢沉浸式深色悬浮导航栏 */}
      <nav style={{ backgroundColor: 'rgba(28, 25, 23, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid #36302b', padding: '18px 24px', borderRadius: '24px', position: 'sticky', top: '20px', zIndex: 100, boxShadow: '0 20px 40px rgba(0,0,0,0.4)', maxWidth: '1000px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'between', alignItems: 'center', gap: '20px', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{ fontSize: '28px' }}>🌿</span>
            <div style={{ textAlign: 'left' }}>
              <span style={{ color: '#dfb28c', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>DuoThai.luxury</span>
              <p style={{ textTransform: 'uppercase', fontSize: '10px', fontWeight: '900', trackingWidest: '2px', color: '#7a756c', margin: '2px 0 0 0' }}>高端暗夜美学泰语自适应平台</p>
            </div>
          </div>

          {/* 右侧内嵌精致控制表单 */}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!user ? (
              <div style={{ backgroundColor: 'rgba(18, 16, 15, 0.6)', border: '1px solid #3e3731', padding: '6px', borderRadius: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} style={{ padding: '8px 12px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '150px' }}/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} style={{ padding: '8px 12px', fontSize: '14px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: '#fff', width: '110px' }}/>
                <button onClick={()=>handleAuth('login')} style={{ backgroundColor: '#dfb28c', color: '#1c1a17', fontWeight: 'bold', border: 'none', padding: '10px 18px', borderRadius: '12px', cursor: 'pointer', fontSize: '13px' }}>登录</button>
                <button onClick={()=>handleAuth('register')} style={{ padding: '10px 12px', backgroundColor: 'transparent', border: 'none', color: '#a8a297', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}>注册</button>
              </div>
            ) : (
              <div style={{ border: '1px solid rgba(223, 178, 140, 0.3)', backgroundColor: 'rgba(28,25,23,0.6)', padding: '10px 20px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ color: '#dfb28c', fontWeight: '900', fontSize: '15px' }}>🔥 已打卡 {profile.streak_days} 天</span>
                <span style={{ opacity: 0.6, fontSize: '13px', color: '#d4d4d4' }}>{user.email}</span>
                <button onClick={handleSignOut} style={{ color: '#f43f5e', backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🏛️ 宽大典雅主排版大网格 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
        
        {/* 左侧拓宽大字号深色控制台 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <h3 style={{ fontWeight: '900', color: '#6b665e', fontSize: '12px', trackingWidest: '2px', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '5px' }}>泰语高频单词课程</h3>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              style={{ 
                width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', justifyContent: 'between', alignItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                backgroundColor: currentCategory === cat && currentTab === 'study' ? '#dfb28c' : 'rgba(38, 34, 30, 0.5)',
                color: currentCategory === cat && currentTab === 'study' ? '#1c1a17' : '#f5f5f4',
                borderColor: currentCategory === cat && currentTab === 'study' ? '#dfb28c' : '#36302b'
              }}>
              <span>📁 {cat}</span>
            </button>
          ))}
          <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #36302b' }}/>
          <h3 style={{ fontWeight: '900', color: '#6b665e', fontSize: '12px', trackingWidest: '2px', textTransform: 'uppercase', paddingLeft: '12px', marginBottom: '5px' }}>进阶深度框架</h3>
          <button onClick={() => setCurrentTab('alphabet')} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #36302b', cursor: 'pointer', backgroundColor: currentTab==='alphabet'?'#dfb28c':'rgba(38, 34, 30, 0.5)', color: currentTab==='alphabet'?'#1c1a17':'#f5f5f4' }}>🔤 泰语全量字母表盘</button>
          <button onClick={() => setCurrentTab('grammar')} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #36302b', cursor: 'pointer', backgroundColor: currentTab==='grammar'?'#dfb28c':'rgba(38, 34, 30, 0.5)', color: currentTab==='grammar'?'#1c1a17':'#f5f5f4' }}>📖 泰语基础语法精讲</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #36302b', cursor: 'pointer', backgroundColor: currentTab==='test'?'#dfb28c':'rgba(38, 34, 30, 0.5)', color: currentTab==='test'?'#1c1a17':'#f5f5f4' }}>🎯 趣味挑战卡片关卡</button>
          <button onClick={() => setCurrentTab('home')} style={{ width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid #36302b', cursor: 'pointer', backgroundColor: currentTab==='home'?'#dfb28c':'rgba(38, 34, 30, 0.5)', color: currentTab==='home'?'#1c1a17':'#f5f5f4' }}>🏠 个人数据复习大盘</button>
          
          {/* 💝 电影胶片高级暗调告白长纽 */}
          <button onClick={() => setCurrentTab('love')} 
            style={{ 
              width: '100%', textAlign: 'left', padding: '16px 20px', borderRadius: '16px', fontSize: '18px', fontWeight: '900', border: '1px solid #9d174d', cursor: 'pointer',
              background: currentTab === 'love' ? 'linear-gradient(to right, #be185d, #db2777)' : 'rgba(76, 29, 43, 0.3)', 
              color: '#fdba74', 
              boxShadow: '0 10px 20px rgba(157, 23, 77, 0.15)'
            }}>
            💝 浪漫告白：致周玉平
          </button>
        </div>

        {/* 右侧流体主舞台（全量框架自适应美化） */}
        <div style={{ gridColumn: 'span 3' }}>

          {/* 全量字母表 */}
          {currentTab === 'alphabet' && (
            <div style={{ backgroundColor: 'rgba(28, 25, 23, 0.6)', border: '1px solid #36302b', padding: '30px', borderRadius: '24px', backdropFilter: 'blur(10px)' }}>
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ color: '#dfb28c', fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>🔤 泰语声韵母全量大表盘</h2>
                <p style={{ color: '#a8a297', fontSize: '15px', marginTop: '5px' }}>轻戳任意暗调卡片即可直接触发高清晰、穿透式的标准原音发音。</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: '900', color: '#6b665e', textTransform: 'uppercase', trackingWidest: '2px', display: 'block', marginBottom: '15px' }}>Ⅰ . 基础辅音分类大索引</span>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                    {THAI_ALPHABET.consonants.map((item, idx) => (
                      <div key={idx} onClick={()=>playAudio(item.thai)} style={{ backgroundColor: 'rgba(18, 16, 15, 0.4)', border: '1px solid #3e3731', padding: '16px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.borderColor='#dfb28c'} onMouseLeave={(e)=>e.currentTarget.style.borderColor='#3e3731'}>
                        <h4 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{item.thai}</h4>
                        <p style={{ color: '#dfb28c', fontSize: '15px', fontWeight: 'bold', margin: '4px 0 0 0', fontFamily: 'monospace' }}>[{item.read}]</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#57534e', marginTop: '12px', borderTop: '1px solid #2e2a24', paddingTop: '8px' }}><span>{item.type}</span><span>{item.zh}</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 语法精讲 */}
          {currentTab === 'grammar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>📖 泰语基础核心语法总纲</h2>
                <p style={{ color: '#a8a297', fontSize: '15px', marginTop: '5px' }}>理清修饰语后置等线条，帮您快速看懂泰语句子结构。</p>
              </div>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} style={{ backgroundColor: 'rgba(28, 25, 23, 0.6)', border: '1px solid #36302b', padding: '24px', borderRadius: '24px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
                  <h3 style={{ color: '#dfb28c', fontSize: '18px', fontWeight: 'bold', margin: '0 0 12px 0' }}>📎 {lesson.title}</h3>
                  <p style={{ fontSize: '16px', color: '#d6d3d1', lineHeight: '1.7', whiteSpace: 'pre-line' }}>{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 📸 【高定电影级：完全不要白色背景】周玉平 暗调奢华黄昏特写空间 */}
          {currentTab === 'love' && (
            <div style={{ background: 'linear-gradient(145deg, #24141a 0%, #120d11 100%)', border: '1px solid #4d1c2b', padding: '35px', borderRadius: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', maxWidth: '650px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, #ec4899, #f43f5e, #eab308)' }}></div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px', marginBottom: '25px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(to right, #ec4899, #f43f5e)', padding: '2px' }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: '#120d11', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: '24px' }}>🌹</div>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fda4af', fontFamily: 'Georgia, serif', margin: 0 }}>致周玉平 · 电影感沉浸光影信笺</h4>
                  <p style={{ fontSize: '11px', color: '#57534e', fontFamily: 'monospace', margin: '2px 0 0 0', trackingWidest: '1px' }}>FOREVER DEPLOYED ON SUPABASE</p>
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(15, 10, 12, 0.5)', border: '1px solid #3a1822', padding: '24px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '25px' }}>
                <div style={{ backgroundColor: '#1c1216', border: '1px solid #4c1a27', padding: '30px 15px', borderRadius: '16px', textAlign: 'center' }}>
                  <span style={{ fontSize: '11px', backgroundColor: 'rgba(157, 23, 77, 0.4)', color: '#f472b6', fontWeight: '900', padding: '4px 12px', borderRadius: '12px', border: '1px solid rgba(244, 114, 182, 0.2)' }}>100% 泰语真情告白</span>
                  <h3 onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")} style={{ fontSize: '42px', fontWeight: '900', color: '#ffe4e6', trackingWide: '2px', margin: '20px 0 5px 0', cursor: 'pointer' }}>
                    ผมรักคุณหมดหัวใจ 🔊
                  </h3>
                  <p style={{ fontSize: '13px', fontFamily: 'monospace', color: '#7a7074', margin: 0 }}>[Phom rak khun mot hua-chai]</p>
                  <div style={{ marginTop: '20px' }}>
                    <p style={{ backgroundColor: 'rgba(219, 39, 119, 0.1)', border: '1px solid rgba(219, 39, 119, 0.2)', color: '#fbcfe8', padding: '12px 24px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', display: 'inline-block', margin: 0 }}>
                      “我将我的整颗内心，毫无保留地全部用来爱你。”
                    </p>
                  </div>
                </div>

                <div style={{ backgroundColor: 'rgba(20, 15, 17, 0.4)', border: '1px solid #2b151b', padding: '24px', borderRadius: '16px', textAlign: 'left' }}>
                  <p style={{ fontSize: '17px', color: '#e7e5e4', lineHeight: '2', fontFamily: 'Georgia, serif', fontStyle: 'italic', margin: 0 }}>
                    “在这座风很温柔、日落很耀眼的旅居城市里，指尖敲击着冰冷的逻辑。而网页的路由会报错、组件会失败，唯独爱你这件事，是超越一切网络框架限制的直连本能。<br /><br />
                    周玉平，愿未来的漫长冬夏、所有的打卡徽章与往后余生，都有你携手并肩、共赴璀璨。”
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 单词闪卡交互舞台 */}
          {currentTab === 'study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {words.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* 全新大字号、沉浸暗调虚化大卡片（彻底抹除白底） */}
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} style={{ backgroundColor: 'rgba(28, 25, 23, 0.6)', border: '1px solid #36302b', padding: '50px 20px', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative' }}>
                    <span style={{ fontSize: '12px', fontWeight: '900', color: '#57534e', display: 'block', textTransform: 'uppercase', trackingWidest: '2px', marginBottom: '15px' }}>当前分类课程 · {currentCategory}</span>
                    <h2 style={{ fontSize: '64px', fontWeight: 'bold', color: '#fff', margin: '0 0 25px 0', fontFamily: 'Georgia, serif' }}>{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p style={{ color: '#dfb28c', fontSize: '22px', fontFamily: 'monospace', fontWeight: 'bold', margin: 0 }}>[{words[currentIndex]?.read}]</p>
                        <p style={{ fontSize: '36px', fontWeight: 'bold', color: '#e7e5e4', margin: 0 }}>{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p style={{ fontSize: '13px', color: '#57534e', fontWeight: 'bold', marginTop: '35px' }}>💡 轻触大卡片任何区域，即可翻面显示含义与发音提示</p>
                  </div>

                  {/* 发音与单词库底栏 */}
                  <div style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', border: '1px solid #36302b', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} style={{ backgroundColor: '#dfb28c', color: '#1c1a17', fontWeight: '900', border: 'none', padding: '16px 28px', borderRadius: '12px', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 15px rgba(223,178,140,0.2)' }}>🔊 点击正音（多通道直连必响）</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} style={{ padding: '16px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: '1px solid #36302b', backgroundColor: favorites.includes(words[currentIndex]?.id)?'#eab308':'transparent', color: favorites.includes(words[currentIndex]?.id)?'#000':'#d6d3d1', cursor: 'pointer' }}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已加入单词本' : '☆ 收藏词汇'}
                    </button>
                  </div>

                  {/* 切词控制行 */}
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} style={{ flex: 1, backgroundColor: 'rgba(38, 34, 30, 0.4)', border: '1px solid #36302b', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', color: '#d6d3d1', cursor: 'pointer' }}>◁ 上一知识点</button>
                    <button onClick={()=>{ setShowPhonetic(false); if(words[currentIndex]) markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} style={{ flex: 1, backgroundColor: '#1c1a17', border: '1px solid #36302b', padding: '16px', borderRadius: '12px', fontSize: '16px', fontWeight: 'black', color: '#fff', cursor: 'pointer' }}>记住了，下一个 ▷</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '50px', textAlign: 'center', color: '#57534e', fontWeight: 'bold', fontSize: '16px' }}>该分类数据正在对齐中...</div>
              )}
            </div>
          )}

          {/* 关卡挑战 */}
          {currentTab === 'test' && (
            <div style={{ backgroundColor: 'rgba(28, 25, 23, 0.6)', border: '1px solid #36302b', padding: '24px', borderRadius: '24px' }}>
              <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #2e2a24', paddingBottom: '16px', marginBottom: '24px' }}>
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: testType==='thai_to_zh'?'#dfb28c':'#2e2a24', color: testType==='thai_to_zh'?'#000':'#a8a297' }}>泰译中关卡</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} style={{ padding: '12px 20px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: testType==='zh_to_thai'?'#dfb28c':'#2e2a24', color: testType==='zh_to_thai'?'#000':'#a8a297' }}>中译泰关卡</button>
              </div>
              {testOptions.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ backgroundColor: '#12100e', border: '1px solid #36302b', padding: '40px 15px', borderRadius: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#57534e', display: 'block', marginBottom: '10px', trackingWidest: '1px' }}>请选出最精准的对照：</span>
                    {testType === 'thai_to_zh' ? <h3 style={{ fontSize: '36px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{(words[currentIndex] || testOptions[0]).thai}</h3> : <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{(words[currentIndex] || testOptions[0]).zh}</h3>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px' }}>
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} style={{ backgroundColor: 'rgba(28, 25, 23, 0.4)', border: '1px solid #36302b', padding: '18px', borderRadius: '12px', textAlign: 'left', fontSize: '16px', fontWeight: 'bold', color: '#f5f5f4', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e)=>e.currentTarget.style.borderColor='#dfb28c'} onMouseLeave={(e)=>e.currentTarget.style.borderColor='#36302b'}>
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}