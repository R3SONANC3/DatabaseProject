import React from 'react'
import { Link } from 'react-router-dom'
import '../styles.css'

function NotFound() {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2 className="not-found-subtitle">Page Not Found</h2>
        <p className="not-found-description">Sorry, we couldn't find the page you're looking for.</p>
        <Link to="/" className="not-found-button">Back to Home</Link>
      </div>
    </div>
  )
}

export default NotFound