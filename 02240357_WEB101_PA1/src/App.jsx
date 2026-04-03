// Main App - brings all components together
import Navbar from './components/Navbar'
import FilterBar from './components/FilterBar'
import ListingGrid from './components/ListingGrid'

function App() {
  return (
    <div>
      <Navbar />
      <FilterBar />
      <ListingGrid />
    </div>
  )
}

export default App