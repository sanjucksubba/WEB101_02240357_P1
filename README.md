https://github.com/sanjucksubba/WEB101_02240357_P1.git

# Airbnb Clone - WEB101 Practical Assignment 1
Student ID: 02240357  
Module: WEB101  
Submission Date: 3rd April, 2026


## What This Project Does
This project recreates the home page of Airbnb listings using React.
This project displays a list of property cards that a user can browse through, similar to the actual Airbnb website.


## Features
- A navbar with a logo, a search bar, and a login button
- A filter bar to browse through property categories like Beach, Mountains, etc.
- A grid of property listing cards with images, locations, prices, and ratings
- A responsive design for mobile, tablet, and desktop screen sizes


## What I Used
- **React** for building the user interface
- **Vite** as a development environment (since Create React App is deprecated)
- **CSS in JavaScript** for styling components with inline styles
- **Unsplash** for getting images for property listings for free


## How To Run The Project
1. Clone this repository
2. Open your terminal and navigate to your project directory.
3. Type `npm install` followed by `npm run dev`
4. Open your browser and navigate to `http://localhost:5173`


## Component Structure
## How Each Component Works

### App.jsx
- This is the main component
- This component imports and renders other components
- Think of it like the main page of a website, holding everything together

### Navbar.jsx
- This component renders the top navbar
- It contains the airbnb logo, search bar, and a login button
- It utilizes `display: flex` and `justifyContent: space-between` to spread items across the navbar

### FilterBar.jsx
- This component renders the row of category filters below the navbar
- It has an array of objects containing information for each filter (id, icon, text)
- It utilizes `.map()` to map through each object and render each filter
- This is more efficient because we wouldn't need to write the same code for each filter

### ListingCard.jsx
- This is arguably the most important component
- It receives information through **props** (image, location, distance, dates, price, rating)
- Props are like variables; the same component can render different information each time it is used
- This component is utilized by ListingGrid


### ListingGrid.jsx
- Has an array of 8 listings as a data source
- Loops through listings using `.map()` and creates a `ListingCard` component for each one
- Utilizes CSS Grid and `auto-fill` to make it responsive without writing mobile, tablet, or desktop-specific code


## What I Learned
- How to divide a webpage into smaller parts using React components
- How to share data between components using props
- How to use `.map()` to generate a list of components based on an array of data
- How to use CSS Grid to make a layout responsive
- How to start a new React app using Vite


## Responsive Design
The app has three screen sizes:
- **Mobile**: 1 column of cards
- **Tablet**: 2 columns of cards  
- **Desktop**: 4 columns of cards

This is achieved by using `auto-fill` and `minmax(250px, 1fr)` in CSS Grid, which automatically adjusts the number of columns based on the size of the screen.


## References
- React Documentation: https://react.dev
- Vite Documentation: https://vitejs.dev
- Airbnb Website: https://airbnb.com (original page used as reference)
- Property Images: https://unsplash.com
