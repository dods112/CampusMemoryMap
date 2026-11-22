import { useStore } from '../store'
import type { View } from '../types'
import { Brand, Icon } from './Icon'

export function Admin({ setView }: { setView: (view: View) => void }) {
  const { pins, reports, users, currentUser, resolveReport, resetDemo } = useStore()
  if (!currentUser?.isAdmin) return <div className="access-denied"><Icon name="lock" size={30}/><h1>Administrator access only</h1><button className="primary" onClick={() => setView('map')}>Return to map</button></div>
  const openCount = reports.filter(report => report.status === 'Pending').length

  return <div className="admin-page">
    <aside className="admin-side"><Brand onClick={() => setView('landing')}/><div><small>WORKSPACE</small><button><Icon name="grid" size={18}/> Overview</button><button className="active"><Icon name="flag" size={18}/> Moderation <span>{openCount}</span></button><button><Icon name="user" size={18}/> Users</button><button><Icon name="map" size={18}/> All pins</button></div><footer><span>{currentUser.initials}</span><div><b>{currentUser.name}</b><small>Administrator</small></div></footer></aside>
    <main className="admin-main"><header><div><small>ECHO—MAP ADMIN</small><h1>Moderation</h1><p>Review community reports and keep the map safe.</p></div><div className="admin-header-actions"><button className="reset-button" onClick={() => { if (window.confirm('Reset all pins and reports to the original demo data?')) resetDemo() }}>Reset demo data</button><button onClick={() => setView('map')}>Back to map <Icon name="chevron" size={16}/></button></div></header>
      <section className="stat-row"><article><span className="coral"><Icon name="pin"/></span><div><small>TOTAL PINS</small><b>{pins.length}</b><em>Live on the map</em></div></article><article><span className="gold"><Icon name="user"/></span><div><small>REGISTERED USERS</small><b>{users.length}</b><em>Local accounts</em></div></article><article><span className="red"><Icon name="flag"/></span><div><small>OPEN REPORTS</small><b>{openCount}</b><em className="urgent">{openCount ? 'Needs attention' : 'All clear'}</em></div></article></section>
      <section className="reports"><div className="reports-head"><div><h2>Reported pins</h2><p>Approve a pin to keep it, or remove it from the map.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>PIN</th><th>REASON</th><th>REPORTED BY</th><th>DATE</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>
          {reports.length === 0 ? <tr><td colSpan={6}><div className="table-empty"><Icon name="flag" size={22}/>No reports have been submitted.</div></td></tr> : reports.map(report => <tr key={report.id}><td><b>{report.pinTitle}</b><small>by {report.pinAuthor}</small></td><td>{report.reason}</td><td>{report.reporterName}</td><td>{report.createdAt}</td><td><span className={`status ${report.status.toLowerCase()}`}>{report.status}</span></td><td>{report.status === 'Pending' ? <div className="row-actions"><button onClick={() => resolveReport(report.id,'Approved')}>Approve</button><button onClick={() => resolveReport(report.id,'Removed')}>Remove</button></div> : <span className="resolved-label">Resolved</span>}</td></tr>)}
        </tbody></table></div>
      </section>
    </main>
  </div>
}
