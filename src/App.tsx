import { useMemo, useState } from 'react'
import campusMemory from './assets/campus-memory.png'

type View = 'landing' | 'map' | 'profile' | 'admin'
type Pin = {
  id: number
  title: string
  place: string
  author: string
  initials: string
  date: string
  year: number
  theme: string
  text: string
  x: number
  y: number
  color: string
  photo?: string
  audio?: boolean
  reactions: Record<string, number>
}

const initialPins: Pin[] = [
  {
    id: 1, title: 'The library steps', place: 'Hawthorne Library', author: 'Maya Chen', initials: 'MC',
    date: 'September 14, 2023', year: 2023, theme: 'Friendship', color: '#f08a68', x: 48, y: 47,
    text: 'We met here every Friday after class. Someone always brought coffee, and somehow we never opened our textbooks.',
    photo: campusMemory, reactions: { '♥': 24, '✦': 8, '☻': 5 },
  },
  {
    id: 2, title: 'Midnight rehearsal', place: 'Ellis Arts Hall', author: 'Theo Brooks', initials: 'TB',
    date: 'April 22, 2021', year: 2021, theme: 'Campus Life', color: '#efb85d', x: 67, y: 29,
    text: 'The halls echoed until 2am before the spring showcase. Tired, happy, and completely in our element.',
    audio: true, reactions: { '♥': 17, '✦': 3 },
  },
  {
    id: 3, title: 'A quiet protest', place: 'Founders Quad', author: 'Sam Rivera', initials: 'SR',
    date: 'October 8, 2019', year: 2019, theme: 'History', color: '#82a999', x: 35, y: 31,
    text: 'By noon, the whole quad was filled with handmade signs. It felt like the campus found its voice at once.',
    reactions: { '♥': 32, '✦': 11 },
  },
  {
    id: 4, title: 'First snow, no classes', place: 'Marston Green', author: 'Eli Grant', initials: 'EG',
    date: 'January 18, 2022', year: 2022, theme: 'Campus Life', color: '#efb85d', x: 28, y: 66,
    text: 'The cancellation email arrived and within minutes the green became a snowball arena.',
    reactions: { '♥': 19, '☻': 12 },
  },
  {
    id: 5, title: 'The long goodbye', place: 'Old North Gate', author: 'Priya Shah', initials: 'PS',
    date: 'May 29, 2018', year: 2018, theme: 'Friendship', color: '#f08a68', x: 75, y: 68,
    text: 'We promised we would all be back in a year. It took three, but we kept the promise.',
    reactions: { '♥': 42, '✦': 6 },
  },
]

const Icon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3Z"/><path d="M8 3v15M16 6v15"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    tune: <><path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/></>,
    flame: <path d="M12 22c4.4 0 8-3.6 8-8 0-3.2-1.5-5.8-4.6-8.5.1 2-1 3.8-2.4 4.5.2-3.3-1.7-6.5-4.4-8C9 5.3 7 7.4 5.8 9.3 2.8 14 6.3 22 12 22Z"/>,
    layers: <><path d="m12 2 9 5-9 5-9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M4 22c.5-5 3-7 8-7s7.5 2 8 7"/></>,
    flag: <><path d="M5 21V4"/><path d="M5 5c5-3 7 3 14 0v9c-7 3-9-3-14 0"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    chevron: <path d="m9 18 6-6-6-6"/>,
    comment: <path d="M21 14a5 5 0 0 1-5 5H8l-5 3V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5Z"/>,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"/>,
    share: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.6 10.5 6.8-4M8.6 13.5l6.8 4"/></>,
    sparkle: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7Z"/></>,
    upload: <><path d="M12 16V3M7 8l5-5 5 5"/><path d="M4 15v5h16v-5"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    bookmark: <path d="M6 3h12v19l-6-4-6 4Z"/>,
    back: <path d="m15 18-6-6 6-6"/>,
    more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    play: <path d="m8 5 11 7-11 7Z"/>,
    grid: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  }
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function Brand({ onClick }: { onClick?: () => void }) {
  return <button className="brand" onClick={onClick}><span className="brand-mark"><Icon name="pin" size={18}/></span><span>Echo<span>—</span>Map</span></button>
}

