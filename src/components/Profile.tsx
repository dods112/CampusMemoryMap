import { useState } from 'react'
import { useStore } from '../store'
import type { View } from '../types'
import { Brand, Icon } from './Icon'

function PageNav({ setView }: { setView: (view: View) => void }) {
  const { currentUser, logout } = useStore()
  return <header className="page-nav"><Brand onClick={() => setView('landing')}/><nav><button onClick={() => setView('map')}>Map</button><button onClick={() => setView('profile')}>My memories</button>{currentUser?.isAdmin && <button onClick={() => setView('admin')}>Moderation</button>}</nav><div><button className="primary small" onClick={() => setView('map')}><Icon name="plus" size={16}/> Add pin</button><button className="top-avatar">{currentUser?.initials}</button><button className="logout-link" onClick={() => { logout(); setView('landing') }}>Log out</button></div></header>
}

export function Profile({ setView }: { setView: (view: View) => void }) {
  const { pins, currentUser } = useStore()
  const [tab, setTab] = useState<'My pins' | 'Saved places' | 'Privacy'>('My pins')
  const ownPins = pins.filter(pin => pin.authorId === currentUser?.id)
  const reactionCount = ownPins.reduce((sum, pin) => sum + Object.values(pin.reactions).reduce((total, value) => total + value, 0), 0)
  if (!currentUser) return null

  return <div className="page">
    <PageNav setView={setView}/>
    <main className="profile-page">
      <section className="profile-hero"><div className="big-avatar">{currentUser.initials}</div><div><div className="profile-name"><h1>{currentUser.name}</h1><button>Edit profile</button></div><p>Collecting small moments around campus.</p><span><Icon name="pin" size={15}/> Cambridge · Local memory keeper</span></div><div className="profile-stats"><b>{ownPins.length}<small>Pins</small></b><b>0<small>Saved places</small></b><b>{reactionCount}<small>Reactions</small></b></div></section>
      <div className="profile-tabs">{(['My pins','Saved places','Privacy'] as const).map(item => <button className={tab === item ? 'active' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
      {tab === 'Privacy' ? <section className="settings-card"><h2>Privacy settings</h2><p>Control who can see your memories and activity.</p>{['Default pin visibility','Show my profile in search','Allow comments on my pins'].map((item,index) => <div className="setting" key={item}><div><b>{item}</b><small>{index === 0 ? 'Public' : 'You can change this anytime'}</small></div>{index === 0 ? <button>Public <Icon name="chevron" size={15}/></button> : <button className="toggle on"><i></i></button>}</div>)}</section>
      : tab === 'Saved places' || ownPins.length === 0 ? <div className="profile-empty"><Icon name="bookmark" size={28}/><h2>{tab === 'Saved places' ? 'No saved places yet' : 'Your map is waiting'}</h2><p>{tab === 'Saved places' ? 'Save places from the map to find them here.' : 'Drop your first pin to begin your personal archive.'}</p><button className="primary" onClick={() => setView('map')}>Explore the map</button></div>
      : <section className="pin-grid">{ownPins.map(pin => <article key={pin.id} onClick={() => setView('map')}><div className={`grid-image ${pin.photo ? 'photo' : ''}`} style={pin.photo ? {backgroundImage:`url(${pin.photo})`} : {}}><span>{pin.theme}</span><button><Icon name="bookmark" size={17}/></button></div><div><small>{pin.place} · {pin.year}</small><h3>{pin.title}</h3><p>{pin.text}</p><footer><span>♥ {pin.reactions['♥'] || 0}</span><span><Icon name="comment" size={14}/> {pin.comments.length}</span><span>{pin.visibility}</span></footer></div></article>)}</section>}
    </main>
  </div>
}
