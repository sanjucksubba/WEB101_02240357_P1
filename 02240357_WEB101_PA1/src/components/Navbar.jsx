// Navbar component - shows logo, search bar and login button
function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 40px',
      borderBottom: '1px solid #ddd',
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 100
    }}>
      {/* Logo */}
      <h1 style={{ color: '#FF385C', fontSize: '24px' }}>airbnb</h1>

      {/* Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ddd',
        borderRadius: '40px',
        padding: '8px 16px',
        gap: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <span>Anywhere</span>
        <span style={{ color: '#ddd' }}>|</span>
        <span>Any week</span>
        <span style={{ color: '#ddd' }}>|</span>
        <span style={{ color: '#888' }}>Add guests</span>
        <button style={{
          backgroundColor: '#FF385C',
          border: 'none',
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px'
        }}>🔍</button>
      </div>

      {/* Login Button */}
      <button style={{
        border: '1px solid #ddd',
        borderRadius: '40px',
        padding: '8px 16px',
        backgroundColor: 'white',
        cursor: 'pointer',
        fontSize: '14px'
      }}>
        Login
      </button>
    </nav>
  )
}

export default Navbar