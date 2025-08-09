function updateResultsCount(showing, total, startIndex = 1, endIndex = showing) {
    const resultsCount = document.getElementById('resultsCount');
    if (!resultsCount) return;
    
    if (total > propertiesPerPage) {
        resultsCount.textContent = `Showing ${startIndex}-${endIndex} of ${total} properties`;
    } else {
        resultsCount.textContent = `Showing ${showing} of ${total} properties`;
    }
}

function updatePagination(totalProperties) {
    const totalPages = Math.ceil(totalProperties / propertiesPerPage);
    const pagination = document.querySelector('.pagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.style.display = 'none';
        return;
    }
    
    pagination.style.display = 'flex';
    pagination.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.className = 'page-btn';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => changePage(currentPage - 1, totalProperties);
    if (currentPage === 1) prevBtn.style.opacity = '0.5';
    pagination.appendChild(prevBtn);
    
    // Page numbers
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);
    
    if (startPage > 1) {
        const firstBtn = document.createElement('button');
        firstBtn.className = 'page-btn';
        firstBtn.textContent = '1';
        firstBtn.onclick = () => changePage(1, totalProperties);
        pagination.appendChild(firstBtn);
        
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.cssText = 'padding: 10px 5px; color: #666;';
            pagination.appendChild(ellipsis);
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changePage(i, totalProperties);
        pagination.appendChild(pageBtn);
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            ellipsis.style.cssText = 'padding: 10px 5px; color: #666;';
            pagination.appendChild(ellipsis);
        }
        
        const lastBtn = document.createElement('button');
        lastBtn.className = 'page-btn';
        lastBtn.textContent = totalPages;
        lastBtn.onclick = () => changePage(totalPages, totalProperties);
        pagination.appendChild(lastBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.className = 'page-btn';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => changePage(currentPage + 1, totalProperties);
    if (currentPage === totalPages) nextBtn.style.opacity = '0.5';
    pagination.appendChild(nextBtn);
}

function changePage(page, totalProperties) {
    const totalPages = Math.ceil(totalProperties / propertiesPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    
    // Get current filters and apply them
    const location = document.getElementById('locationSearch')?.value.toLowerCase() || '';
    const type = document.getElementById('propertyType')?.value || '';
    const priceRange = document.getElementById('priceRange')?.value || '';
    
    const filteredProperties = properties.filter(property => {
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesType = !type || property.type === type;
        const matchesPrice = !priceRange || checkPriceRange(property.price, priceRange);
        
        return matchesLocation && matchesType && matchesPrice;
    });
    
    displayPropertiesWithPagination(filteredProperties);
    
    // Scroll to top of properties section smoothly
    const propertiesSection = document.getElementById('properties');
    if (propertiesSection) {
        propertiesSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
        });
    }
}

// Enhanced save functionality with notification system
function toggleFavorite(propertyId) {
    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');
    
    const savedIndex = savedProperties.indexOf(propertyId);
    
    if (savedIndex > -1) {
        // Remove from saved
        savedProperties.splice(savedIndex, 1);
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = '';
        btn.title = 'Save property';
        showNotification('Property removed from saved list', 'info');
    } else {
        // Add to saved
        savedProperties.push(propertyId);
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = '#e74c3c';
        btn.title = 'Remove from saved';
        showNotification('Property saved successfully!', 'success');
    }
    
    // Update saved properties count in navigation if it exists
    updateSavedPropertiesCount();
}

// Share property functionality
function shareProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const shareData = {
        title: property.title,
        text: `Check out this amazing property: ${property.title} - ${property.price} in ${property.location}`,
        url: window.location.href + `#property-${propertyId}`
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        // Use native share API
        navigator.share(shareData).catch(err => {
            console.log('Error sharing:', err);
            fallbackShare(property);
        });
    } else {
        fallbackShare(property);
    }
}

function fallbackShare(property) {
    const shareUrl = window.location.href + `#property-${property.id}`;
    const shareText = `Check out this amazing property: ${property.title} - ${property.price} in ${property.location}`;
    
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'share-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            text-align: center;
        ">
            <h3 style="margin-bottom: 20px; color: #333;">Share Property</h3>
            <p style="margin-bottom: 20px; color: #666;">${property.title}</p>
            <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
                <button onclick="shareOn('facebook', '${shareUrl}', '${shareText}')" style="
                    flex: 1;
                    padding: 10px;
                    background: #3b5998;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    <i class="fab fa-facebook-f"></i> Facebook
                </button>
                <button onclick="shareOn('twitter', '${shareUrl}', '${shareText}')" style="
                    flex: 1;
                    padding: 10px;
                    background: #1da1f2;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    <i class="fab fa-twitter"></i> Twitter
                </button>
                <button onclick="shareOn('whatsapp', '${shareUrl}', '${shareText}')" style="
                    flex: 1;
                    padding: 10px;
                    background: #25d366;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
            </div>
            <div style="margin-bottom: 20px;">
                <input type="text" value="${shareUrl}" readonly style="
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    background: #f9f9f9;
                " id="shareUrl">
                <button onclick="copyToClipboard('shareUrl')" style="
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #9CAF88;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">Copy Link</button>
            </div>
            <button onclick="closeShareModal()" style="
                padding: 10px 20px;
                background: #666;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
            ">Close</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeShareModal();
        }
    });
}

function shareOn(platform, url, text) {
    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);
    let shareUrl;
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
            break;
        case 'whatsapp':
            shareUrl = `https://api.whatsapp.com/send?text=${encodedText} ${encodedUrl}`;
            break;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    closeShareModal();
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    showNotification('Link copied to clipboard!', 'success');
}

function closeShareModal() {
    const modal = document.querySelector('.share-modal');
    if (modal) {
        modal.remove();
    }
}

