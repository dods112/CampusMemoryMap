import { useMemo, useState } from 'react'
import { useStore } from '../store'
import type { Pin, View, Visibility } from '../types'
import { AddPinModal } from './AddPinModal'
import { Brand, Icon } from './Icon'
import { MapSurface } from './MapSurface'
import { nearbyPins, StoryPanel } from './StoryPanel'

const themes = ['Friendship', 'Campus Life', 'History']
const visibilities: Visibility[] = ['Public', 'Friends', 'Private']

export function MapView({ setView }: { setView: (view: View) => void }) {
  const { pins, currentUser, addComment, react, addReport } = useStore()
  const currentYear = new Date().getFullYear()
  const [activeId, setActiveId] = useState<string | null>(pins[0]?.id || null)
  const [addOpen, setAddOpen] = useState(false)
  const [storyOpen, setStoryOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [heatmap, setHeatmap] = useState(false)
  const [year, setYear] = useState(currentYear)
  const [search, setSearch] = useState('')
  const [selectedThemes, setSelectedThemes] = useState<string[]>([])
  const [selectedVisibility, setSelectedVisibility] = useState<Visibility[]>(visibilities)
  const [comment, setComment] = useState('')
  const [reportOpen, setReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState('Inappropriate content')
  const [reported, setReported] = useState(false)

  const activePin = pins.find(pin => pin.id === activeId) || null
  const visiblePins = useMemo(() => pins.filter(pin => {
    const allowed = pin.visibility !== 'Private' || pin.authorId === currentUser?.id
    const query = `${pin.title} ${pin.place} ${pin.theme} ${pin.text}`.toLowerCase()
    return allowed && pin.year <= year && query.includes(search.toLowerCase()) &&
      (selectedThemes.length === 0 || selectedThemes.includes(pin.theme)) &&
      selectedVisibility.includes(pin.visibility)
  }), [pins, currentUser, year, search, selectedThemes, selectedVisibility])

  const nearby = activePin ? nearbyPins(activePin, pins.filter(pin => pin.visibility !== 'Private' || pin.authorId === currentUser?.id)) : []
  const filterCount = selectedThemes.length + (selectedVisibility.length === visibilities.length ? 0 : 1)
  const toggleTheme = (theme: string) => setSelectedThemes(current => current.includes(theme) ? current.filter(item => item !== theme) : [...current, theme])
  const toggleVisibility = (visibility: Visibility) => setSelectedVisibility(current => current.includes(visibility) ? current.filter(item => item !== visibility) : [...current, visibility])

  const submitComment = (event: React.FormEvent) => {
    event.preventDefault()
    if (!activePin || !comment.trim()) return
    addComment(activePin.id, comment.trim())
    setComment('')
  }

  return <div className="app-shell">
    <header className="map-topbar">
      <Brand onClick={() => setView('landing')}/>
      <div className="searchbox"><Icon name="search" size={18}/><input aria-label="Search memories" placeholder="Search places, memories..." value={search} onChange={event => setSearch(event.target.value)}/><kbd>⌘ K</kbd></div>
      <button className={`filter-btn ${filtersOpen ? 'active' : ''}`} onClick={() => setFiltersOpen(!filtersOpen)}><Icon name="tune" size={17}/> Filters {filterCount > 0 && <span>{filterCount}</span>}</button>
      <button className="primary add-btn" onClick={() => setAddOpen(true)}><Icon name="plus" size={18}/> Add Pin</button>
      <button className="top-avatar" onClick={() => setView('profile')}>{currentUser?.initials}</button>
    </header>
    <aside className="left-rail">
      <button className="active" title="Map"><Icon name="map"/></button>
      <button onClick={() => setView('profile')} title="Saved places"><Icon name="bookmark"/></button>
      <button onClick={() => setView('profile')} title="Profile"><Icon name="user"/></button>
      <span></span>
      {currentUser?.isAdmin && <button onClick={() => setView('admin')} title="Moderation"><Icon name="flag"/></button>}
    </aside>
    <main className="map-canvas">
      <MapSurface pins={visiblePins} onSelect={pin => { setActiveId(pin.id); setReportOpen(false); setReported(false) }} heatmap={heatmap}/>
      <button className={`heatmap-toggle ${heatmap ? 'active' : ''}`} onClick={() => setHeatmap(!heatmap)}><Icon name="flame" size={17}/>{heatmap ? 'Heatmap on' : 'Heatmap'}</button>
      {visiblePins.length === 0 && <div className="map-empty"><Icon name="search" size={26}/><h3>No memories found</h3><p>Try changing your search, year, theme, or visibility filters.</p><button onClick={() => {setSearch('');setSelectedThemes([]);setSelectedVisibility(visibilities);setYear(currentYear)}}>Clear all filters</button></div>}
      {activePin && <button className="story-bubble" onClick={() => setStoryOpen(true)}><span><Icon name="sparkle" size={18}/></span><div><b>{nearby.length} {nearby.length === 1 ? 'memory' : 'memories'} near this spot</b><small>{nearby.length >= 3 ? 'View location story' : 'More memories are needed'}</small></div><Icon name="chevron" size={16}/></button>}
      <div className="timeline"><div className="timeline-head"><span>Timeline</span><b>Up to {year}</b></div><div className="range-wrap"><input type="range" min="2018" max={currentYear} value={year} onChange={event => setYear(+event.target.value)}/><div className="year-marks"><span>2018</span><span>2020</span><span>2022</span><span>{currentYear}</span></div></div></div>
      {filtersOpen && <div className="filter-popover">
        <div><b>Filter memories</b><button onClick={() => setFiltersOpen(false)}><Icon name="close" size={16}/></button></div>
        <label>THEME · SELECT MULTIPLE</label><div className="chips"><button className={selectedThemes.length === 0 ? 'on' : ''} onClick={() => setSelectedThemes([])}>All</button>{themes.map(theme => <button className={selectedThemes.includes(theme) ? 'on' : ''} onClick={() => toggleTheme(theme)} key={theme}>{theme}</button>)}</div>
        <label>VISIBILITY</label>{visibilities.map(visibility => <div className="check-row" key={visibility}><button className={selectedVisibility.includes(visibility) ? 'checked' : ''} onClick={() => toggleVisibility(visibility)}>{selectedVisibility.includes(visibility) ? '✓' : ''}</button>{visibility} memories</div>)}
        <button className="primary apply" onClick={() => setFiltersOpen(false)}>Show {visiblePins.length} {visiblePins.length === 1 ? 'memory' : 'memories'}</button>
      </div>}
    </main>
    {activePin && <aside className="memory-panel">
      <div className="panel-grab"></div><div className="panel-actions"><button onClick={() => setActiveId(null)}><Icon name="close"/></button><div><button><Icon name="bookmark" size={18}/></button><button><Icon name="share" size={18}/></button><button className={reportOpen ? 'active' : ''} onClick={() => setReportOpen(!reportOpen)}><Icon name="more" size={18}/></button></div></div>
      {reportOpen && <div className="report-menu"><b>Report this memory</b><select value={reportReason} onChange={event => setReportReason(event.target.value)}><option>Inappropriate content</option><option>Safety concern</option><option>Misinformation</option><option>Privacy concern</option><option>Spam</option></select><button className="primary" disabled={reported} onClick={() => {addReport(activePin.id,reportReason);setReported(true)}}>{reported ? 'Report submitted' : 'Submit report'}</button></div>}
      {activePin.photo ? <img className="memory-photo" src={activePin.photo} alt={activePin.title}/> : activePin.audio ? <div className="audio-card"><button><Icon name="play" size={18}/></button><div className="wave">{Array.from({length:24}).map((_,index) => <i key={index} style={{height:`${8 + (index * 7 % 25)}px`}}></i>)}</div><span>0:42</span></div> : <div className="memory-placeholder"><Icon name="pin" size={30}/><span>{activePin.place}</span></div>}
      <div className="memory-body">
        <div className="memory-meta"><span style={{color:activePin.color}}>{activePin.theme}</span><i></i><span>{activePin.date}</span><i></i><span>{activePin.visibility}</span></div>
        <h2>{activePin.title}</h2><div className="place"><Icon name="pin" size={15}/>{activePin.place} · {activePin.lat.toFixed(4)}, {activePin.lng.toFixed(4)}</div>
        <p className="memory-text">{activePin.text}</p>
        <div className="author"><span>{activePin.initials}</span><div><b>{activePin.author}</b><small>Shared {activePin.visibility.toLowerCase()}</small></div><button>Follow</button></div>
        <div className="reactions">{Object.entries(activePin.reactions).map(([symbol,count]) => <button key={symbol} onClick={() => react(activePin.id,symbol)}>{symbol} <span>{count}</span></button>)}<button onClick={() => react(activePin.id,'♥')}>+</button></div>
        <div className="comments-head"><b>Comments</b><span>{activePin.comments.length}</span></div>
        {activePin.comments.map(item => <div className="comment" key={item.id}><span>{item.initials}</span><div><b>{item.author} <small>{item.createdAt}</small></b><p>{item.text}</p></div></div>)}
        {activePin.comments.length === 0 && <p className="no-comments">No comments yet. Add the first one.</p>}
        <form className="comment-form" onSubmit={submitComment}><span>{currentUser?.initials}</span><input maxLength={240} placeholder="Add a comment..." value={comment} onChange={event => setComment(event.target.value)}/><button type="submit">Send</button></form>
      </div>
    </aside>}
    {addOpen && <AddPinModal onClose={() => setAddOpen(false)} onAdded={pin => {setActiveId(pin.id);setAddOpen(false)}}/>}
    {storyOpen && activePin && <StoryPanel close={() => setStoryOpen(false)} anchor={activePin} pins={pins}/>}
  </div>
}
