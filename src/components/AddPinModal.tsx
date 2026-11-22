import { useRef, useState } from 'react'
import { useStore } from '../store'
import type { Pin, Visibility } from '../types'
import { Icon } from './Icon'
import { MapSurface } from './MapSurface'

const themeColors: Record<string, string> = { 'Campus Life': '#efb85d', Friendship: '#f08a68', History: '#82a999' }

export function AddPinModal({ onClose, onAdded }: { onClose: () => void; onAdded: (pin: Pin) => void }) {
  const { currentUser, addPin } = useStore()
  const [step, setStep] = useState(1)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [place, setPlace] = useState('Campus location')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [theme, setTheme] = useState('Campus Life')
  const [privacy, setPrivacy] = useState<Visibility>('Public')
  const [photo, setPhoto] = useState<string>()
  const inputRef = useRef<HTMLInputElement>(null)

  const readPhoto = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(String(reader.result))
    reader.readAsDataURL(file)
  }

  const save = () => {
    if (!currentUser || !location || !text.trim()) return
    const pin: Pin = {
      id: crypto.randomUUID(), title: title.trim() || 'A campus memory', place: place.trim() || 'Dropped pin',
      authorId: currentUser.id, author: currentUser.name, initials: currentUser.initials, date: 'Just now',
      year: new Date().getFullYear(), theme, visibility: privacy, text: text.trim(), lat: location.lat, lng: location.lng,
      color: themeColors[theme], photo, reactions: { '♥': 0 }, comments: [],
    }
    addPin(pin)
    onAdded(pin)
  }

  return <div className="modal-backdrop" onMouseDown={onClose}><div className="add-modal" onMouseDown={event => event.stopPropagation()}>
    <div className="modal-head"><div><span>NEW MEMORY</span><h2>Add a pin</h2></div><button onClick={onClose}><Icon name="close"/></button></div>
    <div className="stepper"><span className="done">1</span><i></i><span className={step === 2 ? 'done' : ''}>2</span><p>Choose a place</p><p>Add your memory</p></div>
    {step === 1 ? <div className="location-step">
      <p className="map-instruction"><Icon name="pin" size={16}/> Click anywhere on the map to place your pin.</p>
      <div className="location-map real"><MapSurface onLocationClick={(lat, lng) => setLocation({ lat, lng })} pickedLocation={location}/></div>
      <label className="field-label">PLACE NAME</label>
      <input className="field-input" value={place} onChange={event => setPlace(event.target.value)} placeholder="e.g. Hayden Library steps"/>
      <div className="coordinate-readout">{location ? <><span>LAT {location.lat.toFixed(6)}</span><span>LNG {location.lng.toFixed(6)}</span></> : <span>No location selected yet</span>}</div>
      <button className="primary wide" disabled={!location || !place.trim()} onClick={() => setStep(2)}>Continue <Icon name="chevron" size={17}/></button>
    </div> : <div className="details-step">
      <label>MEMORY TITLE</label><input className="field-input" maxLength={70} placeholder="Give this moment a title" value={title} onChange={event => setTitle(event.target.value)}/>
      <label>YOUR MEMORY</label><textarea maxLength={500} placeholder="What happened here? Tell the story..." value={text} onChange={event => setText(event.target.value)} autoFocus/><div className="char-count">{text.length} / 500</div>
      <label>ADD A PHOTO <span>OPTIONAL</span></label>
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={event => readPhoto(event.target.files?.[0])}/>
      {photo ? <div className="upload-preview"><img src={photo} alt="Upload preview"/><button onClick={() => setPhoto(undefined)}><Icon name="close" size={16}/></button></div> : <button className="photo-upload" onClick={() => inputRef.current?.click()}><Icon name="upload"/><b>Choose a photo</b><small>JPG, PNG or WEBP</small></button>}
      <label>THEME</label><div className="theme-chips">{Object.keys(themeColors).map(item => <button type="button" className={theme === item ? 'active' : ''} onClick={() => setTheme(item)} key={item}>{item}</button>)}</div>
      <label>WHO CAN SEE THIS?</label><div className="privacy">{(['Private','Friends','Public'] as Visibility[]).map(item => <button type="button" className={privacy === item ? 'active' : ''} onClick={() => setPrivacy(item)} key={item}><Icon name={item === 'Private' ? 'lock' : item === 'Friends' ? 'user' : 'map'} size={17}/><span><b>{item}</b><small>{item === 'Private' ? 'Only you' : item === 'Friends' ? 'People you follow' : 'Everyone'}</small></span></button>)}</div>
      <div className="modal-foot"><button className="secondary" onClick={() => setStep(1)}><Icon name="back" size={17}/> Back</button><button className="primary" disabled={!text.trim()} onClick={save}><Icon name="pin" size={17}/> Drop pin</button></div>
    </div>}
  </div></div>
}
