import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import campusMemory from './assets/campus-memory.png'
import type { Comment, Pin, Report, User } from './types'

const STORAGE_KEY = 'echo-map-store-v2'

export const CAMPUS_CENTER: [number, number] = [42.35945, -71.09225]

const users: User[] = [
  { id: 'admin', name: 'Alex Kim', email: 'admin@echo-map.demo', initials: 'AK', isAdmin: true },
  { id: 'maya', name: 'Maya Chen', email: 'maya@echo-map.demo', initials: 'MC', isAdmin: false },
]

const seedComments: Comment[] = [
  { id: 'c1', authorId: 'maya', author: 'Maya Chen', initials: 'MC', text: 'The light here at 5pm is still exactly the same.', createdAt: '2h ago' },
]

export const demoPins: Pin[] = [
  {
    id: 'p1', title: 'The library steps', place: 'Hayden Library steps', authorId: 'maya', author: 'Maya Chen', initials: 'MC',
    date: 'September 14, 2023', year: 2023, theme: 'Friendship', visibility: 'Public', color: '#f08a68',
    lat: 42.35878, lng: -71.08988, text: 'We met here every Friday after class. Someone always brought coffee, and somehow we never opened our textbooks.',
    photo: campusMemory, reactions: { '♥': 24, '✦': 8, '☻': 5 }, comments: seedComments,
  },
  {
    id: 'p2', title: 'Midnight study break', place: 'Hayden Library steps', authorId: 'admin', author: 'Alex Kim', initials: 'AK',
    date: 'April 22, 2022', year: 2022, theme: 'Campus Life', visibility: 'Friends', color: '#efb85d',
    lat: 42.35894, lng: -71.08961, text: 'At midnight we gave up on problem sets, shared a bag of oranges, and watched the whole courtyard go quiet.',
    audio: true, reactions: { '♥': 17, '✦': 3 }, comments: [],
  },
  {
    id: 'p3', title: 'Last day, first promise', place: 'Hayden Library steps', authorId: 'admin', author: 'Alex Kim', initials: 'AK',
    date: 'May 27, 2021', year: 2021, theme: 'Friendship', visibility: 'Public', color: '#f08a68',
    lat: 42.35858, lng: -71.08993, text: 'We promised to meet on these steps every reunion weekend, no matter how far away life carried us.',
    reactions: { '♥': 31, '✦': 6 }, comments: [],
  },
  {
    id: 'p4', title: 'A quiet protest', place: 'Killian Court', authorId: 'maya', author: 'Maya Chen', initials: 'MC',
    date: 'October 8, 2019', year: 2019, theme: 'History', visibility: 'Public', color: '#82a999',
    lat: 42.35924, lng: -71.09214, text: 'By noon, the whole lawn was filled with handmade signs. It felt like the campus found its voice at once.',
    reactions: { '♥': 32, '✦': 11 }, comments: [],
  },
  {
    id: 'p5', title: 'First snow, no classes', place: 'Kresge Oval', authorId: 'admin', author: 'Alex Kim', initials: 'AK',
    date: 'January 18, 2020', year: 2020, theme: 'Campus Life', visibility: 'Public', color: '#efb85d',
    lat: 42.35809, lng: -71.09563, text: 'The cancellation email arrived and within minutes the lawn became a snowball arena.',
    reactions: { '♥': 19, '☻': 12 }, comments: [],
  },
  {
    id: 'p6', title: 'The long goodbye', place: 'Massachusetts Avenue gate', authorId: 'maya', author: 'Maya Chen', initials: 'MC',
    date: 'May 29, 2018', year: 2018, theme: 'Friendship', visibility: 'Private', color: '#f08a68',
    lat: 42.35999, lng: -71.09486, text: 'We promised we would all be back in a year. It took three, but we kept the promise.',
    reactions: { '♥': 42, '✦': 6 }, comments: [],
  },
]