// Print property functionality
function printProperty(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const printWindow = window.open('', '_blank', 'width=800,height=600');
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Property Details - ${property.title}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #9CAF88; padding-bottom: 20px; margin-bottom: 20px; }
                .property-image { width: 100%; max-width: 400px; height: 300px; object-fit: cover; margin: 20px auto; display: block; }
                .property-details { margin: 20px 0; }
                .price { font-size: 24px; font-weight: bold; color: #9CAF88; }
                .location { font-size: 16px; color: #666; margin: 10px 0; }
                .features { display: flex; gap: 20px; margin: 20px 0; flex-wrap: wrap; }
                .feature { background: #f5f5f5; padding: 10px; border-radius: 5px; }
                .amenities { margin: 20px 0; }
                .amenity-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
                .amenity { background: #f9f9f9; padding: 8px; border-radius: 4px; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>${property.title}</h1>
                <p>Property Details Report</p>
            </div>
            
            <img src="${property.images[0]}" alt="${property.title}" class="property-image">
            
            <div class="property-details">
                <div class="price">${property.price}</div>
                <div class="location">📍 ${property.location}</div>
                <p><strong>Description:</strong> ${property.description}</p>
                
                <div class="features">
                    <div class="feature">🛏️ ${property.beds} Bedrooms</div>
                    <div class="feature">🛁 ${property.baths} Bathrooms</div>
                    <div class="feature">🚗 ${property.parking} Parking Spaces</div>
                    <div class="feature">📐 ${property.area}</div>
                </div>
                
                <div class="amenities">
                    <h3>Amenities</h3>
                    <div class="amenity-list">
                        ${property.amenities.map(amenity => `<div class="amenity">✓ ${amenity}</div>`).join('')}
                    </div>
                </div>
                
                <p><strong>Property Type:</strong> ${property.type.charAt(0).toUpperCase() + property.type.slice(1)}</p>
                <p><strong>Date Added:</strong> ${property.dateAdded}</p>
            </div>
            
            <div style="margin-top: 40px; text-align: center; color: #666; border-top: 1px solid #ddd; padding-top: 20px;">
                <p>Printed on: ${new Date().toLocaleDateString()}</p>
                <p>Visit our website for more properties and updates</p>
            </div>
        </body>
        </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 500);
}

// Enhanced notification system with theme colors
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        min-width: 300px;
        max-width: 400px;
        transform: translateX(450px);
        transition: transform 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        font-size: 14px;
        line-height: 1.4;
    `;
    
    // Set background color based on type using theme colors
    switch(type) {
        case 'success':
            notification.style.background = 'linear-gradient(135deg, #9CAF88 0%, #7A8F6B 100%)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(135deg, #A0522D 0%, #8B4513 100%)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)';
            break;
        default:
            notification.style.background = 'linear-gradient(135deg, #666 0%, #555 100%)';
    }
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between;">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 15px;
                padding: 2px 6px;
                border-radius: 3px;
                transition: background-color 0.2s ease;
            " onmouseover="this.style.backgroundColor='rgba(255,255,255,0.2)'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds (increased for better UX)
    setTimeout(() => {
        notification.style.transform = 'translateX(450px)';
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Saved properties management
function updateSavedPropertiesCount() {
    const savedCount = document.querySelector('.saved-count');
    if (savedCount) {
        savedCount.textContent = savedProperties.length;
        savedCount.style.display = savedProperties.length > 0 ? 'inline' : 'none';
    }
}

function viewSavedProperties() {
    if (savedProperties.length === 0) {
        showNotification('No saved properties yet', 'info');
        return;
    }
    
    const savedProps = properties.filter(p => savedProperties.includes(p.id));
    
    // Create saved properties modal with responsive design
    const modal = document.createElement('div');
    modal.className = 'saved-properties-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;
    
    const modalContent = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
        ">
            <div style="
                position: sticky;
                top: 0;
                background: white;
                padding: 20px;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            ">
                <h2 style="margin: 0; color: #333; font-size: 1.5rem;">Saved Properties (${savedProperties.length})</h2>
                <button onclick="closeSavedModal()" style="
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                    padding: 5px;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                " onmouseover="this.style.backgroundColor='#f0f0f0'" onmouseout="this.style.backgroundColor='transparent'">&times;</button>
            </div>
            <div id="savedPropertiesList" style="padding: 20px;">
                ${savedProps.map(property => `
                    <div style="
                        display: flex;
                        gap: 15px;
                        padding: 15px;
                        border: 1px solid #eee;
                        border-radius: 8px;
                        margin-bottom: 15px;
                        align-items: center;
                        background: white;
                        transition: all 0.3s ease;
                    " onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.1)'" onmouseout="this.style.boxShadow='none'">
                        <img src="${property.images[0]}" alt="${property.title}" style="
                            width: 100px;
                            height: 80px;
                            object-fit: cover;
                            border-radius: 6px;
                            flex-shrink: 0;
                        ">
                        <div style="flex: 1; min-width: 0;">
                            <h4 style="margin: 0 0 8px 0; color: #333; font-size: 1.1rem; line-height: 1.3;">${property.title}</h4>
                            <p style="margin: 0 0 5px 0; color: #666; font-size: 14px; display: flex; align-items: center; gap: 5px;">
                                <i class="fas fa-map-marker-alt" style="color: #9CAF88;"></i>
                                ${property.location}
                            </p>
                            <p style="margin: 0; font-weight: bold; color: #9CAF88; font-size: 1.1rem;">${property.price}</p>
                            <div style="display: flex; gap: 10px; margin-top: 8px; flex-wrap: wrap;">
                                <span style="background: #f8f9fa; padding: 4px 8px; border-radius: 12px; font-size: 11px; color: #666;">
                                    <i class="fas fa-bed" style="color: #9CAF88; margin-right: 4px;"></i>${property.beds} beds
                                </span>
                                <span style="background: #f8f9fa; padding: 4px 8px; border-radius: 12px; font-size: 11px; color: #666;">
                                    <i class="fas fa-bath" style="color: #9CAF88; margin-right: 4px;"></i>${property.baths} baths
                                </span>
                            </div>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 8px; flex-shrink: 0;">
                            <button onclick="openPropertyModal(${property.id}); closeSavedModal();" style="
                                padding: 8px 16px;
                                background: #9CAF88;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                min-width: 70px;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.backgroundColor='#7A8F6B'" onmouseout="this.style.backgroundColor='#9CAF88'">View</button>
                            <button onclick="toggleFavorite(${property.id}); updateSavedModal();" style="
                                padding: 8px 16px;
                                background: #8B4513;
                                color: white;
                                border: none;
                                border-radius: 6px;
                                cursor: pointer;
                                font-size: 12px;
                                min-width: 70px;
                                transition: all 0.3s ease;
                            " onmouseover="this.style.backgroundColor='#A0522D'" onmouseout="this.style.backgroundColor='#8B4513'">Remove</button>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="
                position: sticky;
                bottom: 0;
                background: white;
                padding: 20px;
                border-top: 1px solid #eee;
                text-align: center;
                border-radius: 0 0 12px 12px;
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                justify-content: center;
            ">
                <button onclick="clearAllSaved()" style="
                    padding: 10px 20px;
                    background: #8B4513;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    flex: 1;
                    min-width: 120px;
                    max-width: 200px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.backgroundColor='#A0522D'" onmouseout="this.style.backgroundColor='#8B4513'">Clear All</button>
                <button onclick="exportSavedProperties()" style="
                    padding: 10px 20px;
                    background: #9CAF88;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    flex: 1;
                    min-width: 120px;
                    max-width: 200px;
                    transition: all 0.3s ease;
                " onmouseover="this.style.backgroundColor='#7A8F6B'" onmouseout="this.style.backgroundColor='#9CAF88'">Export List</button>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSavedModal();
        }
    });
}

