// FilterBar component - shows category filters like beach, mountains etc
// Data for filter categories
const filters = [
  { id: 1, icon: '🏖️', label: 'Beach' },
  { id: 2, icon: '🏔️', label: 'Mountains' },
  { id: 3, icon: '🏕️', label: 'Camping' },
  { id: 4, icon: '🏡', label: 'Countryside' },
  { id: 5, icon: '🏊', label: 'Pools' },
  { id: 6, icon: '🌊', label: 'Surfing' },
  { id: 7, icon: '❄️', label: 'Arctic' },
  { id: 8, icon: '🏯', label: 'Castles' },
  { id: 9, icon: '⛺', label: 'Camping' },
  { id: 10, icon: '🌴', label: 'Tropical' },
]

function FilterBar() {
  return (
    <div style={{
      display: 'flex',
      gap: '32px',
      padding: '16px 40px',
      borderBottom: '1px solid #ddd',
      overflowX: 'auto',
      backgroundColor: 'white'
    }}>
      {/* Loop through filters and display each one */}
      {filters.map((filter) => (
        <div key={filter.id} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          minWidth: 'fit-content',
          padding: '8px',
          borderBottom: '2px solid transparent',
        }}
        onMouseEnter={e => e.currentTarget.style.borderBottom = '2px solid black'}
        onMouseLeave={e => e.currentTarget.style.borderBottom = '2px solid transparent'}
        >
          <span style={{ fontSize: '24px' }}>{filter.icon}</span>
          <span style={{ fontSize: '12px', fontWeight: '500' }}>{filter.label}</span>
        </div>
      ))}
    </div>
  )
}

export default FilterBar