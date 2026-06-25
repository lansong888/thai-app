import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// ======================== 【请在此处填写你的 Supabase 凭证】 ========================
const SUPABASE_URL = "https://yjipexzowgjccmhmclef.supabase.co/rest/v1/";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqaXBleHpvd2dqY2NtaG1jbGVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzEzNzksImV4cCI6MjA5NzkwNzM3OX0.zlRtxkfjlViBpiW0hYEVcvtwJou8I8cebFiIWgBIQFo";
// =================================================================================

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Home() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({ streak_days: 0, total_words_learned: 0, today_words_learned: 0 });
  const [darkMode, setDarkMode] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [newWord, setNewWord] = useState({ category: '日常生活', thai: '', read: '', zh: '' });
  const [stats, setStats] = useState({ userCount: 0, wordCount: 0 });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) { setUser(session.user); loadUserData(session.user.id); }
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) loadUserData(session.user.id);
    });
    loadGlobalWords();
  }, [currentCategory]);

  async function loadGlobalWords() {
    let { data } = await supabase.from('words').select('*').eq('category', currentCategory);
    if (data) setWords(data);
  }

  async function loadUserData(userId) {
    let { data: prof } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
    if (prof) { setProfile(prof); setIsAdmin(prof.is_admin); }
    let { data: favs } = await supabase.from('user_favorites').select('word_id').eq('user_id', userId);
    if (favs) setFavorites(favs.map(f => f.word_id));
    let { data: errs } = await supabase.from('user_errors').select('word_id').eq('user_id', userId);
    if (errs) setErrors(errs.map(e => e.word_id));

    if (prof?.is_admin) {
      const { count: uCount } = await supabase.from('user_profiles').select('*', { count: 'exact', head: true });
      const { count: wCount } = await supabase.from('words').select('*', { count: 'exact', head: true });
      setStats({ userCount: uCount || 0, wordCount: wCount || 0 });
    }
  }

  async function handleAuth(type) {
    if (!email || !password) return alert("请完整填写账号密码");
    const { error } = type === 'login' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message); else if (type === 'register') alert("注册申请成功！");
  }
  
  async function handleSignOut() { await supabase.auth.signOut(); setUser(null); setIsAdmin(false); }
  
  // 🔊 免 Key 实时播放泰语正音路径修复
  function playAudio(text) { 
    new Audio(`/api/tts?text=${encodeURIComponent(text)}`).play(); 
  }

  async function toggleFavorite(wordId) {
    if (!user) return alert("请先在右上角登录，即可启用收藏夹与打卡保存进度！");
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
    await supabase.from('user_profiles').update({
      streak_days: newStreak,
      last_study_date: todayStr,
      total_words_learned: profile.total_words_learned + 1,
      today_words_learned: profile.today_words_learned + 1
    }).eq('id', user.id);
    loadUserData(user.id);
  }

  async function handleAddWord() {
    const { error } = await supabase.from('words').insert([newWord]);
    if (error) alert(error.message); else { alert("单词添加成功！"); loadGlobalWords(); }
  }

  function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
      const text = evt.target.result;
      const lines = text.split('\n').slice(1);
      const uploadRows = [];
      for (let line of lines) {
        const [category, thai, read, zh] = line.split(',');
        if (category && thai && read && zh) {
          uploadRows.push({ category: category.trim(), thai: thai.trim(), read: read.trim(), zh: zh.trim() });
        }
      }
      if (uploadRows.length > 0) {
        const { error } = await supabase.from('words').insert(uploadRows);
        if (error) alert("批量导入失败：" + error.message);
        else { alert(`成功批量导入 ${uploadRows.length} 个核心词汇！`); loadGlobalWords(); }
      }
    };
    reader.readAsText(file);
  }

  function prepareTest() {
    if (words.length < 4) return alert("当前分类词汇不足4个，无法生成测试题");
    setTestFeedback(null);
    const target = words[Math.floor(Math.random() * words.length)];
    setCurrentIndex(words.indexOf(target));
    const distractors = words.filter(w => w.id !== target.id).sort(() => 0.5 - Math.random()).slice(0, 3);
    setTestOptions([target, ...distractors].sort(() => 0.5 - Math.random()));
  }

  function checkAnswer(selected) {
    const correct = words[currentIndex];
    if (selected.id === correct.id) {
      setTestFeedback({ success: true, text: "🎉 太棒了！回答正确！" });
      markAsLearned(correct.id, true);
    } else {
      setTestFeedback({ success: false, text: `❌ 答错了，正确答案是: ${correct.zh}` });
      markAsLearned(correct.id, false);
    }
  }

  return (
    <div className={`${darkMode ? 'bg-slate-900 text-white' : 'bg-stone-50 text-slate-800'} min-h-screen transition-colors`}>
      <nav className="bg-white dark:bg-slate-800 border-b-4 border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇹🇭</span>
            <span className="text-2xl font-black text-green-500 font-mono">TRAE DUO THAI</span>
            <button onClick={() => setDarkMode(!darkMode)} className="p-1 bg-slate-100 dark:bg-slate-700 rounded-lg text-xs">🌓 主题</button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {!user ? (
              <div className="flex items-center gap-1 bg-amber-50 dark:bg-slate-700 p-2 rounded-xl border-2 border-amber-200">
                <input type="email" placeholder="邮箱" onChange={e=>setEmail(e.target.value)} className="p-1 text-xs border rounded dark:text-slate-900 w-24"/>
                <input type="password" placeholder="密码" onChange={e=>setPassword(e.target.value)} className="p-1 text-xs border rounded dark:text-slate-900 w-24"/>
                <button onClick={()=>handleAuth('login')} className="bg-green-500 text-white font-bold px-2 py-1 rounded text-xs">登录</button>
                <button onClick={()=>handleAuth('register')} className="bg-slate-200 dark:bg-slate-600 px-2 py-1 rounded text-xs text-slate-700">注册</button>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded-xl border-2 border-emerald-300">
                <span className="font-bold text-emerald-700">🔥 打卡 {profile.streak_days} 天</span>
                <span className="opacity-70 text-xs">{user.email}</span>
                {isAdmin && <button onClick={()=>setCurrentTab('admin')} className="text-xs bg-purple-600 text-white font-bold px-2 py-1 rounded-md">🛠️ 后台</button>}
                <button onClick={handleSignOut} className="text-xs text-rose-500 underline">退出</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="space-y-2">
          <h3 className="font-black text-slate-400 text-xs px-2">单词大分类</h3>
          {['日常生活', '旅游', '食物', '数字', '工作', '家庭', '商业', '直播常用语'].map((cat) => (
            <button key={cat} onClick={() => { setCurrentCategory(cat); setCurrentTab('study'); }}
              className={`w-full text-left p-3 rounded-2xl font-bold border-2 transition-all ${currentCategory === cat ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-white dark:bg-slate-800 border-slate-200 hover:bg-slate-100'}`}>
              📂 {cat}
            </button>
          ))}
          <hr className="my-4 border-slate-200"/>
          <button onClick={() => setCurrentTab('home')} className={`w-full text-left p-3 rounded-2xl font-black ${currentTab==='home'?'text-green-500':''}`}>🏠 个人首页</button>
          <button onClick={() => { setCurrentTab('test'); prepareTest(); }} className={`w-full text-left p-3 rounded-2xl font-black ${currentTab==='test'?'text-green-500':''}`}>🎯 关卡挑战模式</button>
        </aside>

        <section className="md:col-span-3">
          {currentTab === 'home' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 border-4 border-b-8 border-blue-400 p-6 rounded-3xl text-center">
                <p className="text-slate-400 text-xs font-bold">今日目标进度</p>
                <h4 className="text-4xl font-black mt-2 text-blue-500">{profile.today_words_learned} / 10</h4>
              </div>
              <div className="bg-white dark:bg-slate-800 border-4 border-b-8 border-green-400 p-6 rounded-3xl text-center">
                <p className="text-slate-400 text-xs font-bold">累计解锁词汇</p>
                <h4 className="text-4xl font-black mt-2 text-green-500">{profile.total_words_learned} 个</h4>
              </div>
              <div className="bg-white dark:bg-slate-800 border-4 border-b-8 border-purple-400 p-6 rounded-3xl text-center">
                <p className="text-slate-400 text-xs font-bold">错题 / 收藏夹</p>
                <h4 className="text-4xl font-black mt-2 text-purple-500">❌ {errors.length} | 🌟 {favorites.length}</h4>
              </div>
            </div>
          )}

          {currentTab === 'study' && (
            <div className="space-y-4">
              {words.length === 0 ? (
                <div className="p-12 text-center text-slate-400">暂无数据，请在管理员后台导入CSV</div>
              ) : (
                <div className="space-y-6">
                  <div onClick={()=>setShowPhonetic(!showPhonetic)} className="bg-white dark:bg-slate-800 border-4 border-b-8 border-slate-200 rounded-3xl p-12 text-center cursor-pointer hover:border-green-400">
                    <span className="text-xs font-bold text-slate-400 block mb-4">当前分类: {currentCategory}</span>
                    <h2 className="text-6xl font-black mb-6">{words[currentIndex]?.thai}</h2>
                    {showPhonetic && (
                      <div className="space-y-2">
                        <p className="text-xl text-green-500 font-mono">[{words[currentIndex]?.read}]</p>
                        <p className="text-2xl font-black text-slate-600 dark:text-slate-300">{words[currentIndex]?.zh}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border-2">
                    <button onClick={()=>playAudio(words[currentIndex]?.thai)} className="bg-blue-500 text-white font-black px-6 py-3 rounded-2xl shadow-[0_4px_0_#3b82f6]">🔊 点击正音</button>
                    <button onClick={()=>toggleFavorite(words[currentIndex]?.id)} className={`font-black px-6 py-3 rounded-2xl border-2 ${favorites.includes(words[currentIndex]?.id)?'bg-amber-400 text-white':'bg-white'}`}>
                      {favorites.includes(words[currentIndex]?.id) ? '★ 已收藏' : '☆ 收藏'}
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button onClick={()=>{ setShowPhonetic(false); setCurrentIndex((currentIndex - 1 + words.length) % words.length); }} className="flex-1 bg-slate-200 p-4 rounded-2xl font-bold">上一个</button>
                    <button onClick={()=>{ setShowPhonetic(false); markAsLearned(words[currentIndex].id, true); setCurrentIndex((currentIndex + 1) % words.length); }} className="flex-1 bg-green-500 text-white p-4 rounded-2xl font-black shadow-[0_5px_0_#22c55e]">完成，下一个</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentTab === 'test' && (
            <div className="bg-white dark:bg-slate-800 border-4 border-slate-200 rounded-3xl p-6 space-y-6">
              <div className="flex gap-2 border-b pb-4">
                <button onClick={()=>{setTestType('thai_to_zh'); prepareTest();}} className={`px-3 py-1.5 rounded-xl font-bold text-xs ${testType==='thai_to_zh'?'bg-purple-600 text-white':''}`}>泰译中</button>
                <button onClick={()=>{setTestType('zh_to_thai'); prepareTest();}} className={`px-3 py-1.5 rounded-xl font-bold text-xs ${testType==='zh_to_thai'?'bg-purple-600 text-white':''}`}>中译泰</button>
              </div>
              {words.length > 0 && words[currentIndex] && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                    {testType === 'thai_to_zh' ? <h3 className="text-4xl font-black">{words[currentIndex].thai}</h3> : <h3 className="text-4xl font-black">{words[currentIndex].zh}</h3>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {testOptions.map((opt, idx) => (
                      <button key={idx} onClick={()=>checkAnswer(opt)} className="p-4 bg-white dark:bg-slate-800 border-2 border-b-4 border-slate-200 hover:border-purple-500 rounded-2xl text-left font-bold">
                        🔹 {testType === 'thai_to_zh' ? `${opt.zh} [${opt.read}]` : opt.thai}
                      </button>
                    ))}
                  </div>
                  {testFeedback && (
                    <div className={`p-4 rounded-2xl text-center font-black ${testFeedback.success?'bg-green-100 text-green-800':'bg-rose-100 text-rose-800'}`}>
                      {testFeedback.text}
                      <button onClick={prepareTest} className="block mx-auto mt-3 bg-slate-800 text-white text-xs px-4 py-2 rounded-xl">继续下一题 ➡️</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {currentTab === 'admin' && isAdmin && (
            <div className="bg-white dark:bg-slate-800 border-4 border-purple-400 rounded-3xl p-6 space-y-6">
              <h2 className="text-2xl font-black text-purple-600">🛠️ 系统管理员后台</h2>
              <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900 p-4 rounded-2xl text-xs">
                <div><p className="text-slate-400 font-bold">注册用户数</p><h5 className="text-xl font-black">{stats.userCount} 人</h5></div>
                <div><p className="text-slate-400 font-bold">词库总容量</p><h5 className="text-xl font-black">{stats.wordCount} 条</h5></div>
              </div>
              <div className="border-2 border-dashed border-slate-300 p-6 rounded-2xl text-center bg-purple-50/20">
                <span className="text-sm font-bold block mb-2">📂 批量导入官方大词库 CSV 文件</span>
                <input type="file" accept=".csv" onChange={handleCSVUpload} className="text-xs block mx-auto"/>
              </div>
              <div className="space-y-3 border-t pt-4">
                <span className="text-sm font-bold block">✏️ 手动添加单条单词</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select onChange={e=>setNewWord({...newWord, category:e.target.value})} className="border p-2 rounded-xl text-slate-900">
                    {['日常生活', '旅游', '食物', '数字', '工作', '家庭', '商业', '直播常用语'].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="text" placeholder="泰语原文" onChange={e=>setNewWord({...newWord, thai:e.target.value})} className="border p-2 rounded-xl text-slate-900"/>
                  <input type="text" placeholder="罗马拼音" onChange={e=>setNewWord({...newWord, read:e.target.value})} className="border p-2 rounded-xl text-slate-900"/>
                  <input type="text" placeholder="中文释义" onChange={e=>setNewWord({...newWord, zh:e.target.value})} className="border p-2 rounded-xl text-slate-900"/>
                </div>
                <button onClick={handleAddWord} className="w-full bg-purple-600 text-white font-bold py-2 rounded-xl text-xs">存入云端数据库</button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}