function closeSavedModal() {
    const modal = document.querySelector('.saved-properties-modal');
    if (modal) {
        modal.remove();
    }
}

function updateSavedModal() {
    closeSavedModal();
    setTimeout(() => viewSavedProperties(), 100);
}

function clearAllSaved() {
    if (confirm('Are you sure you want to clear all saved properties?')) {
        savedProperties = [];
        updateSavedPropertiesCount();
        
        // Update all heart icons on the page
        document.querySelectorAll('.save-btn i').forEach(icon => {
            icon.classList.remove('fas');
            icon.classList.add('far');
            icon.closest('button').style.color = '';
        });
        
        closeSavedModal();
        showNotification('All saved properties cleared', 'info');
    }
}

function exportSavedProperties() {
    const savedProps = properties.filter(p => savedProperties.includes(p.id));
    
    const csvContent = [
        ['Title', 'Price', 'Location', 'Type', 'Beds', 'Baths', 'Parking', 'Area', 'Description'],
        ...savedProps.map(p => [
            p.title,
            p.price,
            p.location,
            p.type,
            p.beds,
            p.baths,
            p.parking,
            p.area,
            p.description
        ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'saved-properties.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    
    showNotification('Saved properties exported successfully!', 'success');
}

// Sort functionality
function sortProperties(sortType) {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    const cards = Array.from(grid.children);
    
    cards.sort((a, b) => {
        const priceA = parseInt(a.getAttribute('data-price'));
        const priceB = parseInt(b.getAttribute('data-price'));
        
        switch(sortType) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return 1; // Assuming newer properties come first in the array
            case 'oldest':
                return -1;
            default:
                return 0; // Featured order
        }
    });
    
    cards.forEach(card => grid.appendChild(card));
}

// Property modal functionality
function openPropertyModal(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const isSaved = savedProperties.includes(property.id);
    const heartClass = isSaved ? 'fas' : 'far';
    const heartColor = isSaved ? '#e74c3c' : '#666';

    const modal = document.createElement('div');
    modal.className = 'property-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        padding: 20px;
    `;

    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 12px;
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        ">
            <button onclick="closePropertyModal()" style="
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(0,0,0,0.5);
                color: white;
                border: none;
                border-radius: 50%;
                width: 40px;
                height: 40px;
                font-size: 20px;
                cursor: pointer;
                z-index: 1;
            ">&times;</button>
            
            <div style="position: relative;">
                <img src="${property.images[0]}" alt="${property.title}" style="
                    width: 100%;
                    height: 300px;
                    object-fit: cover;
                    border-radius: 12px 12px 0 0;
                ">
                ${property.badge ? `<div style="
                    position: absolute;
                    top: 20px;
                    left: 20px;
                    background: ${property.badge === 'Featured' ? '#ff6b35' : property.badge === 'Premium' ? '#8e44ad' : '#27ae60'};
                    color: white;
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: bold;
                ">${property.badge}</div>` : ''}
            </div>
            
            <div style="padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 20px;">
                    <div>
                        <h2 style="margin: 0 0 10px 0; color: #333;">${property.title}</h2>
                        <p style="margin: 0; color: #666; font-size: 16px;"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size: 28px; font-weight: bold; color: #9CAF88; margin-bottom: 10px;">${property.price}</div>
                        <div style="display: flex; gap: 10px;">
                            <button onclick="toggleFavorite(${property.id}); updateModalButtons(${property.id})" style="
                                padding: 8px 12px;
                                background: none;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                cursor: pointer;
                                color: ${heartColor};
                            " id="modalSaveBtn">
                                <i class="${heartClass} fa-heart"></i>
                            </button>
                            <button onclick="shareProperty(${property.id})" style="
                                padding: 8px 12px;
                                background: none;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                                <i class="fas fa-share-alt"></i>
                            </button>
                            <button onclick="printProperty(${property.id})" style="
                                padding: 8px 12px;
                                background: none;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                cursor: pointer;
                            ">
                                <i class="fas fa-print"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <div style="text-align: center;">
                        <i class="fas fa-bed" style="font-size: 24px; color: #9CAF88; margin-bottom: 5px;"></i>
                        <div style="font-weight: bold;">${property.beds}</div>
                        <div style="font-size: 12px; color: #666;">Bedrooms</div>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-bath" style="font-size: 24px; color: #9CAF88; margin-bottom: 5px;"></i>
                        <div style="font-weight: bold;">${property.baths}</div>
                        <div style="font-size: 12px; color: #666;">Bathrooms</div>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-car" style="font-size: 24px; color: #9CAF88; margin-bottom: 5px;"></i>
                        <div style="font-weight: bold;">${property.parking}</div>
                        <div style="font-size: 12px; color: #666;">Parking</div>
                    </div>
                    <div style="text-align: center;">
                        <i class="fas fa-expand-arrows-alt" style="font-size: 24px; color: #9CAF88; margin-bottom: 5px;"></i>
                        <div style="font-weight: bold;">${property.area}</div>
                        <div style="font-size: 12px; color: #666;">Area</div>
                    </div>
                </div>
                
                <div style="margin: 25px 0;">
                    <h3 style="margin-bottom: 15px; color: #333;">Description</h3>
                    <p style="line-height: 1.6; color: #666;">${property.description}</p>
                </div>
                
                <div style="margin: 25px 0;">
                    <h3 style="margin-bottom: 15px; color: #333;">Amenities</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                        ${property.amenities.map(amenity => `
                            <div style="
                                display: flex;
                                align-items: center;
                                padding: 8px;
                                background: #f8f9fa;
                                border-radius: 6px;
                            ">
                                <i class="fas fa-check" style="color: #27ae60; margin-right: 8px; font-size: 12px;"></i>
                                <span style="font-size: 14px;">${amenity}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #eee;">
                    <button style="
                        padding: 12px 30px;
                        background: #9CAF88;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                        margin-right: 10px;
                    " onclick="contactAgent(${property.id})">Contact Agent</button>
                    <button style="
                        padding: 12px 30px;
                        background: none;
                        color: #9CAF88;
                        border: 2px solid #9CAF88;
                        border-radius: 8px;
                        font-size: 16px;
                        cursor: pointer;
                    " onclick="scheduleViewing(${property.id})">Schedule Viewing</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closePropertyModal();
        }
    });
}

function closePropertyModal() {
    const modal = document.querySelector('.property-modal');
    if (modal) {
        modal.remove();
    }
}

function updateModalButtons(propertyId) {
    const modalSaveBtn = document.getElementById('modalSaveBtn');
    if (modalSaveBtn) {
        const isSaved = savedProperties.includes(propertyId);
        const icon = modalSaveBtn.querySelector('i');
        
        if (isSaved) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            modalSaveBtn.style.color = '#e74c3c';
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            modalSaveBtn.style.color = '#666';
        }
    }
}

function contactAgent(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    showNotification(`Contact feature would open for ${property.title}`, 'info');
    // Here you would typically open a contact form or redirect to contact page
}

function scheduleViewing(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    showNotification(`Viewing scheduler would open for ${property.title}`, 'info');
    // Here you would typically open a calendar/scheduling modal
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize search suggestions
    initializeSearchSuggestions();
    
    // Display initial properties
    displayPropertiesWithPagination(properties);
    updateSavedPropertiesCount();
    
    // Filter button handlers
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-filter');
            let filteredProperties = properties;
            
            if (filterType !== 'all') {
                filteredProperties = properties.filter(property => property.type === filterType);
            }
            
            currentPage = 1; // Reset to first page
            displayPropertiesWithPagination(filteredProperties);
        });
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProperties(this.value);
        });
    }
    
    // View toggle functionality
    const viewBtns = document.querySelectorAll('.view-btn');
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const viewType = this.getAttribute('data-view');
            const grid = document.getElementById('propertiesGrid');
            
            if (viewType === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });

    // Search form handler
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            filterProperties();
        });
    }

    // Add event listeners to filter inputs
    const locationSearch = document.getElementById('locationSearch');
    const propertyType = document.getElementById('propertyType');
    const priceRange = document.getElementById('priceRange');

    if (locationSearch) {
        locationSearch.addEventListener('input', debounce(filterProperties, 300));
    }
    
    if (propertyType) {
        propertyType.addEventListener('change', filterProperties);
    }
    
    if (priceRange) {
        priceRange.addEventListener('change', filterProperties);
    }

    // Add saved properties link to navigation if it doesn't exist
    addSavedPropertiesLink();
});

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add saved properties link to navigation
function addSavedPropertiesLink() {
    const nav = document.querySelector('nav ul') || document.querySelector('.nav-links');
    if (nav && !document.getElementById('savedPropertiesLink')) {
        const savedLink = document.createElement('li');
        savedLink.innerHTML = `
            <a href="#" id="savedPropertiesLink" onclick="viewSavedProperties(); return false;" style="position: relative;">
                Saved Properties
                <span class="saved-count" style="
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #e74c3c;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    display: none;
                ">${savedProperties.length}</span>
            </a>
        `;
        nav.appendChild(savedLink);
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Press 'S' to open saved properties
    if (e.key === 's' || e.key === 'S') {
        if (!e.target.matches('input, textarea')) {
            e.preventDefault();
            viewSavedProperties();
        }
    }
    
    // Press 'Escape' to close modals
    if (e.key === 'Escape') {
        closePropertyModal();
        closeShareModal();
        closeSavedModal();
    }
});

// Initialize animations if function exists
function initializeAnimations() {
    // Placeholder for animation initialization
    // This would be called if you have animations in your CSS/JS
    console.log('Animations initialized');
}

// Loading Screen Management
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    
    if (loadingScreen) {
        loadingScreen.classList.add('fade-out');
        setTimeout(function() {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }
});

window.addEventListener('load', function() {
    setTimeout(function() {
        hideLoadingScreen();
    }, 1000);
});

setTimeout(function() {
    hideLoadingScreen();
}, 8000);

// Enhanced Mobile Navigation Toggle
function toggleMenu() {
    const nav = document.getElementById("navLinks");
    const hamburger = document.querySelector(".hamburger");
    
    nav.classList.toggle("show");
    hamburger.classList.toggle("active");
    
    // Handle dropdown menus in mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (nav.classList.contains("show")) {
            // Convert hover dropdowns to click dropdowns on mobile
            const dropbtn = dropdown.querySelector('.dropbtn');
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            
            dropbtn.addEventListener('click', function(e) {
                e.preventDefault();
                dropdown.classList.toggle('show');
                
                // Close other open dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('show');
                    }
                });
            });
        }
    });
}

// Enhanced Location suggestions data
const locationSuggestions = [
    'Ibadan, Oyo State',
    'Lagos, Lagos State',
    'Abuja, FCT',
    'Port Harcourt, Rivers State',
    'Kano, Kano State',
    'Kaduna, Kaduna State',
    'Benin City, Edo State',
    'Jos, Plateau State',
    'Ilorin, Kwara State',
    'Enugu, Enugu State',
    'Kolapo Ishola GRA, Ibadan',
    'Victoria Island, Lagos',
    'Lekki, Lagos',
    'Wuse II, Abuja',
    'Gwarinpa, Abuja',
    'Magodo, Lagos',
    'Ikeja, Lagos',
    'Surulere, Lagos',
    'Yaba, Lagos',
    'Carlton Gate Estate, Ibadan',
    'Osapa, Lekki',
    'Banana Island, Lagos',
    'Maitama, Abuja',
    'Asokoro, Abuja',
    'GRA, Port Harcourt',
    'Ikoyi, Lagos',
    'Gbagada, Lagos',
    'Anthony, Lagos',
    'Ogba, Lagos',
    'Agidingbi, Lagos',
    'Maryland, Lagos',
    'Ojodu, Lagos',
    'Berger, Lagos',
    'Isheri, Lagos',
    'Ajah, Lagos',
    'Sangotedo, Lagos',
    'Chevron, Lagos',
    'Ibeju-Lekki, Lagos',
    'Epe, Lagos',
    'Badagry, Lagos',
    'Ojo, Lagos',
    'Alimosho, Lagos',
    'Ifako-Ijaiye, Lagos',
    'Agege, Lagos',
    'Mushin, Lagos',
    'Oshodi, Lagos',
    'Amuwo-Odofin, Lagos',
    'Kosofe, Lagos',
    'Shomolu, Lagos'
];

// Saved properties storage (using in-memory storage for demo)
let savedProperties = [];
let currentPage = 1;
const propertiesPerPage = 6;

// Enhanced Property Data with more properties for pagination testing
const properties = [
    {
        id: 1,
        title: "Luxury Detached Duplex",
        price: "₦185,000,000",
        location: "Kolapo Ishola GRA, Ibadan",
        type: "duplex",
        beds: 4,
        baths: 4,
        parking: 2,
        area: "450 sqm",
        description: "Stunning 4-bedroom detached duplex in a prestigious serene mini court with modern amenities and beautiful finishing. This property features spacious rooms, modern kitchen, and beautiful garden space.",
        images: [
            "images/kolapo-gra-duplex.jpeg",
            "images/kolapo-gra-duplex.jpeg",
            "images/kolapo-gra-duplex.jpeg"
        ],
        amenities: [
            "High-Speed Internet",
            "Swimming Pool",
            "Fitness Center",
            "24/7 Security",
            "Backup Generator",
            "Water Treatment",
            "Landscaped Garden",
            "Modern Kitchen"
        ],
        badge: "Featured",
        dateAdded: "2025-01-15"
    },
    {
        id: 2,
        title: "Grande Smart Mansion",
        price: "₦1,300,000,000",
        location: "Osapa, Lekki, Lagos",
        type: "mansion",
        beds: 5,
        baths: 5,
        parking: 3,
        area: "680 sqm",
        description: "Ultra-modern 5-bedroom smart home featuring private cinema and state-of-the-art technology. This luxurious mansion comes with automated systems, premium finishes, and exclusive amenities.",
        images: [
            "images/Osapa-lekki.jpeg",
            "images/Osapa-lekki.jpeg",
            "images/Osapa-lekki.jpeg"
        ],
        amenities: [
            "Smart Home System",
            "Private Cinema",
            "Wine Cellar",
            "Gym & Spa",
            "Infinity Pool",
            "Rooftop Terrace",
            "Home Office",
            "Staff Quarters"
        ],
        badge: "Premium",
        dateAdded: "2025-01-20"
    },
    {
        id: 3,
        title: "Contemporary Semi-Detached Duplex",
        price: "₦180,000,000",
        location: "Carlton Gate Estate, Ibadan",
        type: "duplex",
        beds: 4,
        baths: 4,
        parking: 2,
        area: "420 sqm",
        description: "Beautiful contemporary 4-bedroom semi-detached duplex with a separate boys' quarter. Features modern architectural design with spacious living areas and premium fixtures.",
        images: [
            "images/detached-duplex+BQ.jpeg",
            "images/detached-duplex+BQ.jpeg",
            "images/detached-duplex+BQ.jpeg"
        ],
        amenities: [
            "Boys Quarter",
            "Modern Kitchen",
            "Air Conditioning",
            "Security System",
            "Parking Space",
            "Garden Area",
            "Storage Room",
            "Laundry Area"
        ],
        badge: "New",
        dateAdded: "2025-01-18"
    },
    {
        id: 4,
        title: "Modern Apartment Complex",
        price: "₦85,000,000",
        location: "Wuse II, Abuja",
        type: "apartment",
        beds: 3,
        baths: 2,
        parking: 1,
        area: "180 sqm",
        description: "Stylish 3-bedroom apartment in a secure gated community with modern facilities. Perfect for young professionals and small families looking for urban convenience.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Gated Community",
            "Elevator Access",
            "Parking Space",
            "Playground",
            "Shopping Mall Nearby",
            "Public Transport",
            "School District",
            "Medical Center"
        ],
        dateAdded: "2025-01-12"
    },
    {
        id: 5,
        title: "Executive Bungalow",
        price: "₦120,000,000",
        location: "Magodo, Lagos",
        type: "bungalow",
        beds: 4,
        baths: 3,
        parking: 2,
        area: "380 sqm",
        description: "Spacious 4-bedroom executive bungalow with large compound and garden area. Ideal for families who prefer single-level living with ample outdoor space.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Large Compound",
            "Garden Space",
            "Guest Room",
            "Study Room",
            "Dining Area",
            "Kitchen Island",
            "Backup Power",
            "Water Borehole"
        ],
        dateAdded: "2025-01-10"
    },
    {
        id: 6,
        title: "Luxury Duplex Villa",
        price: "₦220,000,000",
        location: "Victoria Island, Lagos",
        type: "duplex",
        beds: 5,
        baths: 4,
        parking: 3,
        area: "520 sqm",
        description: "Premium 5-bedroom duplex villa with swimming pool and breathtaking city views. Located in one of Lagos's most prestigious neighborhoods with world-class amenities.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Swimming Pool",
            "City Views",
            "Private Balcony",
            "Master Suite",
            "Walk-in Closet",
            "Home Theater",
            "Wine Bar",
            "Concierge Service"
        ],
        badge: "Hot",
        dateAdded: "2025-01-22"
    },
    {
        id: 7,
        title: "Modern Terrace House",
        price: "₦95,000,000",
        location: "Gwarinpa, Abuja",
        type: "apartment",
        beds: 3,
        baths: 3,
        parking: 2,
        area: "220 sqm",
        description: "Well-designed 3-bedroom terrace house in a serene neighborhood. Features modern amenities and is perfect for young families.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Modern Kitchen",
            "En-suite Bedrooms",
            "Parking Space",
            "Garden Area",
            "Security System",
            "Water Supply",
            "Power Supply",
            "Quiet Neighborhood"
        ],
        dateAdded: "2025-01-25"
    },
    {
        id: 8,
        title: "Luxury Penthouse",
        price: "₦450,000,000",
        location: "Banana Island, Lagos",
        type: "apartment",
        beds: 4,
        baths: 4,
        parking: 2,
        area: "350 sqm",
        description: "Exquisite penthouse with panoramic views of Lagos lagoon. Premium finishes and exclusive amenities in Nigeria's most prestigious location.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Lagoon Views",
            "Private Elevator",
            "Rooftop Terrace",
            "Infinity Pool",
            "Concierge Service",
            "Yacht Club Access",
            "24/7 Security",
            "Backup Generator"
        ],
        badge: "Premium",
        dateAdded: "2025-01-28"
    },
    {
        id: 9,
        title: "Family Duplex",
        price: "₦165,000,000",
        location: "Ikeja, Lagos",
        type: "duplex",
        beds: 4,
        baths: 3,
        parking: 2,
        area: "400 sqm",
        description: "Spacious family duplex in a well-developed area with excellent infrastructure. Close to schools, hospitals, and shopping centers.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Family Room",
            "Study Area",
            "Modern Kitchen",
            "Guest Toilet",
            "Parking Space",
            "Generator House",
            "Water Treatment",
            "Perimeter Fence"
        ],
        dateAdded: "2025-01-30"
    },
    {
        id: 10,
        title: "Executive Mansion",
        price: "₦850,000,000",
        location: "Maitama, Abuja",
        type: "mansion",
        beds: 6,
        baths: 6,
        parking: 4,
        area: "750 sqm",
        description: "Grand executive mansion in the heart of Abuja's diplomatic zone. Features luxurious amenities and spacious living areas.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Grand Entrance",
            "Dining Hall",
            "Multiple Living Areas",
            "Master Suite",
            "Guest Rooms",
            "Staff Quarters",
            "Swimming Pool",
            "Landscaped Garden"
        ],
        badge: "Featured",
        dateAdded: "2025-02-01"
    },
    {
        id: 11,
        title: "Cozy Bungalow",
        price: "₦75,000,000",
        location: "Jos, Plateau State",
        type: "bungalow",
        beds: 3,
        baths: 2,
        parking: 2,
        area: "280 sqm",
        description: "Charming 3-bedroom bungalow in the beautiful city of Jos. Perfect for those seeking a peaceful lifestyle with great weather.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Cool Weather",
            "Garden Space",
            "Modern Kitchen",
            "Parking Space",
            "Security System",
            "Water Supply",
            "Backup Power",
            "Quiet Environment"
        ],
        dateAdded: "2025-02-03"
    },
    {
        id: 12,
        title: "Waterfront Villa",
        price: "₦320,000,000",
        location: "GRA, Port Harcourt",
        type: "duplex",
        beds: 5,
        baths: 4,
        parking: 3,
        area: "550 sqm",
        description: "Beautiful waterfront villa with stunning river views. Located in Port Harcourt's most prestigious neighborhood.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Waterfront View",
            "Private Jetty",
            "Swimming Pool",
            "Garden Area",
            "Modern Kitchen",
            "Security System",
            "Backup Generator",
            "Staff Quarters"
        ],
        badge: "New",
        dateAdded: "2025-02-05"
    },
    // Additional properties for pagination testing
    {
        id: 13,
        title: "Modern Studio Apartment",
        price: "₦45,000,000",
        location: "Yaba, Lagos",
        type: "apartment",
        beds: 1,
        baths: 1,
        parking: 1,
        area: "80 sqm",
        description: "Compact and modern studio apartment perfect for young professionals. Located in the tech hub of Lagos with excellent connectivity.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Tech Hub Location",
            "High-Speed Internet",
            "Modern Appliances",
            "Security System",
            "Parking Space",
            "Gym Access",
            "Co-working Space",
            "24/7 Power"
        ],
        dateAdded: "2025-02-07"
    },
    {
        id: 14,
        title: "Luxury 3-Bedroom Flat",
        price: "₦135,000,000",
        location: "Ikoyi, Lagos",
        type: "apartment",
        beds: 3,
        baths: 3,
        parking: 2,
        area: "200 sqm",
        description: "Elegant 3-bedroom apartment in prestigious Ikoyi with premium finishes and modern amenities. Perfect for executives and families.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Prestigious Location",
            "Premium Finishes",
            "Swimming Pool",
            "Gym",
            "Concierge Service",
            "Backup Generator",
            "Water Treatment",
            "Garden View"
        ],
        badge: "Hot",
        dateAdded: "2025-02-08"
    },
    {
        id: 15,
        title: "Spacious Family Home",
        price: "₦200,000,000",
        location: "Gbagada, Lagos",
        type: "duplex",
        beds: 5,
        baths: 4,
        parking: 3,
        area: "480 sqm",
        description: "Beautiful 5-bedroom duplex with ample space for a growing family. Features include a large compound, modern kitchen, and spacious living areas.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Large Compound",
            "Spacious Rooms",
            "Modern Kitchen",
            "Family Lounge",
            "Children's Play Area",
            "Security System",
            "Backup Power",
            "Parking Space"
        ],
        dateAdded: "2025-02-10"
    },
    {
        id: 16,
        title: "Affordable 2-Bedroom Apartment",
        price: "₦55,000,000",
        location: "Surulere, Lagos",
        type: "apartment",
        beds: 2,
        baths: 2,
        parking: 1,
        area: "120 sqm",
        description: "Affordable 2-bedroom apartment in the heart of Surulere. Great for first-time homebuyers and young couples starting their property journey.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Affordable Price",
            "Central Location",
            "Modern Fixtures",
            "Security",
            "Parking",
            "Water Supply",
            "Easy Access Roads",
            "Market Nearby"
        ],
        badge: "New",
        dateAdded: "2025-02-12"
    },
    {
        id: 17,
        title: "Executive 4-Bedroom Duplex",
        price: "₦275,000,000",
        location: "Maryland, Lagos",
        type: "duplex",
        beds: 4,
        baths: 4,
        parking: 2,
        area: "420 sqm",
        description: "Executive 4-bedroom duplex in Maryland with modern amenities and excellent finishing. Located in a serene neighborhood with great infrastructure.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Executive Finishing",
            "Serene Neighborhood",
            "Modern Kitchen",
            "Air Conditioning",
            "Security System",
            "Parking Space",
            "Garden Area",
            "Boys Quarter"
        ],
        badge: "Featured",
        dateAdded: "2025-02-14"
    },
    {
        id: 18,
        title: "Luxury Detached House",
        price: "₦380,000,000",
        location: "Ajah, Lagos",
        type: "duplex",
        beds: 5,
        baths: 5,
        parking: 3,
        area: "550 sqm",
        description: "Luxurious 5-bedroom detached house in rapidly developing Ajah area. Features modern architecture, spacious rooms, and premium amenities.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Modern Architecture",
            "Spacious Rooms",
            "Premium Amenities",
            "Swimming Pool",
            "Security System",
            "Backup Generator",
            "Water Treatment",
            "Staff Quarter"
        ],
        badge: "Premium",
        dateAdded: "2025-02-16"
    },
    {
        id: 19,
        title: "Cozy 3-Bedroom Bungalow",
        price: "₦98,000,000",
        location: "Ilorin, Kwara State",
        type: "bungalow",
        beds: 3,
        baths: 2,
        parking: 2,
        area: "250 sqm",
        description: "Charming 3-bedroom bungalow in peaceful Ilorin. Perfect for those seeking a quiet lifestyle away from the hustle and bustle of Lagos.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Peaceful Location",
            "Affordable Price",
            "Garden Space",
            "Modern Kitchen",
            "Security",
            "Parking",
            "Water Supply",
            "Backup Power"
        ],
        dateAdded: "2025-02-18"
    },
    {
        id: 20,
        title: "Ultra-Modern Mansion",
        price: "₦750,000,000",
        location: "Asokoro, Abuja",
        type: "mansion",
        beds: 6,
        baths: 7,
        parking: 4,
        area: "800 sqm",
        description: "Ultra-modern 6-bedroom mansion in prestigious Asokoro district. Features cutting-edge design, smart home technology, and luxury amenities.",
        images: [
            "images/hero-image.jpg",
            "images/hero-image.jpg",
            "images/hero-image.jpg"
        ],
        amenities: [
            "Smart Home Technology",
            "Luxury Amenities",
            "Swimming Pool",
            "Home Theater",
            "Wine Cellar",
            "Gym",
            "Staff Quarters",
            "Security System"
        ],
        badge: "Premium",
        dateAdded: "2025-02-20"
    }
];

// Enhanced search suggestions with autocomplete
function initializeSearchSuggestions() {
    const locationInput = document.getElementById('locationSearch');
    if (!locationInput) return;

    // Create suggestions container
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #ddd;
        border-top: none;
        border-radius: 0 0 8px 8px;
        max-height: 250px;
        overflow-y: auto;
        z-index: 1000;
        display: none;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    `;

    // Position the input group relatively
    locationInput.parentElement.style.position = 'relative';
    locationInput.parentElement.appendChild(suggestionsContainer);

    let currentHighlight = -1;

    locationInput.addEventListener('input', function() {
        const value = this.value.toLowerCase().trim();
        currentHighlight = -1;
        
        if (value.length < 1) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        const filteredSuggestions = locationSuggestions.filter(location =>
            location.toLowerCase().includes(value)
        ).sort((a, b) => {
            // Prioritize exact matches at the beginning
            const aStartsWith = a.toLowerCase().startsWith(value);
            const bStartsWith = b.toLowerCase().startsWith(value);
            if (aStartsWith && !bStartsWith) return -1;
            if (!aStartsWith && bStartsWith) return 1;
            return a.localeCompare(b);
        });

        if (filteredSuggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            return;
        }

        suggestionsContainer.innerHTML = filteredSuggestions
            .slice(0, 10) // Limit to 10 suggestions
            .map((location, index) => {
                const highlightedText = location.replace(
                    new RegExp(value, 'gi'),
                    `<strong style="color: #9CAF88;">    {
        id: 10,</strong>`
                );
                return `
                    <div class="suggestion-item" data-index="${index}" style="
                        padding: 12px 15px;
                        cursor: pointer;
                        border-bottom: 1px solid #f0f0f0;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                    ">
                        <i class="fas fa-map-marker-alt" style="color: #9CAF88; margin-right: 10px; font-size: 14px;"></i>
                        <span>${highlightedText}</span>
                    </div>
                `;
            }).join('');

        suggestionsContainer.style.display = 'block';

        // Add click and hover handlers
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                locationInput.value = this.textContent.trim();
                suggestionsContainer.style.display = 'none';
                // Trigger search after selection
                filterProperties();
            });

            item.addEventListener('mouseenter', function() {
                removeHighlight();
                this.style.backgroundColor = '#f8f9fa';
                currentHighlight = index;
            });

            item.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'white';
            });
        });
    });

    function removeHighlight() {
        suggestionsContainer.querySelectorAll('.suggestion-item').forEach(item => {
            item.style.backgroundColor = 'white';
        });
    }

    function highlightItem(index) {
        removeHighlight();
        const items = suggestionsContainer.querySelectorAll('.suggestion-item');
        if (items[index]) {
            items[index].style.backgroundColor = '#e8f4f8';
            items[index].scrollIntoView({ block: 'nearest' });
        }
    }

    // Enhanced keyboard navigation
    locationInput.addEventListener('keydown', function(e) {
        const suggestions = suggestionsContainer.querySelectorAll('.suggestion-item');
        
        if (suggestions.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentHighlight = (currentHighlight + 1) % suggestions.length;
            highlightItem(currentHighlight);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentHighlight = currentHighlight <= 0 ? suggestions.length - 1 : currentHighlight - 1;
            highlightItem(currentHighlight);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentHighlight >= 0 && suggestions[currentHighlight]) {
                locationInput.value = suggestions[currentHighlight].textContent.trim();
                suggestionsContainer.style.display = 'none';
                filterProperties();
            } else {
                filterProperties();
            }
        } else if (e.key === 'Escape') {
            suggestionsContainer.style.display = 'none';
            currentHighlight = -1;
        }
    });

    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!locationInput.parentElement.contains(e.target)) {
            suggestionsContainer.style.display = 'none';
            currentHighlight = -1;
        }
    });

    // Show suggestions when focusing on empty input
    locationInput.addEventListener('focus', function() {
        if (this.value.length >= 1) {
            this.dispatchEvent(new Event('input'));
        }
    });
}

