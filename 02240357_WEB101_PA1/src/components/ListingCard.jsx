// ListingCard component - reusable card for each property listing
// It receives data through props so it can be reused for any listing
function ListingCard({ image, location, description, dates, price, rating }) {
  return (
    <div style={{
      borderRadius: '12px',
      overflow: 'hidden',
      cursor: 'pointer',
      position: 'relative'
    }}>

      {/* Property Image */}
      <div style={{ position: 'relative' }}>
        <img
          src={image}
          alt={location}
          style={{
            width: '100%',
            height: '250px',
            objectFit: 'cover',
            borderRadius: '12px'
          }}
        />
        {/* Wishlist Heart Button */}
        <span style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          fontSize: '24px',
          cursor: 'pointer'
        }}>🤍</span>
      </div>

      {/* Card Details */}
      <div style={{ padding: '8px 0' }}>

        {/* Location and Rating on same line */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{
            fontSize: '15px',
            fontWeight: '600',
            margin: 0
          }}>{location}</h3>
          <span style={{ fontSize: '14px' }}>⭐ {rating}</span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: '#717171',
          margin: '2px 0'
        }}>{description}</p>

        {/* Dates */}
        <p style={{
          fontSize: '14px',
          color: '#717171',
          margin: '2px 0'
        }}>{dates}</p>

        {/* Price */}
        <p style={{
          fontSize: '15px',
          fontWeight: '600',
          margin: '4px 0'
        }}>${price} <span style={{
          fontWeight: '400'
        }}>night</span></p>

      </div>
    </div>
  )
}

export default ListingCard