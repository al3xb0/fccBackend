import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function Home() {
  const nav = useNavigate()

  return (
    <div className="page">
      <h1>Welcome</h1>
      <p>This workspace hosts several microservices. Use the menu to navigate to a service demo.</p>
      <div style={{ marginTop: 12 }}>
        <button className="btn primary full" onClick={() => nav('/services')}>View services</button>
      </div>
    </div>
  )
}