// Filter and Search Functions
function filterProperties() {
    const location = document.getElementById('locationSearch')?.value.toLowerCase() || '';
    const type = document.getElementById('propertyType')?.value || '';
    const priceRange = document.getElementById('priceRange')?.value || '';
    
    const filteredProperties = properties.filter(property => {
        const matchesLocation = !location || property.location.toLowerCase().includes(location);
        const matchesType = !type || property.type === type;
        const matchesPrice = !priceRange || checkPriceRange(property.price, priceRange);
        
        return matchesLocation && matchesType && matchesPrice;
    });
    
    currentPage = 1; // Reset to first page
    displayPropertiesWithPagination(filteredProperties);
}

function checkPriceRange(price, range) {
    const numericPrice = parseInt(price.replace(/[₦,]/g, ''));
    
    switch(range) {
        case '0-100':
            return numericPrice <= 100000000;
        case '100-300':
            return numericPrice > 100000000 && numericPrice <= 300000000;
        case '300-500':
            return numericPrice > 300000000 && numericPrice <= 500000000;
        case '500+':
            return numericPrice > 500000000;
        default:
            return true;
    }
}

function displayPropertiesWithPagination(propertiesToShow) {
    const startIndex = (currentPage - 1) * propertiesPerPage;
    const endIndex = startIndex + propertiesPerPage;
    const paginatedProperties = propertiesToShow.slice(startIndex, endIndex);
    
    displayProperties(paginatedProperties);
    updateResultsCount(paginatedProperties.length, propertiesToShow.length, startIndex + 1, Math.min(endIndex, propertiesToShow.length));
    updatePagination(propertiesToShow.length);
}