function Landing({ enter }: { enter: () => void }) {
  return <div className="landing">
    <header className="landing-nav">
      <Brand/>
      <nav><button>Explore stories</button><button>How it works</button></nav>
      <div className="auth-actions"><button className="text-btn" onClick={enter}>Log in</button><button className="primary small" onClick={enter}>Sign up</button></div>
    </header>
    <main className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span></span>A living archive of place</div>
        <h1>Every place<br/>has a <em>story.</em></h1>
        <p>Pin the moments that shaped you. Discover the memories layered into the places you pass every day.</p>
        <div className="hero-actions"><button className="primary" onClick={enter}>Start your map <Icon name="chevron" size={18}/></button><button className="secondary" onClick={enter}><Icon name="map" size={18}/> Explore nearby</button></div>
        <div className="community"><div className="avatar-stack"><span>MC</span><span>SR</span><span>TB</span><span>+2k</span></div><p><b>2,400+ memories</b><br/>shared across campus</p></div>
      </div>
      <div className="hero-map">
        <MapArtwork compact/>
        <div className="preview-card">
          <img src={campusMemory} alt="Friends gathering on library steps"/>
          <div><span className="preview-tag">FRIENDSHIP · 2023</span><h3>The library steps</h3><p>“We met here every Friday after class...”</p><div className="preview-author"><span>MC</span> Maya Chen <b>♥ 24</b></div></div>
        </div>
        <div className="floating-note"><Icon name="sparkle" size={17}/><span><b>Location story</b><small>7 memories woven together</small></span></div>
      </div>
    </main>
    <footer className="landing-foot"><span>Scroll to discover</span><div></div><span>Built for the places that stay with us.</span></footer>
  </div>
}

function MapArtwork({ compact = false, heatmap = false }: { compact?: boolean; heatmap?: boolean }) {
  return <div className={`map-art ${compact ? 'compact' : ''}`}>
    <svg viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
      <rect width="1000" height="700" fill="#181a19"/>
      <g className="map-blocks" fill="#222522" stroke="#2d312e" strokeWidth="2">
        <path d="M-20 20h210l50 100-80 95H0Z"/><path d="M260-20h210l-20 160-170 15-50-80Z"/>
        <path d="M505-20h240l55 100-70 100-235-35Z"/><path d="M830-20h190v190l-130 20-80-100Z"/>
        <path d="M-10 260l170-20 65 100-35 130H-10Z"/><path d="M270 210l190-25 60 105-55 145-235-15Z"/>
        <path d="M555 220l185-10 50 130-100 95-165-80Z"/><path d="M835 230l185-20v220l-170 5-40-100Z"/>
        <path d="M-20 510h210l45 90-55 120H-20Z"/><path d="M265 470l230 20-30 230H240Z"/>
        <path d="M530 470l230-10 35 260H500Z"/><path d="M820 480l200-20v260H835Z"/>
      </g>
      <g className="map-roads" fill="none" stroke="#343835" strokeWidth="18">
        <path d="M-10 235C250 205 420 110 560 165s250 75 460 35"/><path d="M210-20c20 170 70 260 30 420s5 230 25 320"/>
        <path d="M785-20c0 170 65 280 20 430s20 220 25 310"/><path d="M-20 485c220-25 370-35 530-15s300-10 510-25"/>
      </g>
      <g fill="none" stroke="#272a28" strokeWidth="3"><path d="M0 350h1000"/><path d="M385 0v700"/><path d="M650 0v700"/></g>
      <g fill="#303632" stroke="#435048" strokeWidth="2"><path d="M75 70h105v75H75Z"/><path d="M315 260h120v95H315Z"/><path d="M565 65h145v75H565Z"/><path d="M860 280h100v90H860Z"/><path d="M570 545h130v90H570Z"/></g>
      <g className="map-labels" fill="#777d77" fontSize="14" fontFamily="DM Sans, sans-serif" letterSpacing="1"><text x="91" y="112">NORTH HALL</text><text x="322" y="312">FOUNDERS QUAD</text><text x="572" y="106">ELLIS ARTS</text><text x="555" y="445">HAWTHORNE WALK</text><text x="860" y="330">SCIENCE CTR</text><text x="580" y="595">MARSTON GREEN</text></g>
    </svg>
    {heatmap && <><span className="heat h1"></span><span className="heat h2"></span><span className="heat h3"></span></>}
  </div>
}

