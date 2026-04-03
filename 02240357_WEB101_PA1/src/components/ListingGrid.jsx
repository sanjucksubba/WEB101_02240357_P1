// ListingGrid component - displays all listing cards in a grid
// This is the data that feeds into our reusable ListingCard components
import ListingCard from './ListingCard'

const listings = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500',
    location: 'Malibu, California',
    description: 'Beachfront villa',
    dates: 'Mar 1 - 6',
    price: 299,
    rating: 4.9
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500',
    location: 'Bali, Indonesia',
    description: 'Tropical paradise villa',
    dates: 'Mar 5 - 10',
    price: 150,
    rating: 4.8
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=500',
    location: 'Swiss Alps, Switzerland',
    description: 'Cozy mountain cabin',
    dates: 'Mar 8 - 13',
    price: 200,
    rating: 4.7
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=500',
    location: 'Tuscany, Italy',
    description: 'Countryside farmhouse',
    dates: 'Mar 10 - 15',
    price: 175,
    rating: 4.9
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1506974210756-8e1b8985d348?w=500',
    location: 'Santorini, Greece',
    description: 'Cliffside cave house',
    dates: 'Mar 12 - 17',
    price: 320,
    rating: 5.0
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=500',
    location: 'Kyoto, Japan',
    description: 'Traditional japanese home',
    dates: 'Mar 15 - 20',
    price: 180,
    rating: 4.8
  },
  {
    id: 7,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
    location: 'Miami, Florida',
    description: 'Modern luxury villa',
    dates: 'Mar 18 - 23',
    price: 250,
    rating: 4.6
  },
  {
    id: 8,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500',
    location: 'Paris, France',
    description: 'Charming apartment',
    dates: 'Mar 20 - 25',
    price: 190,
    rating: 4.7
  },
]

function ListingGrid() {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '24px',
      padding: '24px 40px'
    }}>
      {/* Loop through listings and render a ListingCard for each one */}
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          image={listing.image}
          location={listing.location}
          description={listing.description}
          dates={listing.dates}
          price={listing.price}
          rating={listing.rating}
        />
      ))}
    </div>
  )
}

export default ListingGrid