// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements for brochure functionality
    const brochureBtn = document.querySelector('.nav-item:nth-child(4)');
    const mobileBrochureBtn = document.querySelector('.mobile-menu-item:nth-child(4)');
    const modal = document.getElementById('brochureModal');
    const closeBtn = document.querySelector('.close-btn');
    const requestButton = document.getElementById('requestButton');
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');
    const backToStep1Btn = document.getElementById('backToStep1');
    const brochureForm = document.getElementById('brochureForm');
    const nameInput = document.getElementById('name');
    const mobileInput = document.getElementById('mobile');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('nameError');
    const mobileError = document.getElementById('mobileError');
    const emailError = document.getElementById('emailError');
    
    // Cache DOM elements for video view switching
    const changeViewBtn = document.querySelector('.nav-item:nth-child(1)');
    const mobileChangeViewBtn = document.querySelector('.mobile-menu-item:nth-child(1)');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // Cache DOM elements for filter panel
    const filtersBtn = document.querySelector('.nav-item:nth-child(2)'); // Second nav item
    const mobileFiltersBtn = document.querySelector('.mobile-menu-item:nth-child(2)'); // Second mobile menu item
    const filterPanel = document.getElementById('filterPanel');
    const filterClose = document.getElementById('filterClose');
    const filterOverlay = document.getElementById('filterOverlay');
    const sizeRange = document.getElementById('sizeRange');
    const priceRange = document.getElementById('priceRange');
    
    // Set up variables for video view switching
    let currentView = 1;
    
    // Create video view elements if they don't exist
    if (!document.getElementById('view1')) {
        setupVideoViews();
    }
    
    // Mobile menu toggle functionality
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            mobileMenu.classList.remove('active');
        }
    });
    
    // Add event listeners for view switching
    if (changeViewBtn) {
        changeViewBtn.addEventListener('click', toggleView);
    }
    
    if (mobileChangeViewBtn) {
        mobileChangeViewBtn.addEventListener('click', function() {
            toggleView();
            // Hide mobile menu when switching view
            mobileMenu.classList.remove('active');
        });
    }
    
    // Add event listeners for filter panel
    if (filtersBtn) {
        filtersBtn.addEventListener('click', openFilterPanel);
    }
    
    if (mobileFiltersBtn) {
        mobileFiltersBtn.addEventListener('click', function() {
            openFilterPanel();
            // Hide mobile menu when opening filter panel
            mobileMenu.classList.remove('active');
        });
    }
    
    if (filterClose) {
        filterClose.addEventListener('click', closeFilterPanel);
    }
    
    if (filterOverlay) {
        filterOverlay.addEventListener('click', closeFilterPanel);
    }
    
    // Range slider functionality
    if (sizeRange) {
        sizeRange.addEventListener('input', function() {
            console.log('Selected size:', this.value + ' sq. ft.');
        });
    }
    
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            console.log('Selected price:', this.value + ' INR');
        });
    }
    
    // Open modal when brochure button is clicked (desktop version)
    brochureBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        // Reset to step 1 when opening
        showStep(1);
        resetForm();
    });
    
    // Open modal when mobile brochure button is clicked
    if (mobileBrochureBtn) {
        mobileBrochureBtn.addEventListener('click', function() {
            modal.style.display = 'block';
            // Hide mobile menu when opening modal
            document.querySelector('.mobile-menu').classList.remove('active');
            // Reset to step 1 when opening
            showStep(1);
            resetForm();
        });
    }
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Move to form when request button is clicked
    requestButton.addEventListener('click', function() {
        showStep(2);
    });
    
    // Back button functionality
    backToStep1Btn.addEventListener('click', function() {
        showStep(1);
    });
    
    // Form submission handling
    brochureForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        resetErrors();
        
        // Validate form
        if (validateForm()) {
            // Instead of Google Sheets, use FormSubmit
            submitToFormSubmit();
        }
    });
    
    // Function to open filter panel
    function openFilterPanel() {
        if (filterPanel) {
            filterPanel.classList.add('open');
        }
        if (filterOverlay) {
            filterOverlay.style.display = 'block';
        }
    }
    
    // Function to close filter panel
    function closeFilterPanel() {
        if (filterPanel) {
            filterPanel.classList.remove('open');
        }
        if (filterOverlay) {
            filterOverlay.style.display = 'none';
        }
    }
    
    // Function to set up video views
    function setupVideoViews() {
        const videoContainer = document.querySelector('.video-container');
        const backgroundVideo = document.getElementById('background-video');
        
        // Store original video source
        const originalVideoSrc = backgroundVideo ? backgroundVideo.querySelector('source').src : 'assets/dubai-background.mp4';
        
        // Clear video container
        const controlsElements = videoContainer.innerHTML;
        videoContainer.innerHTML = '';
        
        // Create first view with original video
        const view1 = document.createElement('div');
        view1.className = 'video-view active';
        view1.id = 'view1';
        view1.innerHTML = `
            <video autoplay muted loop id="background-video-1" class="background-video">
                <source src="${originalVideoSrc}" type="video/mp4">
            </video>
        `;
        
        // Create second view with new video
        const view2 = document.createElement('div');
        view2.className = 'video-view';
        view2.id = 'view2';
        view2.innerHTML = `
            <video autoplay muted loop id="background-video-2" class="background-video">
                <source src="assets/dubai-alternative-view.mp4" type="video/mp4">
            </video>
        `;
        
        // Add views to container
        videoContainer.appendChild(view1);
        videoContainer.appendChild(view2);
        
        // Add back the controls and other elements
        const controlsContainer = document.createElement('div');
        controlsContainer.innerHTML = controlsElements;
        
        // Get all direct child nodes except videos
        const childNodes = Array.from(controlsContainer.childNodes);
        childNodes.forEach(node => {
            if (node.id !== 'background-video' && node.nodeType === 1) {
                videoContainer.appendChild(node.cloneNode(true));
            }
        });
    }
    
    // Function to toggle between video views
    function toggleView() {
        const view1 = document.getElementById('view1');
        const view2 = document.getElementById('view2');
        const video1 = document.getElementById('background-video-1');
        const video2 = document.getElementById('background-video-2');
        
        if (currentView === 1) {
            // Switch to view 2
            view1.classList.remove('active');
            view2.classList.add('active');
            
            // Apply transition animations
            view1.classList.add('fade-out');
            view2.classList.add('fade-in');
            
            // Make sure the video is playing
            if (video2) video2.play();
            
            // Set current view
            currentView = 2;
        } else {
            // Switch to view 1
            view2.classList.remove('active');
            view1.classList.add('active');
            
            // Apply transition animations
            view2.classList.add('fade-out');
            view1.classList.add('fade-in');
            
            // Make sure the video is playing
            if (video1) video1.play();
            
            // Set current view
            currentView = 1;
        }
        
        // Remove animation classes after transition completes
        setTimeout(() => {
            view1.classList.remove('fade-in', 'fade-out');
            view2.classList.remove('fade-in', 'fade-out');
        }, 1000);
    }
    
    // Function to show specific step in brochure modal
    function showStep(stepNumber) {
        step1.style.display = 'none';
        step2.style.display = 'none';
        step3.style.display = 'none';
        
        if (stepNumber === 1) {
            step1.style.display = 'block';
        } else if (stepNumber === 2) {
            step2.style.display = 'block';
        } else if (stepNumber === 3) {
            step3.style.display = 'block';
        }
    }
    
    // Reset form fields and errors
    function resetForm() {
        brochureForm.reset();
        resetErrors();
    }
    
    // Reset error messages
    function resetErrors() {
        nameError.textContent = '';
        mobileError.textContent = '';
        emailError.textContent = '';
    }
    
    // Validate form inputs
    function validateForm() {
        let isValid = true;
        
        // Validate name (at least 2 characters)
        if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Please enter a valid name (at least 2 characters)';
            isValid = false;
        }
        
        // Validate mobile number (numbers only, 10-15 digits)
        const mobileRegex = /^\d{10,15}$/;
        if (!mobileRegex.test(mobileInput.value.trim())) {
            mobileError.textContent = 'Please enter a valid mobile number (10-15 digits)';
            isValid = false;
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        return isValid;
    }
    
    // Submit data using FormSubmit
    function submitToFormSubmit() {
        // Create a new hidden form
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://formsubmit.co/kicha2003e@gmail.com'; // Replace with your email
        
        // Add form fields
        const fields = {
            name: nameInput.value.trim(),
            mobile: mobileInput.value.trim(),
            email: emailInput.value.trim(),
            brochure: 'Park Tower Dubai Brochure',
            timestamp: new Date().toISOString(),
            _subject: 'New Brochure Request',
            _captcha: 'false',
            _next: window.location.href // Stay on the same page
        };
        
        // Add the fields to the hidden form
        Object.keys(fields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = fields[key];
            hiddenForm.appendChild(input);
        });
        
        // Add form to body, submit it, and remove it
        document.body.appendChild(hiddenForm);
        
        // Store data in localStorage before submitting
        // This ensures we know the user submitted the form even after redirect
        localStorage.setItem('brochureRequested', 'true');
        
        // Submit the form
        hiddenForm.submit();
        
        // Show success immediately, since FormSubmit will redirect
        showStep(3);
    }
    
    // Check if user is returning from FormSubmit submission
    if (localStorage.getItem('brochureRequested') === 'true') {
        // Clear the flag
        localStorage.removeItem('brochureRequested');
        // Show the success state
        modal.style.display = 'block';
        showStep(3);
    }
    
    // ============= SVG OVERLAY FUNCTIONALITY =============
    
    // Create SVG overlay container if it doesn't exist
    if (!document.getElementById('floor-plan-overlay')) {
        const videoContainer = document.querySelector('.video-container');
        const overlayContainer = document.createElement('div');
        overlayContainer.id = 'floor-plan-overlay';
        overlayContainer.className = 'floor-plan-overlay';
        
        // Create SVG with the building outline and floor layout
        // The viewBox is set to match the dimensions of the video/image
        overlayContainer.innerHTML = `
            <svg id="building-overlay" viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg">
                <!-- Main Building Structure - the tall black/white building in the center -->
                <g id="building-structure">
                    <!-- Building outline - don't show this normally -->
                    <path d="M450,150 L550,150 L550,500 L450,500 Z" 
                        fill="none" stroke="#ffffff" stroke-width="1" opacity="0.2"/>
                </g>
                
                <!-- Floor overlays will be added here -->
                <g id="floor-overlays"></g>
                
                <!-- Floor numbers for reference -->
                <g id="floor-numbers" class="floor-labels"></g>
            </svg>
            <div class="unit-info-box">
                <h3>Selected Units</h3>
                <div class="unit-details">
                    <p class="unit-type">Select a unit type</p>
                    <p class="floor-info"></p>
                    <p class="unit-size"></p>
                    <p class="unit-price"></p>
                    <p class="availability"></p>
                </div>
                <button class="close-overlay">Close</button>
            </div>
        `;
        videoContainer.appendChild(overlayContainer);
        
        // Add event listener to close button
        const closeOverlayBtn = overlayContainer.querySelector('.close-overlay');
        closeOverlayBtn.addEventListener('click', function() {
            overlayContainer.classList.remove('active');
        });

        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('close-overlay')) {
                document.getElementById('floor-plan-overlay').classList.remove('active');
            }
        });
    }

    // Define the floors and their properties
    const totalFloors = 20; // Adjust based on your actual building
    const floorHeight = 16; // Height of each floor in SVG units
    const buildingBase = 400; // Y-coordinate of building base
    const buildingWidth = 100; // Width of building in SVG units
    const buildingLeft = 450; // Left edge of building

    // Define unit types and their properties
    const unitTypes = {
        'Studio': {
            color: 'rgba(255,165,0,0.7)', // Orange
            size: '400-500 sq. ft.',
            price: 'AED 650,000 - 800,000',
            floors: [1, 2, 3, 4, 5, 6], // Floors that have studio units
            availability: {
                'Available': [1, 2, 3, 4],
                'Unavailable': [5, 6]
            }
        },
        '1 BHK': {
            color: 'rgba(255,0,0,0.7)', // Red
            size: '650-850 sq. ft.',
            price: 'AED 950,000 - 1,250,000',
            floors: [7, 8, 9, 10, 11], // Floors that have 1 BHK units
            availability: {
                'Available': [7, 8, 9],
                'Unavailable': [10, 11]
            }
        },
        '2 BHK': {
            color: 'rgba(0,0,255,0.7)', // Blue
            size: '950-1200 sq. ft.',
            price: 'AED 1,350,000 - 1,750,000',
            floors: [12, 13, 14], // Floors that have 2 BHK units
            availability: {
                'Available': [12],
                'Unavailable': [13, 14]
            }
        },
        '3 BHK': {
            color: 'rgba(0,128,0,0.7)', // Green
            size: '1200-1600 sq. ft.',
            price: 'AED 1,850,000 - 2,500,000',
            floors: [15, 16, 17, 18, 19, 20], // Floors that have 3 BHK units
            availability: {
                'Available': [15, 16, 17],
                'Unavailable': [18, 19, 20]
            }
        }
    };

    // Cache filter selection elements
    const unitTypeSelect = document.querySelector('.filters select:nth-of-type(1)');
    const furnishingSelect = document.querySelector('.filters select:nth-of-type(2)');
    const availabilitySelect = document.querySelector('.filters select:nth-of-type(3)');
    const conditionSelect = document.querySelector('.filters select:nth-of-type(4)');
    
    // Add change event listeners to filter selects for dynamic updating
    if (unitTypeSelect) {
        unitTypeSelect.addEventListener('change', applyDynamicFilters);
    }
    
    if (availabilitySelect) {
        availabilitySelect.addEventListener('change', applyDynamicFilters);
    }
    
    // Keep the apply filters button for users who prefer to click it
    const applyFiltersBtn = document.querySelector('.apply-filters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyDynamicFilters();
            closeFilterPanel();
        });
    }

    // Function to apply filters dynamically based on current selections
    function applyDynamicFilters() {
        // Get selected values
        const selectedUnitType = unitTypeSelect ? unitTypeSelect.value : 'Studio';
        const selectedAvailability = availabilitySelect ? availabilitySelect.value : 'Available';
        
        // Apply filters to highlight appropriate floors
        highlightFloors(selectedUnitType, selectedAvailability);
    }

    // Function to highlight floors based on unit type and availability
    function highlightFloors(unitType, availability = 'Available') {
        const overlayContainer = document.getElementById('floor-plan-overlay');
        const floorOverlays = document.getElementById('floor-overlays');
        const floorNumbers = document.getElementById('floor-numbers');
        const unitInfo = document.querySelector('.unit-info-box');
        const unitTypeText = unitInfo.querySelector('.unit-type');
        const floorInfo = unitInfo.querySelector('.floor-info');
        const unitSize = unitInfo.querySelector('.unit-size');
        const unitPrice = unitInfo.querySelector('.unit-price');
        const availabilityText = unitInfo.querySelector('.availability');
        
        // Clear existing overlays
        floorOverlays.innerHTML = '';
        floorNumbers.innerHTML = '';
        
        // Get unit type definition
        const unitDef = unitTypes[unitType];
        
        if (unitDef) {
            // Get floors based on availability
            let floorsToShow = [];
            
            if (availability === 'Available' || availability === 'Unavailable') {
                floorsToShow = unitDef.availability[availability] || [];
            } else {
                // If 'All' or any other value, show all floors
                floorsToShow = unitDef.floors;
            }
            
            // Add floor numbers and highlights
            floorsToShow.forEach(floorNum => {
                // Calculate floor position from bottom of building
                const floorY = buildingBase - (floorNum * floorHeight);
                
                // Create floor highlight with different opacity based on availability
                const floorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                floorRect.setAttribute('x', buildingLeft);
                floorRect.setAttribute('y', floorY);
                floorRect.setAttribute('width', buildingWidth);
                floorRect.setAttribute('height', floorHeight);
                floorRect.setAttribute('fill', unitDef.color);
                floorRect.setAttribute('stroke', '#ffffff');
                floorRect.setAttribute('stroke-width', '1');
                floorRect.setAttribute('data-floor', floorNum);
                floorRect.setAttribute('data-unit-type', unitType);
                floorRect.setAttribute('data-availability', availability);
                floorRect.classList.add('floor-highlight');
                
                // Add pulse animation for available units only
                if (availability === 'Available') {
                    floorRect.innerHTML = `
                        <animate attributeName="opacity" 
                                values="0.8;1;0.8" 
                                dur="2s" 
                                repeatCount="indefinite" />
                    `;
                } else {
                    // Make unavailable units more transparent
                    floorRect.setAttribute('opacity', '0.5');
                }
                
                // Add floor to overlays
                floorOverlays.appendChild(floorRect);
                
                // Add floor number label
                const floorLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                floorLabel.setAttribute('x', buildingLeft - 25);
                floorLabel.setAttribute('y', floorY + (floorHeight / 2) + 5);
                floorLabel.setAttribute('fill', '#ffffff');
                floorLabel.setAttribute('stroke', '#000000');
                floorLabel.setAttribute('stroke-width', '0.5');
                floorLabel.setAttribute('font-size', '12');
                floorLabel.textContent = `FL ${floorNum}`;
                floorNumbers.appendChild(floorLabel);
                
                // Add click event to floor rectangle
                floorRect.addEventListener('click', function() {
                    // Highlight selected floor
                    document.querySelectorAll('.floor-highlight').forEach(f => {
                        f.setAttribute('stroke-width', '1');
                    });
                    this.setAttribute('stroke-width', '3');
                    
                    // Update info box with floor-specific details
                    unitInfo.querySelector('.floor-info').textContent = `Floor: ${floorNum}`;
                    unitInfo.querySelector('.availability').textContent = `Status: ${availability}`;
                    unitInfo.classList.add('expanded');
                });
            });
            
            // Update unit info
            unitTypeText.textContent = `Type: ${unitType}`;
            floorInfo.textContent = `Floors: ${floorsToShow.join(', ')}`;
            unitSize.textContent = `Size: ${unitDef.size}`;
            unitPrice.textContent = `Price: ${unitDef.price}`;
            availabilityText.textContent = `Status: ${availability}`;
            
            // Show overlay
            overlayContainer.classList.add('active');
        }
    }

    // Function to display all available floor types
    function showAllUnits() {
        // Clear existing overlays
        const floorOverlays = document.getElementById('floor-overlays');
        const floorNumbers = document.getElementById('floor-numbers');
        
        floorOverlays.innerHTML = '';
        floorNumbers.innerHTML = '';
        
        // Get availability filter value
        const selectedAvailability = availabilitySelect ? availabilitySelect.value : 'Available';
        
        // Highlight each unit type with its own color
        Object.keys(unitTypes).forEach(unitType => {
            const unitDef = unitTypes[unitType];
            
            // Filter floors based on availability
            let floorsToShow = [];
            
            if (selectedAvailability === 'Available' || selectedAvailability === 'Unavailable') {
                floorsToShow = unitDef.availability[selectedAvailability] || [];
            } else {
                // If 'All' or any other value, show all floors
                floorsToShow = unitDef.floors;
            }
            
            floorsToShow.forEach(floorNum => {
                // Calculate floor position
                const floorY = buildingBase - (floorNum * floorHeight);
                
                // Create floor highlight
                const floorRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                floorRect.setAttribute('x', buildingLeft);
                floorRect.setAttribute('y', floorY);
                floorRect.setAttribute('width', buildingWidth);
                floorRect.setAttribute('height', floorHeight);
                floorRect.setAttribute('fill', unitDef.color);
                floorRect.setAttribute('stroke', '#ffffff');
                floorRect.setAttribute('stroke-width', '1');
                floorRect.setAttribute('data-floor', floorNum);
                floorRect.setAttribute('data-unit-type', unitType);
                floorRect.setAttribute('data-availability', selectedAvailability);
                floorRect.classList.add('floor-highlight');
                
                // Add pulse animation for available units only
                if (selectedAvailability === 'Available') {
                    floorRect.innerHTML = `
                        <animate attributeName="opacity" 
                                values="0.8;1;0.8" 
                                dur="2s" 
                                repeatCount="indefinite" />
                    `;
                } else {
                    // Make unavailable units more transparent
                    floorRect.setAttribute('opacity', '0.5');
                }
                
                // Add floor to overlays
                floorOverlays.appendChild(floorRect);
                
                // Add floor number label
                const floorLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                floorLabel.setAttribute('x', buildingLeft - 25);
                floorLabel.setAttribute('y', floorY + (floorHeight / 2) + 5);
                floorLabel.setAttribute('fill', '#ffffff');
                floorLabel.setAttribute('stroke', '#000000');
                floorLabel.setAttribute('stroke-width', '0.5');
                floorLabel.setAttribute('font-size', '12');
                floorLabel.textContent = `FL ${floorNum}`;
                floorNumbers.appendChild(floorLabel);
            });
        });
        
        // Show overlay
        document.getElementById('floor-plan-overlay').classList.add('active');
        
        // Update info box
        const unitInfo = document.querySelector('.unit-info-box');
        unitInfo.querySelector('.unit-type').textContent = 'All Unit Types';
        unitInfo.querySelector('.floor-info').textContent = 'Select a floor for details';
        unitInfo.querySelector('.unit-size').textContent = '';
        unitInfo.querySelector('.unit-price').textContent = '';
        unitInfo.querySelector('.availability').textContent = `Status: ${selectedAvailability}`;
    }

    // Add a "Show All Units" button to the filter panel
    function addShowAllButton() {
        const filtersContainer = document.querySelector('.filters');
        
        if (filtersContainer && !document.getElementById('show-all-units')) {
            const showAllButton = document.createElement('button');
            showAllButton.id = 'show-all-units';
            showAllButton.className = 'show-all-button';
            showAllButton.textContent = 'Show All Units';
            showAllButton.addEventListener('click', function() {
                showAllUnits();
                closeFilterPanel();
            });
            
            filtersContainer.appendChild(showAllButton);
        }
    }

    // Call this function to add the "Show All" button
    addShowAllButton();

    // Setup interaction for floor highlights
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('floor-highlight')) {
            const floorNum = e.target.getAttribute('data-floor');
            const unitType = e.target.getAttribute('data-unit-type');
            const availability = e.target.getAttribute('data-availability');
            
            // Update info with selected floor details
            const unitInfo = document.querySelector('.unit-info-box');
            unitInfo.querySelector('.unit-type').textContent = `Type: ${unitType}`;
            unitInfo.querySelector('.floor-info').textContent = `Floor: ${floorNum}`;
            unitInfo.querySelector('.unit-size').textContent = `Size: ${unitTypes[unitType].size}`;
            unitInfo.querySelector('.unit-price').textContent = `Price: ${unitTypes[unitType].price}`;
            unitInfo.querySelector('.availability').textContent = `Status: ${availability}`;
            
            // Highlight selected floor
            document.querySelectorAll('.floor-highlight').forEach(f => {
                f.setAttribute('stroke-width', '1');
            });
            e.target.setAttribute('stroke-width', '3');
            
            unitInfo.classList.add('expanded');
        }
    });
    
    // // Initialize with default values
    // // Wait a bit to make sure all elements are loaded
    // setTimeout(() => {
    //     if (unitTypeSelect && availabilitySelect) {
    //         applyDynamicFilters();
    //     }
    // }, 500);
});