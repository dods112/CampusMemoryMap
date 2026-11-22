import { useState } from 'react'
import campusMemory from './assets/campus-memory.png'
import { Admin } from './components/Admin'
import { Auth } from './components/Auth'
import { Brand, Icon } from './components/Icon'
import { MapSurface } from './components/MapSurface'
import { MapView } from './components/MapView'
import { Profile } from './components/Profile'
import { StoreProvider, useStore } from './store'
import type { View } from './types'

function Landing({ enter, authenticate }: { enter: () => void; authenticate: (mode: 'login' | 'signup') => void }) {
  const { pins, users, currentUser } = useStore()
  const publicPins = pins.filter(pin => pin.visibility === 'Public')
  const featured = publicPins.find(pin => pin.photo) || publicPins[0]

  return <div className="landing">
    <header className="landing-nav">
      <Brand/>
      <nav><button onClick={enter}>Explore stories</button><button onClick={enter}>How it works</button></nav>
      <div className="auth-actions">{currentUser ? <><button className="text-btn" onClick={() => authenticate('login')}>{currentUser.name}</button><button className="primary small" onClick={enter}>Open map</button></> : <><button className="text-btn" onClick={() => authenticate('login')}>Log in</button><button className="primary small" onClick={() => authenticate('signup')}>Sign up</button></>}</div>
    </header>
    <main className="hero">
      <div className="hero-copy">
        <div className="eyebrow"><span></span>A living archive of place</div>
        <h1>Every place<br/>has a <em>story.</em></h1>
        <p>Pin the moments that shaped you. Discover the memories layered into the places you pass every day.</p>
        <div className="hero-actions"><button className="primary" onClick={enter}>Start your map <Icon name="chevron" size={18}/></button><button className="secondary" onClick={enter}><Icon name="map" size={18}/> Explore nearby</button></div>
        <div className="community"><div className="avatar-stack">{users.slice(0,3).map(user => <span key={user.id}>{user.initials}</span>)}<span>+{Math.max(0,users.length-3)}</span></div><p><b>{pins.length} {pins.length === 1 ? 'memory' : 'memories'}</b><br/>shared by {users.length} {users.length === 1 ? 'person' : 'people'}</p></div>
      </div>
      <div className="hero-map">
        <MapSurface compact pins={publicPins}/>
        {featured && <div className="preview-card">
          <img src={featured.photo || campusMemory} alt={featured.title}/>
          <div><span className="preview-tag">{featured.theme.toUpperCase()} · {featured.year}</span><h3>{featured.title}</h3><p>“{featured.text.slice(0,52)}...”</p><div className="preview-author"><span>{featured.initials}</span> {featured.author} <b>♥ {featured.reactions['♥'] || 0}</b></div></div>
        </div>}
        <div className="floating-note"><Icon name="sparkle" size={17}/><span><b>Location stories</b><small>Woven from nearby memories</small></span></div>
      </div>
    </main>
    <footer className="landing-foot"><span>Scroll to discover</span><div></div><span>Built for the places that stay with us.</span></footer>
  </div>
}

function EchoMapApp() {
  const { currentUser } = useStore()
  const [view, setView] = useState<View>('landing')
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')

  const enter = () => setView(currentUser ? 'map' : 'auth')
  const authenticate = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setView('auth')
  }

  if (view === 'auth') return <Auth mode={authMode} onBack={() => setView('landing')} onDone={() => setView('map')}/>
  if (view === 'map') return currentUser ? <MapView setView={setView}/> : <Auth mode="login" onBack={() => setView('landing')} onDone={() => setView('map')}/>
  if (view === 'profile') return currentUser ? <Profile setView={setView}/> : <Auth mode="login" onBack={() => setView('landing')} onDone={() => setView('profile')}/>
  if (view === 'admin') return <Admin setView={setView}/>
  return <Landing enter={enter} authenticate={authenticate}/>
}

export default function App() {
  return <StoreProvider><EchoMapApp/></StoreProvider>
}