function MainMap({ setView }: { setView: (v: View) => void }) {
  const [pins, setPins] = useState(initialPins)
  const [activePin, setActivePin] = useState<Pin | null>(initialPins[0])
  const [addOpen, setAddOpen] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [heatmap, setHeatmap] = useState(false)
  const [year, setYear] = useState(2024)
  const [search, setSearch] = useState('')
  const [zoom, setZoom] = useState(1)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(['The light here at 5pm is still exactly the same.'])

  const visiblePins = useMemo(() => pins.filter(p => p.year <= year && (p.title + p.place + p.theme).toLowerCase().includes(search.toLowerCase())), [pins, year, search])
  const react = (symbol: string) => activePin && setPins(ps => ps.map(p => p.id === activePin.id ? {...p, reactions: {...p.reactions, [symbol]: (p.reactions[symbol] || 0) + 1}} : p))
  const selected = activePin ? pins.find(p => p.id === activePin.id) || activePin : null

  return <div className="app-shell">
    <header className="map-topbar">
      <Brand onClick={() => setView('landing')}/>
      <div className="searchbox"><Icon name="search" size={18}/><input aria-label="Search memories" placeholder="Search places, memories..." value={search} onChange={e => setSearch(e.target.value)}/><kbd>⌘ K</kbd></div>
      <button className={`filter-btn ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="tune" size={17}/> Filters <span>2</span></button>
      <button className="primary add-btn" onClick={() => setAddOpen(true)}><Icon name="plus" size={18}/> Add Pin</button>
      <button className="top-avatar" onClick={() => setView('profile')}>AK</button>
    </header>
    <aside className="left-rail">
      <button className="active" title="Map"><Icon name="map"/></button>
      <button onClick={() => setView('profile')} title="Saved places"><Icon name="bookmark"/></button>
      <button onClick={() => setView('profile')} title="Profile"><Icon name="user"/></button>
      <span></span>
      <button onClick={() => setView('admin')} title="Moderation"><Icon name="flag"/></button>
    </aside>
    <main className="map-canvas">
      <MapArtwork heatmap={heatmap}/>
      {visiblePins.map((pin, index) => zoom < .85 && index < 3 ? (index === 0 && <button key="cluster" className="cluster" style={{left: '47%', top: '46%'}} onClick={() => setZoom(1)}>7<span>memories</span></button>) : <button key={pin.id} className={`map-pin ${selected?.id === pin.id ? 'selected' : ''}`} style={{left: `${pin.x}%`, top: `${pin.y}%`, '--pin': pin.color} as React.CSSProperties} onClick={() => setActivePin(pin)}><span><Icon name="pin" size={18}/></span><i>{pin.title}</i></button>)}
      <div className="map-tools">
        <button onClick={() => setZoom(Math.min(1.2, zoom + .2))}>+</button><button onClick={() => setZoom(Math.max(.6, zoom - .2))}>−</button>
        <button className={heatmap ? 'active' : ''} onClick={() => setHeatmap(!heatmap)} title="Heatmap"><Icon name="flame" size={18}/></button>
        <button title="Map layers"><Icon name="layers" size={18}/></button>
      </div>
      <button className="story-bubble" onClick={() => setStoryOpen(true)}><span><Icon name="sparkle" size={18}/></span><div><b>7 memories overlap here</b><small>View location story</small></div><Icon name="chevron" size={16}/></button>
      <div className="timeline">
        <div className="timeline-head"><span>Timeline</span><b>Up to {year}</b></div>
        <div className="range-wrap"><input type="range" min="2018" max="2024" value={year} onChange={e => setYear(+e.target.value)}/><div className="year-marks"><span>2018</span><span>2020</span><span>2022</span><span>2024</span></div></div>
      </div>
      {filtersOpen && <div className="filter-popover">
        <div><b>Filter memories</b><button onClick={() => setFiltersOpen(false)}><Icon name="close" size={16}/></button></div>
        <label>THEME</label><div className="chips"><button className="on">All</button><button>Friendship</button><button>Campus Life</button><button>History</button></div>
        <label>VISIBILITY</label><div className="check-row"><button className="checked">✓</button> Public memories</div><div className="check-row"><button className="checked">✓</button> Friends only</div>
        <button className="primary apply" onClick={() => setFiltersOpen(false)}>Apply filters</button>
      </div>}
    </main>
    {selected && <aside className="memory-panel">
      <div className="panel-grab"></div>
      <div className="panel-actions"><button onClick={() => setActivePin(null)}><Icon name="close"/></button><div><button><Icon name="bookmark" size={18}/></button><button><Icon name="share" size={18}/></button><button><Icon name="more" size={18}/></button></div></div>
      {selected.photo ? <img className="memory-photo" src={selected.photo} alt="Friends on the library steps"/> : <div className="audio-card"><button><Icon name="play" size={18}/></button><div className="wave">{Array.from({length: 24}).map((_,i) => <i key={i} style={{height: `${8 + (i * 7 % 25)}px`}}></i>)}</div><span>0:42</span></div>}
      <div className="memory-body">
        <div className="memory-meta"><span style={{color:selected.color}}>{selected.theme}</span><i></i><span>{selected.date}</span></div>
        <h2>{selected.title}</h2>
        <div className="place"><Icon name="pin" size={15}/>{selected.place}</div>
        <p className="memory-text">{selected.text}</p>
        <div className="author"><span>{selected.initials}</span><div><b>{selected.author}</b><small>Shared publicly</small></div><button>Follow</button></div>
        <div className="reactions">{Object.entries(selected.reactions).map(([r,n]) => <button key={r} onClick={() => react(r)}>{r} <span>{n}</span></button>)}<button onClick={() => react('♥')}>+</button></div>
        <div className="comments-head"><b>Comments</b><span>{comments.length}</span></div>
        {comments.map((c,i) => <div className="comment" key={i}><span>JL</span><div><b>Jordan Lee <small>2h</small></b><p>{c}</p></div></div>)}
        <form className="comment-form" onSubmit={e => {e.preventDefault(); if(comment.trim()){setComments([...comments, comment]);setComment('')}}}><span>AK</span><input placeholder="Add a memory..." value={comment} onChange={e => setComment(e.target.value)}/><button type="submit">Send</button></form>
      </div>
    </aside>}
    {addOpen && <AddPin onClose={() => setAddOpen(false)} onAdd={(p) => {setPins([...pins, p]); setActivePin(p); setAddOpen(false)}}/>}
    {storyOpen && <StoryPanel close={() => setStoryOpen(false)} pins={pins}/>}
  </div>
}

function AddPin({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Pin) => void }) {
  const [step, setStep] = useState(1)
  const [text, setText] = useState('')
  const [theme, setTheme] = useState('Campus Life')
  const [privacy, setPrivacy] = useState('Public')
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="add-modal" onMouseDown={e => e.stopPropagation()}>
    <div className="modal-head"><div><span>NEW MEMORY</span><h2>Add a pin</h2></div><button onClick={onClose}><Icon name="close"/></button></div>
    <div className="stepper"><span className="done">1</span><i></i><span className={step === 2 ? 'done' : ''}>2</span><p>Choose a place</p><p>Add your memory</p></div>
    {step === 1 ? <div className="location-step">
      <div className="mini-search"><Icon name="search" size={17}/><input defaultValue="Hawthorne Library"/><button><Icon name="close" size={15}/></button></div>
      <div className="location-map"><MapArtwork/><span className="drop-pin"><Icon name="pin"/></span></div>
      <div className="selected-place"><span><Icon name="pin"/></span><div><small>PIN PLACED AT</small><b>Hawthorne Library</b><p>14 University Way · North Campus</p></div><button>Change</button></div>
      <button className="primary wide" onClick={() => setStep(2)}>Continue <Icon name="chevron" size={17}/></button>
    </div> : <div className="details-step">
      <label>YOUR MEMORY</label><textarea placeholder="What happened here? Tell the story..." value={text} onChange={e => setText(e.target.value)} autoFocus/><div className="char-count">{text.length} / 500</div>
      <label>ADD MEDIA <span>OPTIONAL</span></label><div className="uploads"><button><Icon name="upload"/><b>Add a photo</b><small>JPG, PNG up to 10MB</small></button><button><Icon name="play"/><b>Add audio</b><small>MP3, M4A up to 5 min</small></button></div>
      <label>THEME</label><div className="theme-chips">{['Campus Life','Friendship','History'].map(t => <button className={theme === t ? 'active' : ''} onClick={() => setTheme(t)} key={t}>{t}</button>)}</div>
      <label>WHO CAN SEE THIS?</label><div className="privacy">{['Private','Friends','Public'].map(p => <button className={privacy === p ? 'active' : ''} onClick={() => setPrivacy(p)} key={p}><Icon name={p === 'Private' ? 'lock' : p === 'Friends' ? 'user' : 'map'} size={17}/><span><b>{p}</b><small>{p === 'Private' ? 'Only you' : p === 'Friends' ? 'People you follow' : 'Everyone'}</small></span></button>)}</div>
      <div className="modal-foot"><button className="secondary" onClick={() => setStep(1)}><Icon name="back" size={17}/> Back</button><button className="primary" disabled={!text.trim()} onClick={() => onAdd({id:Date.now(),title:'A new campus memory',place:'Hawthorne Library',author:'Alex Kim',initials:'AK',date:'Just now',year:2024,theme,text,x:53,y:52,color:'#f08a68',reactions:{'♥':0}})}><Icon name="pin" size={17}/> Drop pin</button></div>
    </div>}
  </div></div>
}

function StoryPanel({ close, pins }: { close: () => void; pins: Pin[] }) {
  const [loading, setLoading] = useState(false)
  const regenerate = () => { setLoading(true); window.setTimeout(() => setLoading(false), 900) }
  return <div className="story-overlay"><aside className="story-panel">
    <div className="story-head"><button onClick={close}><Icon name="back"/></button><div><span>LOCATION STORY</span><h2>Hawthorne Library Steps</h2></div><button><Icon name="more"/></button></div>
    <div className="story-hero"><img src={campusMemory} alt="Campus friends"/><div></div><span><Icon name="sparkle" size={18}/> AI-WOVEN FROM 7 MEMORIES</span></div>
    <div className="story-content">
      <div className="why"><span><Icon name="sparkle" size={18}/></span><div><small>WHY THIS SPOT MATTERS</small><h3>{loading ? 'Listening to these memories…' : 'Where strangers became a circle'}</h3></div></div>
      <p>For generations of students, these sun-warmed steps have been more than an entrance. They are where study groups turned into friendships, where goodbyes stretched long past sunset, and where the nervous energy of a first week slowly became belonging.</p>
      <blockquote>“Somehow we never opened our textbooks.”<cite>— Maya, Class of ’24</cite></blockquote>
      <p>Across the memories shared here, one thing returns: people came to the library looking for answers, and often found each other instead.</p>
      <button className="regenerate" onClick={regenerate} disabled={loading}><Icon name="sparkle" size={17}/>{loading ? 'Weaving story…' : 'Regenerate summary'}</button>
      <div className="sources-head"><b>Memories in this story</b><span>7 pins</span></div>
      {pins.slice(0,3).map(p => <button className="source-memory" key={p.id}><span style={{background:p.color}}>{p.initials}</span><div><b>{p.title}</b><small>{p.author} · {p.year}</small></div><Icon name="chevron" size={16}/></button>)}
    </div>
  </aside></div>
}

function Profile({ setView }: { setView: (v: View) => void }) {
  const [tab, setTab] = useState('My pins')
  return <div className="page">
    <PageNav setView={setView}/>
    <main className="profile-page">
      <section className="profile-hero"><div className="big-avatar">AK</div><div><div className="profile-name"><h1>Alex Kim</h1><button>Edit profile</button></div><p>Collecting small moments around Northbridge University.</p><span><Icon name="pin" size={15}/> Northbridge · Joined 2021</span></div><div className="profile-stats"><b>18<small>Pins</small></b><b>7<small>Saved places</small></b><b>142<small>Reactions</small></b></div></section>
      <div className="profile-tabs">{['My pins','Saved places','Privacy'].map(t => <button className={tab === t ? 'active' : ''} onClick={() => setTab(t)} key={t}>{t}</button>)}</div>
      {tab === 'Privacy' ? <section className="settings-card"><h2>Privacy settings</h2><p>Control who can see your memories and activity.</p>{['Default pin visibility','Show my profile in search','Allow comments on my pins'].map((x,i) => <div className="setting" key={x}><div><b>{x}</b><small>{i === 0 ? 'Friends' : 'You can change this anytime'}</small></div>{i === 0 ? <button>Friends <Icon name="chevron" size={15}/></button> : <button className="toggle on"><i></i></button>}</div>)}</section> : <section className="pin-grid">{initialPins.slice(0, tab === 'My pins' ? 4 : 3).map((p,i) => <article key={p.id} onClick={() => setView('map')}><div className={`grid-image ${i === 0 ? 'photo' : ''}`} style={i===0 ? {backgroundImage:`url(${campusMemory})`} : {}}><span>{p.theme}</span><button><Icon name="bookmark" size={17}/></button></div><div><small>{p.place} · {p.year}</small><h3>{p.title}</h3><p>{p.text}</p><footer><span>♥ {Object.values(p.reactions)[0]}</span><span><Icon name="comment" size={14}/> {i+2}</span></footer></div></article>)}</section>}
    </main>
  </div>
}

function PageNav({ setView }: { setView: (v: View) => void }) {
  return <header className="page-nav"><Brand onClick={() => setView('landing')}/><nav><button onClick={() => setView('map')}>Map</button><button>Discover</button><button onClick={() => setView('profile')}>My memories</button></nav><div><button className="icon-circle"><Icon name="search" size={18}/></button><button className="primary small" onClick={() => setView('map')}><Icon name="plus" size={16}/> Add pin</button><button className="top-avatar" onClick={() => setView('profile')}>AK</button></div></header>
}

function Admin({ setView }: { setView: (v: View) => void }) {
  const [reports, setReports] = useState([
    {id:1,pin:'Late night at Bell Tower',author:'Jamie W.',reason:'Inappropriate content',reporter:'2 users',date:'12 min ago',status:'Pending'},
    {id:2,pin:'Secret roof access',author:'Chris M.',reason:'Safety concern',reporter:'1 user',date:'2 hours ago',status:'Pending'},
    {id:3,pin:'Old lab story',author:'Morgan P.',reason:'Misinformation',reporter:'3 users',date:'Yesterday',status:'Pending'},
  ])
  const action = (id:number, status:string) => setReports(rs => rs.map(r => r.id === id ? {...r,status} : r))
  return <div className="admin-page">
    <aside className="admin-side"><Brand onClick={() => setView('landing')}/><div><small>WORKSPACE</small><button><Icon name="grid" size={18}/> Overview</button><button className="active"><Icon name="flag" size={18}/> Moderation <span>{reports.filter(r => r.status === 'Pending').length}</span></button><button><Icon name="user" size={18}/> Users</button><button><Icon name="map" size={18}/> All pins</button></div><footer><span>AK</span><div><b>Alex Kim</b><small>Administrator</small></div></footer></aside>
    <main className="admin-main"><header><div><small>ECHO—MAP ADMIN</small><h1>Moderation</h1><p>Review community reports and keep the map safe.</p></div><button onClick={() => setView('map')}>Back to map <Icon name="chevron" size={16}/></button></header>
      <section className="stat-row"><article><span className="coral"><Icon name="pin"/></span><div><small>TOTAL PINS</small><b>2,486</b><em>↑ 12% this month</em></div></article><article><span className="gold"><Icon name="user"/></span><div><small>ACTIVE USERS</small><b>842</b><em>↑ 8% this month</em></div></article><article><span className="red"><Icon name="flag"/></span><div><small>OPEN REPORTS</small><b>{reports.filter(r=>r.status==='Pending').length}</b><em className="urgent">Needs attention</em></div></article></section>
      <section className="reports"><div className="reports-head"><div><h2>Reported pins</h2><p>Review and take action on community reports.</p></div><div className="admin-search"><Icon name="search" size={17}/><input placeholder="Search reports..."/></div></div>
        <div className="table-wrap"><table><thead><tr><th>PIN</th><th>REASON</th><th>REPORTED BY</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>{reports.map(r => <tr key={r.id}><td><b>{r.pin}</b><small>by {r.author}</small></td><td>{r.reason}</td><td>{r.reporter}</td><td>{r.date}</td><td><span className={`status ${r.status.toLowerCase()}`}>{r.status}</span></td><td>{r.status === 'Pending' ? <div className="row-actions"><button onClick={() => action(r.id,'Approved')}>Approve</button><button onClick={() => action(r.id,'Removed')}>Remove</button></div> : <button className="more-btn"><Icon name="more"/></button>}</td></tr>)}</tbody></table></div>
      </section>
    </main>
  </div>
}

export default function App() {
  const [view, setView] = useState<View>('landing')
  return view === 'landing' ? <Landing enter={() => setView('map')}/> : view === 'map' ? <MainMap setView={setView}/> : view === 'profile' ? <Profile setView={setView}/> : <Admin setView={setView}/>
}
