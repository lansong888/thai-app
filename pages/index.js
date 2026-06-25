import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
  ]
};

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ streak_days: 0, total_words_learned: 0, today_words_learned: 0 });
  const [currentTab, setCurrentTab] = useState('study'); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [words, setWords] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('日常生活');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPhonetic, setShowPhonetic] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const audioPlayerRef = useRef(null);
  const musicPlayerRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); loadUserData(session.user.id); }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) { loadUserData(session.user.id); setShowAuthModal(false); }
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
    } catch (e) {}
  }

  async function handleAuth(type) {
    if (!email || !password) return alert("请完整填写账号和密码");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message); 
    else if (type === 'register') alert("🎉 账号注册成功并已登录！");
  }
  
  async function handleSignOut() { await supabase.auth.signOut(); setUser(null); setFavorites([]); }
  
  function playAudio(text, isAlphabet = false, alphaRead = "") { 
    if (!text) return;
    const queryText = (isAlphabet && alphaRead) ? alphaRead : text;
    
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
      audioPlayerRef.current.crossOrigin = "anonymous";
    }

    const channels = [
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(queryText)}&le=th`,
      `https://tts.baidu.com/text2audio?lan=th&ie=UTF-8&text=${encodeURIComponent(queryText)}`
    ];

    let currentChannel = 0;
    function runChannel() {
      if (currentChannel >= channels.length) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(queryText);
          utterance.lang = isAlphabet ? 'en-US' : 'th-TH';
          window.speechSynthesis.speak(utterance);
        } catch(e){}
        return;
      }
      audioPlayerRef.current.src = channels[currentChannel];
      audioPlayerRef.current.play().catch(() => {
        currentChannel++;
        runChannel();
      });
    }
    runChannel();
  }

  function toggleLoveMusic() {
    if (!musicPlayerRef.current) {
      musicPlayerRef.current = new Audio("https://music.163.com/song/media/outer/url?id=5255987.mp3");
      musicPlayerRef.current.loop = true;
      musicPlayerRef.current.volume = 0.4;
    }

    if (musicPlaying) {
      musicPlayerRef.current.pause();
      setMusicPlaying(false);
    } else {
      musicPlayerRef.current.play().catch(e => console.log("等待激活"));
      setMusicPlaying(true);
    }
  }

  async function toggleFavorite(wordId) {
    if (!wordId) return;
    if (!user) return alert("请先点击右上方登录，即可启用云端同步收藏夹！");
    
    const isFav = favorites.includes(wordId);
    if (isFav) {
      setFavorites(favorites.filter(id => id !== wordId));
      await supabase.from('user_favorites').delete().eq('user_id', user.id).eq('word_id', wordId);
    } else {
      setFavorites([...favorites, wordId]);
      await supabase.from('user_favorites').insert({ user_id: user.id, word_id: wordId });
    }
  }

  function handleNextWord() {
    setShowPhonetic(false);
    if (words.length === 0) return;
    setCurrentIndex((currentIndex + 1) % words.length);
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #09090b 0%, #141417 100%)', color: '#e4e4e7', padding: '30px 15px', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* 🔮 导航栏 */}
      <nav style={{ backgroundColor: 'rgba(15, 15, 18, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.06)', padding: '14px 24px', borderRadius: '20px', position: 'sticky', top: '20px', zIndex: 100, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', maxWidth: '1000px', margin: '0 auto 40px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🌿</span>
            <span style={{ color: '#dfb28c', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>DuoThai.ins</span>
          </div>

          <div>
            {!user ? (
              <button onClick={() => setShowAuthModal(true)} style={{ backgroundColor: '#dfb28c', color: '#09090b', fontWeight: '900', border: 'none', padding: '10px 22px', borderRadius: '12px', cursor: 'pointer', fontSize: '14px' }}>🔑 快捷登录 / 注册账户</button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', fontSize: '14px' }}>
                <span style={{ color: '#dfb28c', fontWeight: 'bold' }}>🔥 连击打卡中 │ {user.email}</span>
                <button onClick={handleSignOut} style={{ color: '#ef4444', backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🔑 弹窗 */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(15px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.08)', padding: '35px', borderRadius: '24px', width: '360px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#dfb28c', fontSize: '20px', fontWeight: 'bold' }}>同步个人复习进度</h3>
            <input type="email" placeholder="输入您的电子邮箱" onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff', marginBottom: '12px', outline: 'none' }}/>
            <input type="password" placeholder="设置您的账户密码" onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff', marginBottom: '20px', outline: 'none' }}/>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={()=>handleAuth('login')} style={{ flex: 1, backgroundColor: '#dfb28c', color: '#09090b', fontWeight: 'bold', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>直接登录</button>
              <button onClick={()=>handleAuth('register')} style={{ flex: 1, backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>注册账户</button>
            </div>
            <p onClick={() => setShowAuthModal(false)} style={{ color: '#71717a', fontSize: '13px', marginTop: '20px', cursor: 'pointer', textDecoration: 'underline' }}>暂不登录，返回浏览</p>
          </div>
        </div>
      )}

      {/* 🏛️ 网格 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '35px' }}>
        
        {/* 左侧 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              style={{ 
                width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid', transition: 'all 0.2s', cursor: 'pointer',
                backgroundColor: currentCategory === cat && currentTab === 'study' ? '#dfb28c' : 'rgba(20, 20, 23, 0.6)',
                color: currentCategory === cat && currentTab === 'study' ? '#09090b' : '#e4e4e7',
                borderColor: currentCategory === cat && currentTab === 'study' ? '#dfb28c' : 'rgba(255,255,255,0.05)'
              }}>
              📁 {cat}
            </button>
          ))}
          <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)' }}/>
          <button onClick={() => setCurrentTab('alphabet')} style={{ width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '16px', fontSize: '18px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: currentTab==='alphabet'?'#dfb28c':'rgba(20, 20, 23, 0.6)', color: currentTab==='alphabet'?'#09090b':'#e4e4e7' }}>🔤 泰语全量字母表盘</button>
          
          <button onClick={() => setCurrentTab('love')} 
            style={{ 
              width: '100%', textAlign: 'left', padding: '18px 22px', borderRadius: '16px', fontSize: '18px', fontWeight: '900', border: '1px solid #991b1b', cursor: 'pointer',
              background: currentTab === 'love' ? 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' : 'rgba(153, 27, 27, 0.15)', color: '#fee2e2'
            }}>
            💝 浪漫告白：致周玉平
          </button>
        </div>

        {/* 右侧 */}
        <div style={{ gridColumn: 'span 3' }}>

          {/* 字母表 */}
          {currentTab === 'alphabet' && (
            <div style={{ backgroundColor: 'rgba(20, 20, 23, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '35px', borderRadius: '24px' }}>
              <h2 style={{ color: '#dfb28c', fontSize: '24px', fontWeight: 'bold', margin: '0 0 25px 0', fontFamily: 'Georgia, serif' }}>🔤 泰语声韵母全量大表盘</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '15px' }}>
                {THAI_ALPHABET.consonants.map((item, idx) => (
                  <div key={idx} onClick={()=>playAudio(item.thai, true, item.read)} style={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.04)', padding: '18px 14px', borderRadius: '16px', textAlign: 'center', cursor: 'pointer' }}>
                    <h4 style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{item.thai}</h4>
                    <p style={{ color: '#dfb28c', fontSize: '14px', fontWeight: 'bold', margin: '5px 0 0 0' }}>[{item.read}]</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 表白页 */}
          {currentTab === 'love' && (
            <div style={{ background: 'linear-gradient(145deg, #180c10 0%, #09090b 100%)', border: '1px solid #7f1d1d', padding: '40px', borderRadius: '32px', textAlign: 'center' }}>
              <h4 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fecdd3', fontFamily: 'Georgia, serif', margin: '0 0 20px 0' }}>致周玉平 · 电影感星空信笺</h4>
              
              <button onClick={toggleLoveMusic} style={{ backgroundColor: musicPlaying ? '#dc2626' : '#27272a', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: '16px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '30px' }}>
                {musicPlaying ? "⏸ 暂停播放 许嵩-《你若成风》" : "🎵 开启专属配乐：许嵩-《你若成风》"}
              </button>

              <div style={{ backgroundColor: '#09090b', border: '1px solid #450a0a', padding: '30px', borderRadius: '20px', cursor: 'pointer' }} onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")}>
                <h3 style={{ fontSize: '46px', fontWeight: '900', color: '#ffe4e6', margin: '0 0 10px 0' }}>ผมรักคุณหมดหัวใจ 🔊</h3>
                <p style={{ color: '#dfb28c', fontSize: '16px', margin: 0 }}>[Phom rak khun mot hua-chai]</p>
                <p style={{ color: '#fda4af', fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>“我将我的整颗内心，毫无保留地全部用来爱你。”</p>
              </div>
            </div>
          )}

          {/* 闪卡 */}
          {currentTab === 'study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {words.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} style={{ backgroundColor: 'rgba(20, 20, 23, 0.6)', border: '1px solid rgba(255,255,255,0.05)', padding: '55px 20px', borderRadius: '24px', textAlign: 'center', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', color: '#71717a', display: 'block', letterSpacing: '2px', marginBottom: '15px' }}>{currentCategory}</span>
                    <h2 style={{ fontSize: '72px', fontWeight: 'bold', color: '#fff', margin: '0 0 25px 0' }}>{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <p style={{ color: '#dfb28c', fontSize: '24px', fontWeight: 'bold', margin: 0 }}>[{words[currentIndex]?.read}]</p>
                        <p style={{ fontSize: '38px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '15px' }}>
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} style={{ flex: 2, backgroundColor: '#dfb28c', color: '#09090b', fontWeight: '900', border: 'none', padding: '16px', borderRadius: '14px', fontSize: '16px', cursor: 'pointer' }}>🔊 听取标准正音（多通道必响）</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} style={{ flex: 1, padding: '16px', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: favorites.includes(words[currentIndex]?.id) ? '#dfb28c' : 'transparent', color: favorites.includes(words[currentIndex]?.id) ? '#09090b' : '#fff' }}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已加入收藏' : '☆ 收藏此词'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} style={{ flex: 1, backgroundColor: 'rgba(25, 25, 28, 0.4)', border: '1px solid rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px', color: '#a1a1aa', cursor: 'pointer' }}>◁ 上一个</button>
                    <button onClick={handleNextWord} style={{ flex: 1, backgroundColor: '#dfb28c', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: '900', color: '#09090b', cursor: 'pointer' }}>下一个 ▷</button>
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