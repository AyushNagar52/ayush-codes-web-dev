document.addEventListener("DOMContentLoaded", () => {
    // Exact structural binding to DOM IDs mapping standard targets
    const seatingMatrix = document.getElementById("seating-matrix");
    const selectedSeatsContainer = document.getElementById("selected-seats-container");
    const emptyStateMsg = document.getElementById("empty-state-msg");
    const basePriceEl = document.getElementById("base-price");
    const dynamicFeeEl = document.getElementById("dynamic-fee");
    const grandTotalEl = document.getElementById("grand-total");
    const bookNowBtn = document.getElementById("book-now-btn");
    const liveUsersText = document.getElementById("live-users-text");

    // Grid Dimensions Layout Configuration
    const ROWS = 8;
    const COLS = 10;
    
    // Track State Arrays
    let selectedSeats = [];

    // Structural Price Configurations based on Location
    const BASE_VIP_PRICE = 500;
    const BASE_PREMIUM_PRICE = 350;
    const BASE_STANDARD_PRICE = 200;

    // Initialize Grid Elements and Inject to DOM Matrix
    function initSeatingGrid() {
        for (let r = 0; r < ROWS; r++) {
            const rowLabel = String.fromCharCode(65 + r); // A, B, C...
            
            for (let c = 1; c <= COLS; c++) {
                const seatElement = document.createElement("div");
                const seatCode = `${rowLabel}${c}`;
                
                // Class connection setting layout rules mapping to CSS definitions
                seatElement.classList.add("seat-node");
                
                // Internal properties mapping target calculation keys
                seatElement.innerText = seatCode;
                seatElement.dataset.code = seatCode;

                // Allocate variable ticket pricing baseline weights
                let baseCost = BASE_STANDARD_PRICE;
                if (r < 2) baseCost = BASE_VIP_PRICE;
                else if (r >= 2 && r < 5) baseCost = BASE_PREMIUM_PRICE;
                
                seatElement.dataset.price = baseCost;

                // Distribute layout flags matching mock allocations
                const isReservedSimulated = Math.random() < 0.25;

                if (isReservedSimulated) {
                    seatElement.classList.add("reserved");
                } else {
                    seatElement.classList.add("available");
                    // Interactive runtime toggle engine attachment
                    seatElement.addEventListener("click", () => handleSeatToggle(seatElement));
                }

                seatingMatrix.appendChild(seatElement);
            }
        }
    }

    // Process Active Node Toggles 
    function handleSeatToggle(seatElement) {
        const seatCode = seatElement.dataset.code;
        const seatPrice = parseFloat(seatElement.dataset.price);

        if (seatElement.classList.contains("selected")) {
            seatElement.classList.remove("selected");
            seatElement.classList.add("available");
            selectedSeats = selectedSeats.filter(item => item.code !== seatCode);
        } else {
            seatElement.classList.remove("available");
            seatElement.classList.add("selected");
            selectedSeats.push({ code: seatCode, price: seatPrice });
        }

        updateCheckoutCalculations();
    }

    // Live Aggregation Engine Parsing Current Selections Matrix
    function updateCheckoutCalculations() {
        if (selectedSeats.length === 0) {
            emptyStateMsg.style.display = "block";
            selectedSeatsContainer.style.display = "none";
            bookNowBtn.disabled = true;
        } else {
            emptyStateMsg.style.display = "none";
            selectedSeatsContainer.style.display = "flex";
            bookNowBtn.disabled = false;
        }

        // Clean out old nodes before mapping updated dataset configurations
        selectedSeatsContainer.innerHTML = "";
        let subtotal = 0;

        selectedSeats.forEach(seat => {
            subtotal += seat.price;
            const badge = document.createElement("span");
            
            // Connect badge layout securely to class node declared in CSS file
            badge.classList.add("ticket-badge-node");
            badge.innerHTML = `<i class="fa-solid fa-couch"></i> ${seat.code} <span style="opacity:0.6; margin-left: 4px;">₹${seat.price}</span>`;
            selectedSeatsContainer.appendChild(badge);
        });

        // Compute dynamic system variables adjustments rules
        const dynamicFee = subtotal * 0.10;
        const finalGrandTotal = subtotal + dynamicFee;

        // Populate innerText structures securely using targeted element IDs
        basePriceEl.innerText = `₹${subtotal.toFixed(2)}`;
        dynamicFeeEl.innerText = `₹${dynamicFee.toFixed(2)}`;
        grandTotalEl.innerText = `₹${finalGrandTotal.toFixed(2)}`;
    }

    // Active Concurrency Simulation Algorithm (Updates text nodes mapping standard intervals)
    function startLiveTrafficSimulator() {
        setInterval(() => {
            const randomCount = Math.floor(Math.random() * (640 - 580 + 1)) + 580;
            liveUsersText.innerHTML = `<i class="fa-solid fa-users"></i> ${randomCount} users active live`;
        }, 3000);
    }

    // Checkout Pipeline Execution Mock Action
    bookNowBtn.addEventListener("click", () => {
        alert(`Successfully secured ${selectedSeats.length} ticket(s)! Processing transaction pipeline...`);
        
        // Loop structural state elements to switch selections into locked reserved rows
        document.querySelectorAll(".seat-node.selected").forEach(s => {
            s.classList.remove("selected");
            s.classList.add("reserved");
            
            // Remove selection listeners cleanly by swapping structural references
            const detachedClone = s.cloneNode(true);
            s.replaceWith(detachedClone);
        });
        
        selectedSeats = [];
        updateCheckoutCalculations();
    });

    // Run core engine setups
    initSeatingGrid();
    startLiveTrafficSimulator();
});