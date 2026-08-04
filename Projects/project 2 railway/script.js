document.addEventListener("DOMContentLoaded", () => {
    // Structural DOM binding maps matching multi-step layouts
    const seatingMatrix = document.getElementById("seating-matrix");
    const selectedSeatsContainer = document.getElementById("selected-seats-container");
    const emptyStateMsg = document.getElementById("empty-state-msg");
    const basePriceEl = document.getElementById("base-price");
    const dynamicFeeEl = document.getElementById("dynamic-fee");
    const grandTotalEl = document.getElementById("grand-total");
    
    // Multi-page Wizard elements selection mapping identifiers
    const bookNowBtn = document.getElementById("book-now-btn");
    const backWizardBtn = document.getElementById("back-wizard-btn");
    const btnText = document.getElementById("btn-text");
    const btnIcon = document.getElementById("btn-icon");
    const liveUsersText = document.getElementById("live-users-text");
    const receiptSuccessBlock = document.getElementById("receipt-success-block");
    const receiptDetailsOutput = document.getElementById("receipt-details-output");

    // Array objects mapping step workspaces route items
    const pages = [
        document.getElementById("page-1-workspace"),
        document.getElementById("page-2-workspace"),
        document.getElementById("page-3-workspace")
    ];
    const stepsIndicators = [
        document.getElementById("step-1-indicator"),
        document.getElementById("step-2-indicator"),
        document.getElementById("step-3-indicator")
    ];

    let currentPageIdx = 0;
    let selectedSeats = [];

    // Layout configuration matrices definitions
    const ROWS = 8;
    const COLS = 10;
    const BASE_VIP_PRICE = 500;
    const BASE_PREMIUM_PRICE = 350;
    const BASE_STANDARD_PRICE = 200;

    // Phase 1 initialization script logic rules
    function initSeatingGrid() {
        for (let r = 0; r < ROWS; r++) {
            const rowLabel = String.fromCharCode(65 + r);
            for (let c = 1; c <= COLS; c++) {
                const seatElement = document.createElement("div");
                const seatCode = `${rowLabel}${c}`;
                
                seatElement.classList.add("seat-node");
                seatElement.innerText = seatCode;
                seatElement.dataset.code = seatCode;

                let baseCost = BASE_STANDARD_PRICE;
                if (r < 2) baseCost = BASE_VIP_PRICE;
                else if (r >= 2 && r < 5) baseCost = BASE_PREMIUM_PRICE;
                seatElement.dataset.price = baseCost;

                const isReservedSimulated = Math.random() < 0.25;
                if (isReservedSimulated) {
                    seatElement.classList.add("reserved");
                } else {
                    seatElement.classList.add("available");
                    seatElement.addEventListener("click", () => handleSeatToggle(seatElement));
                }
                seatingMatrix.appendChild(seatElement);
            }
        }
    }

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

        selectedSeatsContainer.innerHTML = "";
        let subtotal = 0;

        selectedSeats.forEach(seat => {
            subtotal += seat.price;
            const badge = document.createElement("span");
            badge.classList.add("ticket-badge-node");
            badge.innerHTML = `<i class="fa-solid fa-couch"></i> ${seat.code} <span style="opacity:0.6; margin-left:4px;">₹${seat.price}</span>`;
            selectedSeatsContainer.appendChild(badge);
        });

        const dynamicFee = subtotal * 0.10;
        const finalGrandTotal = subtotal + dynamicFee;

        basePriceEl.innerText = `₹${subtotal.toFixed(2)}`;
        dynamicFeeEl.innerText = `₹${dynamicFee.toFixed(2)}`;
        grandTotalEl.innerText = `₹${finalGrandTotal.toFixed(2)}`;
    }

    // Step Routing Wizard Pipeline Engine Implementation
    function navigateToPage(targetIdx) {
        pages[currentPageIdx].classList.remove("active");
        stepsIndicators[currentPageIdx].classList.remove("active");

        currentPageIdx = targetIdx;

        pages[currentPageIdx].classList.add("active");
        stepsIndicators[currentPageIdx].classList.add("active");

        // UI button layout transformation states mapping to context pages
        if (currentPageIdx === 0) {
            backWizardBtn.classList.add("hidden");
            btnText.innerText = "Proceed to Next Step";
            btnIcon.className = "fa-solid fa-arrow-right";
        } else if (currentPageIdx === 1) {
            backWizardBtn.classList.remove("hidden");
            btnText.innerText = "Proceed to Payment";
            btnIcon.className = "fa-solid fa-credit-card";
        } else if (currentPageIdx === 2) {
            backWizardBtn.classList.remove("hidden");
            btnText.innerText = "Authorize & Pay Now";
            btnIcon.className = "fa-solid fa-lock";
        }
    }

    // Interactive button routing listeners setup framework
    bookNowBtn.addEventListener("click", () => {
        if (currentPageIdx < 2) {
            navigateToPage(currentPageIdx + 1);
        } else {
            // Execution trigger pipeline phase matching final success actions
            executeFinalPaymentSimulation();
        }
    });

    backWizardBtn.addEventListener("click", () => {
        if (currentPageIdx > 0) {
            navigateToPage(currentPageIdx - 1);
            receiptSuccessBlock.style.display = "none";
            bookNowBtn.classList.remove("hidden");
        }
    });

    function executeFinalPaymentSimulation() {
        // Collect variables values mapping input DOM text nodes objects
        const name = document.getElementById("input-fullname").value;
        const email = document.getElementById("input-email").value;
        const totalAmount = grandTotalEl.innerText;
        const seatCodes = selectedSeats.map(s => s.code).join(", ");

        // Lock button actions and render success receipt structures
        bookNowBtn.classList.add("hidden");
        backWizardBtn.classList.add("hidden");
        receiptSuccessBlock.style.display = "block";

        receiptDetailsOutput.innerHTML = `
            <div><strong>Attendee Account:</strong> ${name} (${email})</div>
            <div><strong>Allocated Gateway Access:</strong> ${seatCodes}</div>
            <div><strong>Settled Amount Gross:</strong> ${totalAmount}</div>
            <div><strong>Security Profile:</strong> Dynamic Ticket Authenticated via Git Workflow Pipeline</div>
        `;

        // Clear seating selections interface status flags seamlessly
        document.querySelectorAll(".seat-node.selected").forEach(s => {
            s.classList.remove("selected");
            s.classList.add("reserved");
            s.replaceWith(s.cloneNode(true));
        });
        selectedSeats = [];
        updateCheckoutCalculations();
    }

    // Setup active concurrency simulation engines variables values
    setInterval(() => {
        const randomCount = Math.floor(Math.random() * (640 - 580 + 1)) + 580;
        if (liveUsersText) {
            liveUsersText.innerHTML = `<i class="fa-solid fa-users"></i> ${randomCount} users active live`;
        }
    }, 3000);

    // Interactive Payment Type Cards selector toggle engine logic mapping
    document.querySelectorAll(".pay-method-card").forEach(card => {
        card.addEventListener("click", () => {
            document.querySelectorAll(".pay-method-card").forEach(c => c.classList.remove("active"));
            card.classList.add("active");
        });
    });

    // Execute application structural initializations
    initSeatingGrid();
});