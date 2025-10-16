// Interactive Map Management
class WorldMap {
    constructor() {
        this.map = null;
        this.countries = new Map();
        this.selectedCountry = null;
        this.init();
    }

    async init() {
        try {
            // Initialize Leaflet map
            this.map = L.map('world-map').setView(CONFIG.MAP_CENTER, CONFIG.MAP_ZOOM);

            // Add beautiful tile layer
            L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
                attribution: '©OpenStreetMap, ©CartoDB',
                maxZoom: 18
            }).addTo(this.map);

            // Load countries data and add to map
            await this.loadCountries();
            
            // Add custom styling
            this.addMapStyles();
            
        } catch (error) {
            console.error('Failed to initialize map:', error);
            this.showMapError();
        }
    }

    async loadCountries() {
        try {
            // Load countries with book data from API
            const countriesData = await apiService.getCountries();
            
            // Load world countries GeoJSON (simplified version)
            const worldCountries = await this.loadWorldGeoJSON();
            
            // Match API countries with GeoJSON and add to map
            worldCountries.features.forEach(feature => {
                const countryCode = feature.properties.ISO_A2;
                const apiCountry = countriesData.countries.find(c => c.code === countryCode);
                
                if (apiCountry && apiCountry.book_count > 0) {
                    this.addCountryToMap(feature, apiCountry);
                }
            });
            
        } catch (error) {
            console.error('Failed to load countries:', error);
            showToast('Failed to load country data', 'error');
        }
    }

    async loadWorldGeoJSON() {
        // For a real implementation, you would load a proper world countries GeoJSON file
        // For this demo, we'll create simplified country data
        return {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    properties: { ISO_A2: 'US', NAME: 'United States' },
                    geometry: { type: 'Polygon', coordinates: [[[-125, 25], [-65, 25], [-65, 50], [-125, 50], [-125, 25]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'GB', NAME: 'United Kingdom' },
                    geometry: { type: 'Polygon', coordinates: [[[-10, 50], [2, 50], [2, 60], [-10, 60], [-10, 50]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'FR', NAME: 'France' },
                    geometry: { type: 'Polygon', coordinates: [[[-5, 42], [8, 42], [8, 52], [-5, 52], [-5, 42]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'JP', NAME: 'Japan' },
                    geometry: { type: 'Polygon', coordinates: [[[125, 30], [150, 30], [150, 45], [125, 45], [125, 30]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'IN', NAME: 'India' },
                    geometry: { type: 'Polygon', coordinates: [[[68, 8], [97, 8], [97, 37], [68, 37], [68, 8]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'BR', NAME: 'Brazil' },
                    geometry: { type: 'Polygon', coordinates: [[[-75, -35], [-35, -35], [-35, 5], [-75, 5], [-75, -35]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'CN', NAME: 'China' },
                    geometry: { type: 'Polygon', coordinates: [[[75, 18], [135, 18], [135, 53], [75, 53], [75, 18]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'RU', NAME: 'Russia' },
                    geometry: { type: 'Polygon', coordinates: [[[20, 41], [180, 41], [180, 80], [20, 80], [20, 41]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'MX', NAME: 'Mexico' },
                    geometry: { type: 'Polygon', coordinates: [[[-120, 14], [-85, 14], [-85, 33], [-120, 33], [-120, 14]]] }
                },
                {
                    type: "Feature",
                    properties: { ISO_A2: 'AU', NAME: 'Australia' },
                    geometry: { type: 'Polygon', coordinates: [[[110, -45], [155, -45], [155, -10], [110, -10], [110, -45]]] }
                }
            ]
        };
    }

    addCountryToMap(geoFeature, countryData) {
        // Create a proper GeoJSON FeatureCollection for Leaflet
        const featureCollection = {
            type: "FeatureCollection",
            features: [geoFeature]
        };
        
        const layer = L.geoJSON(featureCollection, {
            style: {
                fillColor: CONFIG.COUNTRY_COLORS.default,
                weight: 1,
                opacity: 0.8,
                color: 'white',
                fillOpacity: 0.3
            }
        });

        // Add hover effects and click handlers
        layer.on({
            mouseover: (e) => this.onCountryHover(e, countryData),
            mouseout: (e) => this.onCountryLeave(e),
            click: (e) => this.onCountryClick(e, countryData)
        });

        layer.addTo(this.map);
        this.countries.set(countryData.code, { layer, data: countryData });

        // Add marker for better visibility
        if (countryData.coordinates) {
            const coords = typeof countryData.coordinates === 'string' 
                ? JSON.parse(countryData.coordinates) 
                : countryData.coordinates;
            const marker = L.circleMarker([coords.lat, coords.lng], {
                radius: Math.min(Math.max(countryData.book_count + 3, 4), 8),
                fillColor: CONFIG.COUNTRY_COLORS.default,
                color: 'white',
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            });

            marker.bindTooltip(`
                <div class="country-tooltip">
                    <h4>${countryData.name}</h4>
                    <p>${countryData.book_count} books</p>
                    <p>Average rating: ${formatRating(countryData.avg_country_rating)}</p>
                </div>
            `, {
                permanent: false,
                direction: 'top',
                className: 'custom-tooltip'
            });

            marker.on('click', () => this.onCountryClick(null, countryData));
            marker.addTo(this.map);
        }
    }

    onCountryHover(e, countryData) {
        const layer = e.target;
        layer.setStyle({
            fillColor: CONFIG.COUNTRY_COLORS.hover,
            weight: 2,
            fillOpacity: 0.5
        });
        layer.bringToFront();
    }

    onCountryLeave(e) {
        const layer = e.target;
        layer.setStyle({
            fillColor: CONFIG.COUNTRY_COLORS.default,
            weight: 1,
            fillOpacity: 0.3
        });
    }

    async onCountryClick(e, countryData) {
        try {
            // Update selected country styling
            if (this.selectedCountry) {
                const prevCountry = this.countries.get(this.selectedCountry);
                if (prevCountry) {
                    prevCountry.layer.setStyle({
                        fillColor: CONFIG.COUNTRY_COLORS.default,
                        weight: 2,
                        fillOpacity: 0.7
                    });
                }
            }

            this.selectedCountry = countryData.code;
            
            if (e) {
                e.target.setStyle({
                    fillColor: CONFIG.COUNTRY_COLORS.selected,
                    weight: 2,
                    fillOpacity: 0.5
                });
            }

            // Load and display books from this country
            await this.displayCountryBooks(countryData);
            
            // Zoom to country if coordinates available
            if (countryData.coordinates) {
                const coords = typeof countryData.coordinates === 'string' 
                    ? JSON.parse(countryData.coordinates) 
                    : countryData.coordinates;
                this.map.setView([coords.lat, coords.lng], 4);
            }

        } catch (error) {
            console.error('Error handling country click:', error);
            showToast('Failed to load country books', 'error');
        }
    }

    async displayCountryBooks(countryData) {
        const countryBooksSection = document.getElementById('country-books');
        const countryTitle = document.getElementById('country-title');
        const booksGrid = document.getElementById('books-grid');

        // Show loading
        countryTitle.textContent = `Books from ${countryData.name}`;
        showLoading('books-grid', `Loading books from ${countryData.name}...`);
        countryBooksSection.style.display = 'block';

        try {
            // Get books from this country
            const response = await apiService.getBooksByCountry(countryData.code, 12);
            
            if (response.books && response.books.length > 0) {
                booksGrid.innerHTML = response.books.map(book => createBookCard(book)).join('');
                
                // Scroll to the books section
                countryBooksSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                booksGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                        <i class="fas fa-book-open" style="font-size: 3rem; color: var(--golden); margin-bottom: 1rem;"></i>
                        <h3>No books found for ${countryData.name}</h3>
                        <p>Check back later for new additions!</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading country books:', error);
            booksGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #dc2626; margin-bottom: 1rem;"></i>
                    <h3>Failed to load books</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }

    addMapStyles() {
        // Add custom CSS for map tooltips
        const style = document.createElement('style');
        style.textContent = `
            .custom-tooltip {
                background: white;
                border: 2px solid var(--golden);
                border-radius: 10px;
                box-shadow: var(--shadow-warm);
            }
            
            .country-tooltip h4 {
                color: var(--burgundy);
                margin: 0 0 0.5rem 0;
                font-family: var(--font-display);
            }
            
            .country-tooltip p {
                margin: 0.25rem 0;
                color: var(--text-gray);
                font-size: 0.9rem;
            }
        `;
        document.head.appendChild(style);
    }

    showMapError() {
        const mapContainer = document.getElementById('world-map');
        mapContainer.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: var(--cream-light); border-radius: 15px;">
                <i class="fas fa-globe" style="font-size: 4rem; color: var(--golden); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--burgundy); margin-bottom: 0.5rem;">Map Loading Error</h3>
                <p style="color: var(--text-gray);">Unable to load the interactive map. Please refresh the page.</p>
                <button class="btn-primary" onclick="location.reload()" style="margin-top: 1rem;">
                    <i class="fas fa-refresh"></i> Reload Page
                </button>
            </div>
        `;
    }
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize map with a small delay to ensure container is ready
    setTimeout(() => {
        window.worldMap = new WorldMap();
    }, 100);
});