function displayProperties(propertiesToShow) {
    const grid = document.getElementById('propertiesGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (propertiesToShow.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-home" style="font-size: 48px; color: #ccc; margin-bottom: 16px;"></i>
                <h3 style="color: #666; margin-bottom: 8px;">No properties found</h3>
                <p style="color: #999;">Try adjusting your search criteria</p>
            </div>
        `;
        return;
    }
    
    propertiesToShow.forEach(property => {
        const propertyCard = createPropertyCard(property);
        grid.appendChild(propertyCard);
    });
    
    // Re-initialize animations for new elements
    if (typeof initializeAnimations === 'function') {
        initializeAnimations();
    }
}

function createPropertyCard(property) {
    const card = document.createElement('div');
    card.className = 'property-card';
    card.setAttribute('data-type', property.type);
    card.setAttribute('data-price', parseInt(property.price.replace(/[₦,]/g, '')));
    card.setAttribute('data-location', property.location.toLowerCase());
    
    const badgeHtml = property.badge ? `<div class="property-badge ${property.badge.toLowerCase()}">${property.badge}</div>` : '';
    const isSaved = savedProperties.includes(property.id);
    const heartClass = isSaved ? 'fas' : 'far';
    const heartColor = isSaved ? 'color: #e74c3c;' : '';
    
    card.innerHTML = `
        <div class="property-image">
            <img src="${property.images[0]}" alt="${property.title}" loading="lazy">
            ${badgeHtml}
            <div class="property-overlay">
                <button class="quick-view-btn" onclick="openPropertyModal(${property.id})">Quick View</button>
            </div>
        </div>
        <div class="property-info">
            <div class="property-price">${property.price}</div>
            <h3>${property.title}</h3>
            <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <p class="property-description">${property.description.substring(0, 100)}...</p>
            <div class="property-features">
                <span><i class="fas fa-bed"></i> ${property.beds} Beds</span>
                <span><i class="fas fa-bath"></i> ${property.baths} Baths</span>
                <span><i class="fas fa-car"></i> ${property.parking} Parking</span>
                <span><i class="fas fa-expand-arrows-alt"></i> ${property.area}</span>
            </div>
            <div class="property-actions">
                <button class="btn btn-primary" onclick="openPropertyModal(${property.id})">View Details</button>
                <button class="btn btn-outline save-btn" onclick="toggleFavorite(${property.id})" style="${heartColor}" title="${isSaved ? 'Remove from saved' : 'Save property'}">
                    <i class="${heartClass} fa-heart"></i>
                </button>
                <button class="btn btn-outline" onclick="shareProperty(${property.id})" title="Share property">
                    <i class="fas fa-share-alt"></i>
                </button>
                <button class="btn btn-outline" onclick="printProperty(${property.id})" title="Print property details">
                    <i class="fas fa-print"></i>
                </button>
            </div>
        </div>
    `;
    
    return card;
}