type StoreState = {
  pins: Pin[]
  reports: Report[]
  users: User[]
  currentUser: User | null
}

type Store = StoreState & {
  login: (name: string, email: string, signup: boolean) => User
  logout: () => void
  addPin: (pin: Pin) => void
  deletePin: (id: string) => void
  addComment: (pinId: string, text: string) => void
  react: (pinId: string, symbol: string) => void
  addReport: (pinId: string, reason: string) => void
  resolveReport: (id: string, status: 'Approved' | 'Removed') => void
  resetDemo: () => void
}

const initialState: StoreState = { pins: demoPins, reports: [], users, currentUser: null }
const StoreContext = createContext<Store | null>(null)

function readState(): StoreState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...initialState, ...JSON.parse(saved) } : initialState
  } catch {
    return initialState
  }
}

const initialsFor = (name: string) => name.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(readState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const store = useMemo<Store>(() => ({
    ...state,
    login(name, email, signup) {
      const normalized = email.trim().toLowerCase()
      let user = state.users.find(item => item.email.toLowerCase() === normalized)
      if (!user) {
        user = { id: crypto.randomUUID(), name: name.trim(), email: normalized, initials: initialsFor(name), isAdmin: normalized === 'admin@echo-map.demo' }
        setState(current => ({ ...current, users: [...current.users, user!], currentUser: user! }))
      } else {
        setState(current => ({ ...current, currentUser: user! }))
      }
      if (signup && user.name !== name.trim()) {
        user = { ...user, name: name.trim(), initials: initialsFor(name) }
        const updated = user
        setState(current => ({ ...current, users: current.users.map(item => item.id === updated.id ? updated : item), currentUser: updated }))
      }
      return user
    },
    logout() {
      setState(current => ({ ...current, currentUser: null }))
    },
    addPin(pin) {
      setState(current => ({ ...current, pins: [...current.pins, pin] }))
    },
    deletePin(id) {
      setState(current => ({ ...current, pins: current.pins.filter(pin => pin.id !== id) }))
    },
    addComment(pinId, text) {
      if (!state.currentUser) return
      const comment: Comment = { id: crypto.randomUUID(), authorId: state.currentUser.id, author: state.currentUser.name, initials: state.currentUser.initials, text, createdAt: 'Just now' }
      setState(current => ({ ...current, pins: current.pins.map(pin => pin.id === pinId ? { ...pin, comments: [...pin.comments, comment] } : pin) }))
    },
    react(pinId, symbol) {
      setState(current => ({ ...current, pins: current.pins.map(pin => pin.id === pinId ? { ...pin, reactions: { ...pin.reactions, [symbol]: (pin.reactions[symbol] || 0) + 1 } } : pin) }))
    },
    addReport(pinId, reason) {
      if (!state.currentUser) return
      const pin = state.pins.find(item => item.id === pinId)
      if (!pin) return
      const report: Report = { id: crypto.randomUUID(), pinId, pinTitle: pin.title, pinAuthor: pin.author, reason, reporterId: state.currentUser.id, reporterName: state.currentUser.name, createdAt: 'Just now', status: 'Pending' }
      setState(current => ({ ...current, reports: [report, ...current.reports] }))
    },
    resolveReport(id, status) {
      setState(current => {
        const report = current.reports.find(item => item.id === id)
        return {
          ...current,
          reports: current.reports.map(item => item.id === id ? { ...item, status } : item),
          pins: status === 'Removed' && report ? current.pins.filter(pin => pin.id !== report.pinId) : current.pins,
        }
      })
    },
    resetDemo() {
      setState(current => ({ ...initialState, users: current.users, currentUser: current.currentUser, pins: demoPins.map(pin => ({ ...pin, comments: [...pin.comments], reactions: { ...pin.reactions } })) }))
    },
  }), [state])

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
}

export function useStore() {
  const store = useContext(StoreContext)
  if (!store) throw new Error('useStore must be used inside StoreProvider')
  return store
}
