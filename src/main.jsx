import { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Activity, ArrowLeft, BarChart3, Bookmark, Check, ChevronLeft, CircleAlert,
  Copy, Headphones, Home, LayoutGrid, Menu, MessageCircle, MoreHorizontal,
  PanelRight, Plus, RotateCcw, Search, Send, Settings2, Share2, ShieldCheck,
  SlidersHorizontal, Smartphone, Sparkles, Star, Store, Tag, UserRound, X, Zap,
} from 'lucide-react'
import './styles.css'

const products = [
  { id: 'nova', name: 'Nova Hub Mini', brand: 'Nova', category: 'مساعد منزلي', price: 279, rating: 4.8, reviews: 1840, color: 'mint', badge: 'الأكثر طلبًا', summary: 'تحكم صوتي سريع، تصميم صغير، وتوافق قوي مع الأجهزة المنزلية.', specs: ['تحكم صوتي عربي', 'Matter + Wi‑Fi 6', 'شاشة 3.2 بوصة'], pros: ['أسرع استجابة', 'سهل الإعداد'], cons: ['ذاكرة محدودة'] },
  { id: 'orbit', name: 'Orbit Home S2', brand: 'Orbit', category: 'مساعد منزلي', price: 319, rating: 4.6, reviews: 960, color: 'orange', badge: 'أفضل قيمة', summary: 'مركز منزلي متوازن لعشاق الأتمتة مع خصوصية محلية.', specs: ['معالجة محلية', 'Zigbee + Thread', 'بطارية 8 ساعات'], pros: ['خصوصية ممتازة', 'يدعم بروتوكولات أكثر'], cons: ['تطبيق أقل سلاسة'] },
  { id: 'pulse', name: 'Pulse Air 2', brand: 'Pulse', category: 'سماعات لاسلكية', price: 449, rating: 4.7, reviews: 2120, color: 'purple', badge: 'صوت واضح', summary: 'عزل ضوضاء متكيف وبطارية طويلة للمكالمات والتنقل.', specs: ['ANC متكيف', 'بطارية 32 ساعة', 'مقاومة IPX4'], pros: ['صوت متوازن', 'مريحة لفترات طويلة'], cons: ['علبة أكبر قليلًا'] },
  { id: 'halo', name: 'Halo Watch 4', brand: 'Halo', category: 'ساعات ذكية', price: 599, rating: 4.5, reviews: 734, color: 'blue', badge: 'صحة ونشاط', summary: 'متابعة نشاط ونوم دقيقة مع شاشة ساطعة وتصميم خفيف.', specs: ['GPS مدمج', 'مراقبة نوم', 'مقاومة 5ATM'], pros: ['شاشة ممتازة', 'بطارية 9 أيام'], cons: ['خيارات تطبيق أقل'] },
  { id: 'pixelia', name: 'Pixelia Pro 9', brand: 'Pixelia', category: 'هواتف ذكية', price: 2899, rating: 4.8, reviews: 3410, color: 'mint', badge: 'كاميرا متقدمة', summary: 'هاتف رائد خفيف بكاميرا ليلية قوية وتجربة أندرويد نظيفة.', specs: ['كاميرا 50MP', 'بطارية 4,700mAh', 'شحن 45W'], pros: ['تصوير ليلي ممتاز', 'أداء سلس'], cons: ['لا يوجد شاحن في العلبة'] },
  { id: 'zenfone', name: 'Zenfone Air 12', brand: 'Zenfone', category: 'هواتف ذكية', price: 2199, rating: 4.6, reviews: 1870, color: 'orange', badge: 'أفضل توازن', summary: 'شاشة سريعة وبطارية يومين لمن يريد أداءً قويًا بسعر أهدأ.', specs: ['شاشة 120Hz', 'بطارية 5,200mAh', 'ذاكرة 256GB'], pros: ['بطارية أطول', 'قيمة قوية'], cons: ['الكاميرا الليلية أضعف'] },
]

const initialMessages = [
  { id: 1, from: 'bot', kind: 'welcome', text: 'أهلًا! أنا مُقارن، أساعدك تختار الأداة الذكية الأنسب لك بدون دوخة المواصفات.', time: 'الآن' },
  { id: 2, from: 'bot', text: 'قل لي ماذا تبحث عنه، أو ابدأ بأحد الاقتراحات السريعة. سأطرح سؤالًا واحدًا في كل مرة وأبني المقارنة معك.', time: 'الآن' },
]

