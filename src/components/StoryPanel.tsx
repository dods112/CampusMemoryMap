import { useEffect, useMemo, useState } from 'react'
import type { Pin } from '../types'
import { Icon } from './Icon'

export const distanceInMeters = (a: Pin, b: Pin) => {
  const radius = 6371e3
  const p1 = a.lat * Math.PI / 180
  const p2 = b.lat * Math.PI / 180
  const dp = (b.lat - a.lat) * Math.PI / 180
  const dl = (b.lng - a.lng) * Math.PI / 180
  const value = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2
  return radius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value))
}

export function nearbyPins(anchor: Pin, pins: Pin[]) {
  return pins.filter(pin => distanceInMeters(anchor, pin) <= 100)
}

export function generateLocationStory(pins: Pin[]) {
  if (pins.length < 3) return null
  const themes = [...new Set(pins.map(pin => pin.theme.toLowerCase()))]
  const place = pins[0].place
  const years = pins.map(pin => pin.year).sort()
  const quotePin = [...pins].sort((a, b) => b.text.length - a.text.length)[0]
  const quote = quotePin.text.length > 115 ? `${quotePin.text.slice(0, 112).trim()}…` : quotePin.text
  return {
    title: themes.length > 1 ? `Where ${themes[0]} meets ${themes[1]}` : `A place shaped by ${themes[0]}`,
    summary: `${place} holds ${pins.length} connected memories spanning ${years[0]} to ${years[years.length - 1]}. Together, they recall ${pins.map(pin => pin.title.toLowerCase()).slice(0, 3).join(', ')}—small moments that turned a familiar campus corner into a place of belonging.`,
    quote,
    quoteAuthor: quotePin.author,
  }
}

export function StoryPanel({ close, anchor, pins }: { close: () => void; anchor: Pin; pins: Pin[] }) {
  const sources = useMemo(() => nearbyPins(anchor, pins), [anchor, pins])
  const [story, setStory] = useState(() => generateLocationStory(sources))
  const [loading, setLoading] = useState(false)

  useEffect(() => setStory(generateLocationStory(sources)), [sources])

  const regenerate = () => {
    setLoading(true)
    window.setTimeout(() => {
      setStory(generateLocationStory(sources))
      setLoading(false)
    }, 850)
  }

  return <div className="story-overlay"><aside className="story-panel">
    <div className="story-head"><button onClick={close}><Icon name="back"/></button><div><span>LOCATION STORY</span><h2>{anchor.place}</h2></div><button><Icon name="more"/></button></div>
    {anchor.photo && <div className="story-hero"><img src={anchor.photo} alt="Memory at this location"/><div></div><span><Icon name="sparkle" size={18}/> WOVEN FROM {sources.length} MEMORIES</span></div>}
    <div className="story-content">
      {sources.length < 3 ? <div className="story-empty"><span><Icon name="sparkle" size={24}/></span><h3>Not enough memories yet to weave a story.</h3><p>Three nearby memories are needed. Add another pin within 100 metres of this spot.</p></div> : <>
        <div className="why"><span><Icon name="sparkle" size={18}/></span><div><small>WHY THIS SPOT MATTERS</small><h3>{loading ? 'Listening to these memories…' : story?.title}</h3></div></div>
        <p className={loading ? 'story-loading' : ''}>{story?.summary}</p>
        <blockquote>“{story?.quote}”<cite>— {story?.quoteAuthor}</cite></blockquote>
        <button className="regenerate" onClick={regenerate} disabled={loading}><Icon name="sparkle" size={17}/>{loading ? 'Weaving story…' : 'Regenerate summary'}</button>
      </>}
      <div className="sources-head"><b>Memories in this story</b><span>{sources.length} {sources.length === 1 ? 'pin' : 'pins'}</span></div>
      {sources.map(pin => <div className="source-memory" key={pin.id}><span style={{background:pin.color}}>{pin.initials}</span><div><b>{pin.title}</b><small>{pin.author} · {pin.year}</small></div></div>)}
    </div>
  </aside></div>
}
