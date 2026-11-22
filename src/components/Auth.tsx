import { useState } from 'react'
import { useStore } from '../store'
import { Brand, Icon } from './Icon'

export function Auth({ mode, onDone, onBack }: { mode: 'login' | 'signup'; onDone: () => void; onBack: () => void }) {
  const { login } = useStore()
  const [name, setName] = useState(mode === 'login' ? 'Alex Kim' : '')
  const [email, setEmail] = useState(mode === 'login' ? 'admin@echo-map.demo' : '')
  const [error, setError] = useState('')

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim() || !email.includes('@')) {
      setError('Enter your name and a valid email address.')
      return
    }
    login(name, email, mode === 'signup')
    onDone()
  }

  return <div className="auth-page">
    <header><Brand onClick={onBack}/></header>
    <main className="auth-card">
      <button className="auth-back" onClick={onBack}><Icon name="back" size={17}/> Back</button>
      <span className="auth-kicker">{mode === 'login' ? 'WELCOME BACK' : 'JOIN THE ARCHIVE'}</span>
      <h1>{mode === 'login' ? 'Return to your map.' : 'Start mapping your memories.'}</h1>
      <p>{mode === 'login' ? 'Your places and stories are waiting.' : 'Every memory adds another layer to the places we share.'}</p>
      <form onSubmit={submit}>
        <label>YOUR NAME</label><input value={name} onChange={event => setName(event.target.value)} placeholder="Alex Kim"/>
        <label>EMAIL ADDRESS</label><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com"/>
        {error && <div className="auth-error">{error}</div>}
        <button className="primary" type="submit">{mode === 'login' ? 'Log in' : 'Create account'} <Icon name="chevron" size={17}/></button>
      </form>
      {mode === 'login' && <div className="demo-hint"><b>Demo administrator</b><span>Use admin@echo-map.demo to access moderation.</span></div>}
    </main>
  </div>
}
