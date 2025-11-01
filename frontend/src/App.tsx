import React from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import ServicesList from './pages/ServicesList'
import ServiceTimestamp from './pages/ServiceTimestamp'
import ServiceRequestHeader from './pages/ServiceRequestHeader'
import ServiceUrlShortener from './pages/ServiceUrlShortener'
import ServiceImageSearch from './pages/ServiceImageSearch'
import ServiceVoting from './pages/ServiceVoting'
import ServiceNightlife from './pages/ServiceNightlife'
import ServiceFileMetadata from './pages/ServiceFileMetadata'
import ServiceStockMarket from './pages/ServiceStockMarket'
import ServiceBookTrading from './pages/ServiceBookTrading'
import ServicePinterest from './pages/ServicePinterest'
import ServiceExerciseTracker from './pages/ServiceExerciseTracker'

export default function App() {
  const nav = useNavigate()

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Microservices Demo</div>
        <div className="nav-buttons">
          <button className="btn" onClick={() => nav('/')}>Home</button>
          <button className="btn" onClick={() => nav('/services')}>Services</button>
        </div>
      </header>

      <main className="main-card">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<ServicesList />} />
          <Route path="/services/timestamp" element={<ServiceTimestamp />} />
          <Route path="/services/request-header" element={<ServiceRequestHeader />} />
          <Route path="/services/url-shortener" element={<ServiceUrlShortener />} />
          <Route path="/services/image-search" element={<ServiceImageSearch />} />
          <Route path="/services/voting" element={<ServiceVoting />} />
          <Route path="/services/nightlife" element={<ServiceNightlife />} />
          <Route path="/services/file-metadata" element={<ServiceFileMetadata />} />
          <Route path="/services/stock-market" element={<ServiceStockMarket />} />
          <Route path="/services/book-trading" element={<ServiceBookTrading />} />
          <Route path="/services/pinterest" element={<ServicePinterest />} />
          <Route path="/services/exercise-tracker" element={<ServiceExerciseTracker />} />
        </Routes>
      </main>
    </div>
  )
}