const intents = [
  { label: 'قارن لي منتجين', icon: SlidersHorizontal, prompt: 'أريد مقارنة بين Nova Hub Mini و Orbit Home S2' },
  { label: 'قارن الهواتف الذكية', icon: Smartphone, prompt: 'قارن بين Pixelia Pro 9 و Zenfone Air 12' },
  { label: 'أفضل خيار بميزانية', icon: Tag, prompt: 'ما أفضل أداة ذكية بميزانية 350 ريال؟' },
  { label: 'ساعدني أختار', icon: Sparkles, prompt: 'ساعدني أختار أداة ذكية للمنزل' },
]

function formatPrice(price) { return `${price.toLocaleString('ar-SA')} ر.س` }

function ProductArt({ product, small = false }) {
  return <div className={`product-art ${product.color} ${small ? 'small' : ''}`}><span>{product.name.split(' ')[0]}</span><div className="art-orb" /><div className="art-line" /></div>
}

function App() {
  const [activeView, setActiveView] = useState('chat')
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [compareIds, setCompareIds] = useState(['nova', 'orbit'])
  const [savedIds, setSavedIds] = useState(['pulse'])
  const [isTyping, setIsTyping] = useState(false)
  const [toast, setToast] = useState('')
  const [showDetails, setShowDetails] = useState(null)
  const [isMobileNav, setIsMobileNav] = useState(false)

  const compareProducts = useMemo(() => products.filter((product) => compareIds.includes(product.id)), [compareIds])
  const savedProducts = useMemo(() => products.filter((product) => savedIds.includes(product.id)), [savedIds])

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  const toggleSaved = (id) => {
    setSavedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
    notify(savedIds.includes(id) ? 'أزيل المنتج من المحفوظات' : 'حُفظ المنتج للرجوع إليه لاحقًا')
  }

  const addToCompare = (id) => {
    setCompareIds((current) => current.includes(id) ? current : [...current, id].slice(-3))
    notify('أضيف المنتج إلى المقارنة')
  }

  const respondTo = (rawText) => {
    const text = rawText.trim()
    if (!text) return
    setMessages((current) => [...current, { id: Date.now(), from: 'user', text, time: 'الآن' }])
    setInput('')
    setIsTyping(true)
    window.setTimeout(() => {
      let reply = 'فهمت عليك. أستطيع مساعدتك في المقارنة، الميزانية، أو اختيار أداة مناسبة. هل تفضّل أن نبدأ بالفئة أم بالميزانية؟'
      if (/هاتف|هواتف|جوال|جوالات|pixelia|zenfone|آيفون|ايفون|سامسونج/i.test(text)) {
        reply = 'ممتاز — جهزت لك سيناريو الهواتف الذكية. Pixelia Pro 9 يتفوق في الكاميرا والتجربة النظيفة، بينما Zenfone Air 12 يمنحك بطارية أطول وقيمة أقوى.'
        setCompareIds(['pixelia', 'zenfone'])
        setActiveView('compare')
      } else if (/مقارن|قارن|nova|orbit/i.test(text)) {
        reply = 'ممتاز — جهزت لك مقارنة أولية بين Nova Hub Mini و Orbit Home S2. الفرق الأوضح: Nova أسرع وأسهل، وOrbit أقوى في الخصوصية والبروتوكولات.'
        setCompareIds(['nova', 'orbit'])
        setActiveView('compare')
      } else if (/ميزاني|350|سعر|ر.س/i.test(text)) {
        reply = 'ضمن 350 ر.س، أرشح Nova Hub Mini كبداية متوازنة. هل الأولوية عندك للسرعة أم للخصوصية؟'
      } else if (/منزل|بيت|ذكي/i.test(text)) {
        reply = 'للمنزل، أبدأ معك بمساعد منزلي. هل تريد تحكمًا صوتيًا سريعًا أم توافقًا أكبر مع بروتوكولات الأجهزة؟'
      } else if (/بشر|دعم|موظف/i.test(text)) {
        reply = 'أكيد. سأصعّد المحادثة إلى فريق الدعم. الحالة الآن: تم إنشاء الطلب، ومتوسط الانتظار أقل من 3 دقائق.'
      } else if (/مرحبا|أهل|السلام/i.test(text)) {
        reply = 'مرحبًا بك من جديد. هل نكمل من المقارنة المحفوظة أم نبدأ بحثًا جديدًا؟'
      }
      setMessages((current) => [...current, { id: Date.now() + 1, from: 'bot', text: reply, time: 'الآن' }])
      setIsTyping(false)
    }, 700)
  }

  const shareComparison = async () => {
    const text = `مقارنة مُقارن: ${compareProducts.map((item) => item.name).join(' و ')}.`
    try { await navigator.clipboard?.writeText(text); notify('نُسخ ملخص المقارنة — يمكنك مشاركته الآن') } catch { notify('المقارنة جاهزة للمشاركة') }
  }

  const navItems = [
    { id: 'chat', label: 'المحادثة', icon: MessageCircle },
    { id: 'compare', label: 'المقارنة', icon: SlidersHorizontal, count: compareIds.length },
    { id: 'saved', label: 'المحفوظات', icon: Bookmark, count: savedIds.length },
    { id: 'analytics', label: 'الإشراف', icon: BarChart3 },
  ]

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark"><img src="/muqarn-logo.svg" alt="" /></div><div><div className="brand-name">مُقارن</div><div className="brand-sub">مساعد التسوق الذكي</div></div></div>
      <div className="topbar-meta"><span className="live-dot" /> <span>البيانات التجريبية متصلة</span><button className="icon-button mobile-menu" onClick={() => setIsMobileNav((current) => !current)}><Menu size={18} /></button><button className="avatar" aria-label="حساب المستخدم"><UserRound size={17} /></button></div>
    </header>
    <div className="layout">
      <aside className={`sidebar ${isMobileNav ? 'open' : ''}`}>
        <div className="workspace-label">مساحة العمل</div>
        <nav>{navItems.map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${activeView === item.id ? 'active' : ''}`} onClick={() => { setActiveView(item.id); setIsMobileNav(false) }}><Icon size={18} /><span>{item.label}</span>{item.count !== undefined && <em>{item.count}</em>}</button> })}</nav>
        <div className="sidebar-divider" />
        <button className="nav-item muted"><Settings2 size={18} /><span>الإعدادات</span></button>
        <div className="sidebar-bottom"><div className="security-chip"><ShieldCheck size={16} /><div><strong>وضع آمن</strong><span>لا شراء تلقائي</span></div></div><button className="support-button" onClick={() => respondTo('أريد التحدث مع دعم بشري')}><Headphones size={16} /> تصعيد لبشري</button></div>
      </aside>
      <main className="main-content">
        {activeView === 'chat' && <ChatView messages={messages} input={input} setInput={setInput} respondTo={respondTo} isTyping={isTyping} intents={intents} />}
        {activeView === 'compare' && <CompareView products={compareProducts} allProducts={products} addToCompare={addToCompare} toggleSaved={toggleSaved} savedIds={savedIds} onShare={shareComparison} onDetails={setShowDetails} />}
        {activeView === 'saved' && <SavedView products={savedProducts} toggleSaved={toggleSaved} onDetails={setShowDetails} />}
        {activeView === 'analytics' && <AnalyticsView />}
      </main>
      <aside className="context-panel">
        <div className="context-header"><div><span className="eyebrow">السياق الحالي</span><h2>{activeView === 'analytics' ? 'صحة المساعد' : activeView === 'saved' ? 'قائمتك' : 'مقارنة سريعة'}</h2></div><button className="icon-button"><MoreHorizontal size={18} /></button></div>
        {activeView === 'analytics' ? <MiniHealth /> : <ContextCompare compareProducts={compareProducts} onDetails={setShowDetails} onShare={shareComparison} />}
        <div className="context-note"><CircleAlert size={15} /><span>مُقارن لا ينفّذ الشراء ولا يحفظ بيانات الدفع.</span></div>
      </aside>
    </div>
    {toast && <div className="toast"><Check size={16} /> {toast}</div>}
    {showDetails && <DetailsModal product={showDetails} onClose={() => setShowDetails(null)} toggleSaved={toggleSaved} savedIds={savedIds} addToCompare={addToCompare} />}
  </div>
}

function ChatView({ messages, input, setInput, respondTo, isTyping, intents }) {
  return <section className="chat-view">
    <div className="section-heading"><div><div className="eyebrow">محادثة جديدة <span className="status-pill">● جاهز</span></div><h1>كيف نبدأ اليوم؟</h1><p>أخبرني بما تريد، وسأحوّل المواصفات الكثيرة إلى قرار واضح.</p></div><button className="secondary-button"><RotateCcw size={15} /> إعادة التهيئة</button></div>
    <div className="intent-row">{intents.map(({ label, icon: Icon, prompt }) => <button key={label} className="intent-card" onClick={() => respondTo(prompt)}><span className="intent-icon"><Icon size={17} /></span><span>{label}</span><ChevronLeft size={15} /></button>)}</div>
    <div className="conversation-card">
      <div className="conversation-top"><div className="bot-identity"><div className="bot-avatar"><Sparkles size={18} /></div><div><strong>مُقارن</strong><span>يرد عادة خلال ثوانٍ</span></div></div><span className="conversation-id">جلسة #MQ-2048</span></div>
      <div className="messages">{messages.map((message) => <div key={message.id} className={`message-row ${message.from}`}><div className={`message-bubble ${message.kind === 'welcome' ? 'welcome-bubble' : ''}`}>{message.kind === 'welcome' && <span className="message-kicker">إشارة البداية</span>}<p>{message.text}</p>{message.from === 'bot' && message.id === 2 && <div className="message-actions"><button onClick={() => respondTo('قارن لي منتجين')}><SlidersHorizontal size={14} /> ابدأ مقارنة</button><button onClick={() => respondTo('أفضل خيار بميزانية 350 ريال')}><Tag size={14} /> حسب الميزانية</button></div>}</div><span className="message-time">{message.time}</span></div>)}{isTyping && <div className="message-row bot"><div className="message-bubble typing"><span /><span /><span /></div></div>}</div>
      <div className="composer"><div className="composer-input"><Search size={17} /><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') respondTo(input) }} placeholder="اكتب مثلًا: قارن بين سماعتين أقل من 500 ر.س" /><button className="send-button" onClick={() => respondTo(input)}><Send size={17} /></button></div><div className="composer-footer"><span><Zap size={13} /> اقتراحات ذكية مفعّلة</span><span>اضغط Enter للإرسال</span></div></div>
    </div>
  </section>
}

function CompareView({ products: selected, allProducts, addToCompare, toggleSaved, savedIds, onShare, onDetails }) {
  const isPhones = selected.some((item) => item.category === 'هواتف ذكية')
  return <section className="content-view"><div className="section-heading compact"><div><div className="eyebrow">قرار أوضح <span className="status-pill">{selected.length} منتجات</span></div><h1>{isPhones ? 'مقارنة الهواتف الذكية' : 'مقارنة الأدوات'}</h1><p>فروقات مختصرة تساعدك تعرف أي خيار يناسب أولويتك.</p></div><button className="accent-button" onClick={onShare}><Share2 size={16} /> مشاركة المقارنة</button></div><div className="compare-grid">{selected.map((product) => <ProductCard key={product.id} product={product} toggleSaved={toggleSaved} saved={savedIds.includes(product.id)} onDetails={onDetails} />)}{selected.length < 3 && <div className="add-product-card"><div className="add-circle"><Plus size={20} /></div><strong>أضف منتجًا للمقارنة</strong><span>اختر من البيانات التجريبية</span><div className="product-picker">{allProducts.filter((item) => !selected.some((chosen) => chosen.id === item.id)).map((item) => <button key={item.id} onClick={() => addToCompare(item.id)}>{item.name}<Plus size={14} /></button>)}</div></div>}</div><div className="comparison-table"><div className="table-heading"><div><span className="eyebrow">نظرة سريعة</span><h3>ما الفرق فعلًا؟</h3></div><span className="recommendation"><Sparkles size={14} /> {isPhones ? 'ترشيح مُقارن: Pixelia Pro 9 للكاميرا' : 'ترشيح مُقارن: Nova Hub Mini'}</span></div><div className="table-row labels"><span>المعيار</span>{selected.map((item) => <span key={item.id}>{item.brand}</span>)}</div>{['السعر', 'التقييم', 'البطارية / الطاقة', 'الأفضل لـ'].map((label, index) => <div className="table-row" key={label}><span>{label}</span>{selected.map((item) => <span key={item.id}>{index === 0 ? formatPrice(item.price) : index === 1 ? <><Star size={13} fill="currentColor" /> {item.rating}</> : index === 2 ? item.specs[index === 2 ? 1 : 0] : index === 3 ? item.category === 'هواتف ذكية' ? item.id === 'pixelia' ? 'التصوير والأداء' : 'البطارية والقيمة' : item.id === 'nova' ? 'البداية السريعة' : 'الخصوصية والتوافق' : ''}</span>)}</div>)}</div></section>
}

function ProductCard({ product, toggleSaved, saved, onDetails }) { return <article className="product-card"><div className="product-card-top"><ProductArt product={product} /><button className={`save-button ${saved ? 'saved' : ''}`} onClick={() => toggleSaved(product.id)}><Bookmark size={16} fill={saved ? 'currentColor' : 'none'} /></button></div><div className="product-card-body"><div className="product-meta"><span>{product.badge} · {product.category}</span><span><Star size={13} fill="currentColor" /> {product.rating}</span></div><h3>{product.name}</h3><p>{product.summary}</p><div className="spec-chips">{product.specs.map((spec) => <span key={spec}>{spec}</span>)}</div><div className="product-card-footer"><strong>{formatPrice(product.price)}</strong><button onClick={() => onDetails(product)}>التفاصيل <ArrowLeft size={14} /></button></div></div></article> }

function SavedView({ products, toggleSaved, onDetails }) { return <section className="content-view"><div className="section-heading compact"><div><div className="eyebrow">قائمة شخصية</div><h1>المحفوظات</h1><p>كل المنتجات التي تريد الرجوع إليها لاحقًا.</p></div><span className="saved-count"><Bookmark size={16} /> {products.length} محفوظ</span></div>{products.length ? <div className="saved-list">{products.map((product) => <div className="saved-row" key={product.id}><ProductArt product={product} small /><div className="saved-info"><strong>{product.name}</strong><span>{product.category} · {formatPrice(product.price)}</span></div><div className="saved-rating"><Star size={13} fill="currentColor" /> {product.rating}</div><button className="text-button" onClick={() => onDetails(product)}>عرض التفاصيل <ArrowLeft size={14} /></button><button className="icon-button" onClick={() => toggleSaved(product.id)}><X size={16} /></button></div>)}</div> : <div className="empty-state"><Bookmark size={28} /><h3>لم تحفظ منتجات بعد</h3><p>استكشف المقارنة واضغط على أيقونة الحفظ لتظهر المنتجات هنا.</p></div>}</section> }

function AnalyticsView() { return <section className="content-view"><div className="section-heading compact"><div><div className="eyebrow">إشراف داخلي <span className="status-pill orange">تجريبي</span></div><h1>لوحة صحة المساعد</h1><p>نظرة سريعة على الاستخدام والنوايا التي تحتاج تحسينًا.</p></div><button className="secondary-button"><ShieldCheck size={15} /> صلاحيات المشرف</button></div><div className="metric-grid"><Metric label="المحادثات" value="1,284" delta="+12.8%" icon={MessageCircle} /><Metric label="المقارنات" value="426" delta="+8.4%" icon={SlidersHorizontal} /><Metric label="معدل التصعيد" value="4.6%" delta="−1.2%" icon={Headphones} positive iconTone="orange" /><Metric label="رضا الجلسات" value="92%" delta="+3.1%" icon={ShieldCheck} positive /></div><div className="analytics-grid"><div className="analytics-card"><div className="analytics-card-heading"><div><span className="eyebrow">آخر 7 أيام</span><h3>نشاط المحادثات</h3></div><Activity size={18} /></div><div className="chart"><div className="chart-grid"><i /><i /><i /><i /></div><svg viewBox="0 0 520 160" preserveAspectRatio="none"><path d="M0 125 C50 115 60 90 110 100 S160 70 205 91 S260 50 305 63 S350 33 390 56 S440 48 520 20" fill="none" stroke="#72e0c1" strokeWidth="3" /><path d="M0 125 C50 115 60 90 110 100 S160 70 205 91 S260 50 305 63 S350 33 390 56 S440 48 520 20 L520 160 L0 160Z" fill="url(#area)" opacity=".35" /><defs><linearGradient id="area" x1="0" x2="0" y1="0" y2="1"><stop stopColor="#72e0c1"/><stop offset="1" stopColor="#72e0c1" stopOpacity="0"/></linearGradient></defs></svg></div><div className="chart-labels"><span>الأحد</span><span>الثلاثاء</span><span>الخميس</span><span>اليوم</span></div></div><div className="analytics-card intents-card"><div className="analytics-card-heading"><div><span className="eyebrow">الأكثر شيوعًا</span><h3>النوايا المدعومة</h3></div><LayoutGrid size={18} /></div>{[['مقارنة المنتجات', 62, 'mint'], ['اختيار حسب الميزانية', 48, 'orange'], ['تفاصيل منتج', 31, 'purple'], ['تصعيد لدعم بشري', 12, 'red']].map(([label, value, tone]) => <div className="intent-stat" key={label}><div><span>{label}</span><strong>{value}%</strong></div><div className="bar"><i className={tone} style={{ width: `${value}%` }} /></div></div>)}</div></div><div className="moderation-strip"><div><ShieldCheck size={18} /><div><strong>ضوابط الإشراف فعّالة</strong><span>المحتوى غير المدعوم يُحوّل إلى fallback، ولا توجد إجراءات شراء تلقائية.</span></div></div><span className="permission-badge">مشرف · قراءة فقط</span></div></section> }

function Metric({ label, value, delta, icon: Icon, positive, iconTone }) { return <div className="metric"><div className={`metric-icon ${iconTone || ''}`}><Icon size={17} /></div><span>{label}</span><strong>{value}</strong><small className={positive ? 'positive' : ''}>{delta} مقارنة بالأسبوع الماضي</small></div> }
function ContextCompare({ compareProducts, onDetails, onShare }) { const isPhones = compareProducts.some((product) => product.category === 'هواتف ذكية'); return <div className="context-stack"><div className="mini-compare-head"><span>الترشيح الحالي</span><button className="icon-button" onClick={onShare}><Share2 size={15} /></button></div>{compareProducts.slice(0, 2).map((product, index) => <div className="mini-product" key={product.id}><ProductArt product={product} small /><div><strong>{product.name}</strong><span>{formatPrice(product.price)} · {product.rating} ★</span></div><em>{index === 0 ? '01' : '02'}</em></div>)}<div className="mini-verdict"><Sparkles size={15} /><span><strong>الفرق الحاسم</strong> {isPhones ? 'Pixelia للكاميرا، وZenfone للبطارية والقيمة.' : 'Nova أسرع في الإعداد، وOrbit أوسع توافقًا.'}</span></div><button className="wide-button" onClick={() => compareProducts[0] && onDetails(compareProducts[0])}>عرض التفاصيل <ArrowLeft size={15} /></button></div> }
function MiniHealth() { return <div className="health-stack"><div className="health-score"><div className="score-ring"><strong>92</strong><span>/100</span></div><div><strong>المساعد بحالة جيدة</strong><span>آخر فحص منذ 8 دقائق</span></div></div><div className="health-row"><span><span className="tiny-dot mint" /> زمن الاستجابة</span><strong>1.8s</strong></div><div className="health-row"><span><span className="tiny-dot orange" /> الطلبات غير المدعومة</span><strong>3.2%</strong></div><div className="health-row"><span><span className="tiny-dot purple" /> نجاح الاستعادة</span><strong>98.4%</strong></div></div> }
function DetailsModal({ product, onClose, toggleSaved, savedIds, addToCompare }) { return <div className="modal-backdrop" onClick={onClose}><div className="details-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={onClose}><X size={18} /></button><ProductArt product={product} /><div className="details-content"><div className="product-meta"><span>{product.badge}</span><span><Star size={13} fill="currentColor" /> {product.rating} ({product.reviews})</span></div><h2>{product.name}</h2><p>{product.summary}</p><div className="detail-price">{formatPrice(product.price)}</div><div className="details-columns"><div><span className="eyebrow">المواصفات</span>{product.specs.map((spec) => <div className="check-line" key={spec}><Check size={14} /> {spec}</div>)}</div><div><span className="eyebrow">رأي مُقارن</span>{product.pros.map((pro) => <div className="check-line good" key={pro}><Check size={14} /> {pro}</div>)}{product.cons.map((con) => <div className="check-line caution" key={con}><CircleAlert size={14} /> {con}</div>)}</div></div><div className="modal-actions"><button className="accent-button" onClick={() => addToCompare(product.id)}><SlidersHorizontal size={16} /> أضف للمقارنة</button><button className={`secondary-button ${savedIds.includes(product.id) ? 'saved-action' : ''}`} onClick={() => toggleSaved(product.id)}><Bookmark size={16} /> {savedIds.includes(product.id) ? 'محفوظ' : 'حفظ المنتج'}</button></div></div></div></div> }

export default App

createRoot(document.getElementById('root')).render(<App />)
