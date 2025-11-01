import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function ServicesList() {
  const nav = useNavigate()

  return (
    <div className="page">
      <h1>Available Services</h1>
      <div className="service-grid single-col">
        <div className="service-card">
          <h3>Timestamp Microservice</h3>
          <p>Convert a date string or unix ms into unix and UTC formats.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/timestamp')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Request Header Parser</h3>
          <p>Returns your IP address, language, and software from request headers.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/request-header')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>URL Shortener</h3>
          <p>Create short URLs for any valid website. Enter a URL, get a shortened version that redirects.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/url-shortener')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Image Search</h3>
          <p>Search the bundled image dataset or a configured Bing Image Search API and view recent queries.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/image-search')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>File Metadata</h3>
          <p>Upload a file and get its name, type, and size in bytes.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/file-metadata')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Voting App</h3>
          <p>Create polls, vote, and view results. Share polls with friends.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/voting')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Nightlife Coordination</h3>
          <p>Search bars in your area and mark you are going tonight (Yelp API supported).</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/nightlife')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Stock Market Chart</h3>
          <p>Track stock prices in real-time. Add/remove stocks and see changes across all users via WebSocket.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/stock-market')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Book Trading Club</h3>
          <p>View all books, add your own, update your profile, and propose trades with other members.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/book-trading')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Pinterest Clone</h3>
          <p>Pinterest-style image pinning with GitHub OAuth. Add images, browse in masonry grid, and search via SerpAPI.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/pinterest')}>Open</button>
          </div>
        </div>

        <div className="service-card">
          <h3>Exercise Tracker</h3>
          <p>Create users, add exercises, and view filtered logs (from/to/limit) with toDateString formatted dates.</p>
          <div style={{ marginTop: 8 }}>
            <button className="btn primary full" onClick={() => nav('/services/exercise-tracker')}>Open</button>
          </div>
        </div>
      </div>
    </div>
  )
}
