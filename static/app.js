// Interactive client-side logic for RecallOps Sandbox

document.addEventListener("DOMContentLoaded", () => {
    // Header Controls
    const btnSeed = document.getElementById("btn-seed");
    const btnIngestReal = document.getElementById("btn-ingest-real");
    const btnReset = document.getElementById("btn-reset");
    const btnApplyFix = document.getElementById("btn-apply-fix");
    const stepSearch = document.getElementById("step-search");
    const memoryStatus = document.getElementById("memory-status");
    const alertsUnseededMsg = document.getElementById("alerts-unseeded-msg");
    const alertsList = document.getElementById("alerts-list");

    // Graph elements
    const graphPlaceholder = document.getElementById("graph-placeholder");
    const graphSvg = document.getElementById("graph-svg");
    const linksGroup = document.getElementById("links-group");
    const nodesGroup = document.getElementById("nodes-group");
    
    // Checkbox elements
    const checks = [
        document.getElementById("check-1"),
        document.getElementById("check-2"),
        document.getElementById("check-3"),
        document.getElementById("check-4")
    ];

    // Hook up header buttons
    if (btnSeed) {
        btnSeed.addEventListener("click", async () => {
            btnSeed.disabled = true;
            btnSeed.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Seeding...`;
            try {
                const res = await fetch("/api/seed", { method: "POST" });
                const data = await res.json();
                if (res.ok) {
                    showToast(data.message, "success");
                    updateMemoryStatus(true, "Historical");
                } else {
                    showToast(data.detail || "Seeding failed", "error");
                }
            } catch (err) {
                showToast("Could not contact server", "error");
            }
            btnSeed.disabled = false;
            btnSeed.innerHTML = `<i class="fa-solid fa-database"></i> Seed Memory`;
        });
    }

    if (btnIngestReal) {
        btnIngestReal.addEventListener("click", async () => {
            btnIngestReal.disabled = true;
            btnIngestReal.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Ingesting...`;
            try {
                const res = await fetch("/api/ingest_real", { method: "POST" });
                const data = await res.json();
                if (res.ok) {
                    showToast(data.message, "success");
                    updateMemoryStatus(true, "Real (Local Files)");
                } else {
                    showToast(data.detail || "Ingestion failed", "error");
                }
            } catch (err) {
                showToast("Could not contact server", "error");
            }
            btnIngestReal.disabled = false;
            btnIngestReal.innerHTML = `<i class="fa-solid fa-cloud-arrow-down"></i> Ingest Real Data`;
        });
    }

    if (btnReset) {
        btnReset.addEventListener("click", async () => {
            btnReset.disabled = true;
            try {
                const res = await fetch("/api/reset", { method: "POST" });
                const data = await res.json();
                if (res.ok) {
                    showToast("State reset completed", "info");
                    updateMemoryStatus(false, "Unseeded");
                    resetConsoleState();
                }
            } catch (err) {
                showToast("Could not contact server", "error");
            }
            btnReset.disabled = false;
        });
    }

    function updateMemoryStatus(seeded, label) {
        if (memoryStatus) {
            if (seeded) {
                memoryStatus.className = "status-badge seeded";
                memoryStatus.querySelector(".status-label").textContent = `Memory: ${label}`;
                if (alertsUnseededMsg) alertsUnseededMsg.style.display = "none";
                if (alertsList) {
                    alertsList.classList.remove("hidden");
                    alertsList.style.display = "block";
                    loadAlertsList();
                }
            } else {
                memoryStatus.className = "status-badge unseeded";
                memoryStatus.querySelector(".status-label").textContent = "Memory: Unseeded";
                if (alertsUnseededMsg) alertsUnseededMsg.style.display = "block";
                if (alertsList) {
                    alertsList.classList.add("hidden");
                    alertsList.style.display = "none";
                }
            }
        }
    }

    async function loadAlertsList() {
        if (!alertsList) return;
        try {
            const res = await fetch("/api/alerts");
            const data = await res.json();
            if (data.alerts) {
                alertsList.innerHTML = "";
                data.alerts.forEach(alert => {
                    const alertDiv = document.createElement("div");
                    alertDiv.className = `alert-item severity-${alert.severity.toLowerCase()}`;
                    alertDiv.innerHTML = `
                        <div class="alert-item-header">
                            <span class="alert-id">${alert.id}</span>
                            <span class="alert-service">${alert.service}</span>
                        </div>
                        <div class="alert-item-title">${alert.title}</div>
                        <div class="alert-item-meta">${alert.symptoms}</div>
                    `;
                    // Hook up diagnostic click
                    alertDiv.addEventListener("click", () => runRealTraverseAndDiagnose(alert.id));
                    alertsList.appendChild(alertDiv);
                });
                const countBadge = document.getElementById("active-alert-count");
                if (countBadge) countBadge.textContent = data.alerts.length;
            }
        } catch (err) {
            console.error("Failed to load alerts:", err);
        }
    }

    async function runRealTraverseAndDiagnose(alertId) {
        // Trigger diagnostic loaders on right panel
        const welcomeState = document.getElementById("copilot-welcome");
        const loadingState = document.getElementById("copilot-loading");
        const resultsState = document.getElementById("copilot-results");
        
        if (welcomeState) welcomeState.classList.add("hidden");
        if (loadingState) loadingState.classList.remove("hidden");
        
        try {
            const res = await fetch("/api/diagnose", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ alert_id: alertId })
            });
            const data = await res.json();
            if (res.ok) {
                // Hide loaders
                if (loadingState) loadingState.classList.add("hidden");
                if (resultsState) resultsState.classList.remove("hidden");
                
                // Populate results
                document.getElementById("res-alert-id").textContent = data.alert.id;
                document.getElementById("res-alert-title").textContent = data.alert.title;
                document.getElementById("res-upstream-service").textContent = data.alert.service;
                document.getElementById("res-confidence-text").textContent = `${data.confidence}%`;
                document.getElementById("res-confidence-bar").style.width = `${data.confidence}%`;
                document.getElementById("res-root-cause").textContent = data.diagnosis;
                
                // Populate checklist
                const checklist = document.getElementById("res-remediation-checklist");
                checklist.innerHTML = "";
                data.checklist.forEach((step, idx) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<label><input type="checkbox" id="check-${idx+1}"> <span>${step}</span></label>`;
                    checklist.appendChild(li);
                });
                
                // Populate recalled
                const recalledList = document.getElementById("res-recalled-list");
                recalledList.innerHTML = "";
                document.getElementById("res-recalled-count").textContent = data.recalled_incidents.length;
                data.recalled_incidents.forEach(inc => {
                    const div = document.createElement("div");
                    div.className = "recalled-item";
                    div.innerHTML = `
                        <div class="recalled-header">
                            <span class="recalled-id">${inc.id}</span>
                            <span class="recalled-category">${inc.category}</span>
                        </div>
                        <div class="recalled-title">${inc.title}</div>
                        <div class="recalled-reason">${inc.graph_connection_reason || ""}</div>
                    `;
                    recalledList.appendChild(div);
                });
                
                // Draw the dynamic Cognee relation graph
                drawCogneeGraph(data.alert, data.recalled_incidents);
                
                // Re-wire apply button
                btnApplyFix.disabled = false;
                
            } else {
                showToast(data.detail || "Diagnosis failed", "error");
                if (loadingState) loadingState.classList.add("hidden");
                if (welcomeState) welcomeState.classList.remove("hidden");
            }
        } catch (err) {
            showToast("Server diagnostic request failed", "error");
            if (loadingState) loadingState.classList.add("hidden");
            if (welcomeState) welcomeState.classList.remove("hidden");
        }
    }

    function drawCogneeGraph(alertObj, recalledList) {
        if (!graphSvg || !linksGroup || !nodesGroup) return;
        
        // Unhide canvas
        if (graphPlaceholder) graphPlaceholder.classList.add("hidden");
        graphSvg.classList.remove("hidden");
        
        // Clear previous paths
        linksGroup.innerHTML = "";
        nodesGroup.innerHTML = "";

        const width = 480;
        const height = 260;

        // Position mapping
        const alertPos = { x: 50, y: height / 2 };
        const servicePos = { x: 220, y: height / 2 };

        // 1. Draw Alert Node
        createNode(nodesGroup, alertPos.x, alertPos.y, "Alert", alertObj.id, "alert-node");

        // 2. Draw Service Node
        createNode(nodesGroup, servicePos.x, servicePos.y, "Service", alertObj.service, "service-node");

        // 3. Connect Alert -> Service
        createLink(linksGroup, alertPos.x, alertPos.y, servicePos.x, servicePos.y);

        // 4. Draw Recalled Past Incidents & Connect Service -> Outages
        if (recalledList && recalledList.length > 0) {
            const count = recalledList.length;
            recalledList.forEach((inc, idx) => {
                // Space out past incidents vertically on the right
                const gap = height / (count + 1);
                const outY = gap * (idx + 1);
                const outX = 390;

                // Outage Node
                createNode(nodesGroup, outX, outY, "Outage", inc.id, "outage-node");

                // Link Service -> Outage
                createLink(linksGroup, servicePos.x, servicePos.y, outX, outY);
            });
        }
    }

    function createNode(parent, x, y, type, label, cssClass) {
        // SVG Group container
        const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        g.setAttribute("class", `graph-node-grp ${cssClass}`);
        g.style.cursor = "pointer";

        // Circle node with glow filter
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", x);
        circle.setAttribute("cy", y);
        circle.setAttribute("r", type === "Alert" ? 14 : 11);
        
        let color = "#ef4444"; // default red
        if (type === "Service") color = "#16d05e"; // green
        if (type === "Outage") color = "#f59e0b"; // amber
        
        circle.setAttribute("fill", "rgba(10, 10, 10, 0.9)");
        circle.setAttribute("stroke", color);
        circle.setAttribute("stroke-width", "2");
        circle.setAttribute("filter", `drop-shadow(0 0 6px ${color}88)`);

        // Monospace code label
        const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
        txt.setAttribute("x", x);
        txt.setAttribute("y", y + 25);
        txt.setAttribute("text-anchor", "middle");
        txt.setAttribute("fill", "rgba(255,255,255,0.75)");
        txt.setAttribute("font-size", "9.5px");
        txt.setAttribute("font-family", "var(--font-mono)");
        txt.textContent = label;

        g.appendChild(circle);
        g.appendChild(txt);
        parent.appendChild(g);
    }

    function createLink(parent, x1, y1, x2, y2) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);
        line.setAttribute("stroke", "rgba(255, 255, 255, 0.08)");
        line.setAttribute("stroke-width", "1.5");
        line.setAttribute("stroke-dasharray", "4 4");
        line.setAttribute("class", "graph-link-line");
        parent.appendChild(line);
    }
    
    // Initial State reset
    resetConsoleState();

    function resetConsoleState() {
        // Disabling apply fix button until match is found
        btnApplyFix.disabled = true;
        
        // Reset steps
        resetStepItem(stepSearch, "fa-solid fa-magnifying-glass");
        resetStepItem(stepIngest, "fa-solid fa-cloud-arrow-up");
        resetStepItem(stepRecall, "fa-solid fa-route");
        resetStepItem(stepTraverse, "fa-solid fa-network-wired");
        resetStepItem(stepMatch, "fa-solid fa-circle-check");
        
        // Clear SVG Graph Group Elements
        if (linksGroup) linksGroup.innerHTML = "";
        if (nodesGroup) nodesGroup.innerHTML = "";
        if (graphSvg) graphSvg.classList.add("hidden");
        if (graphPlaceholder) graphPlaceholder.classList.remove("hidden");
        
        // Reset Checks
        checks.forEach(check => {
            check.checked = false;
            check.disabled = true;
            check.closest("label").style.textDecoration = "none";
            check.closest("label").style.color = "inherit";
        });
        
        // Reset Gauge
        gaugeFill.setAttribute("stroke-dasharray", "0, 100");
        gaugePct.textContent = "0%";
        
        // Reset MTTR & Badge
        celebrationBadge.style.display = "none";
        mttrDisplay.textContent = "42 min";
        mttrDisplay.classList.remove("highlighted");
        
        // Reset Log Body
        logBody.innerHTML = `<div class="log-line cmd">$ python main.py demo</div>`;
    }

    function resetStepItem(el, iconClass) {
        el.className = "step-item";
        el.querySelector(".step-icon").innerHTML = `<i class="${iconClass}"></i>`;
    }

    function setStepActive(el) {
        el.className = "step-item active";
        el.querySelector(".step-icon").innerHTML = `<i class="fa-solid fa-circle-notch"></i>`;
    }

    function setStepSuccess(el) {
        el.className = "step-item success";
        el.querySelector(".step-icon").innerHTML = `<i class="fa-solid fa-circle-check text-success"></i>`;
    }

    function addLogLine(text, className = "log-line") {
        const line = document.createElement("div");
        line.className = className;
        line.textContent = text;
        logBody.appendChild(line);
        logBody.scrollTop = logBody.scrollHeight;
    }

    // Delay helper
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // RUN INCIDENT AUTOMATION
    btnRunIncident.addEventListener("click", async () => {
        btnRunIncident.disabled = true;
        btnRunIncident.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Running incident...`;
        
        resetConsoleState();
        showToast("Simulating live P1 Alert on Checkout Service...", "info");
        await delay(800);

        // Step 1: Searching memory
        setStepActive(stepSearch);
        addLogLine("remember() Ingesting incident metadata...", "log-line cmd");
        await delay(1200);
        setStepSuccess(stepSearch);
        addLogLine("remember() Ingestion completed successfully. ✓", "log-line white");
        
        // Step 2: Ingest context
        setStepActive(stepIngest);
        await delay(1000);
        setStepSuccess(stepIngest);
        addLogLine("recall() Initiated query path lookup...", "log-line cyan");

        // Step 3: Searching similar
        setStepActive(stepRecall);
        await delay(1000);
        setStepSuccess(stepRecall);
        addLogLine("recall() Searching graph relationships...", "log-line cyan");

        // Step 4: Graph traversal
        setStepActive(stepTraverse);
        await delay(1200);
        setStepSuccess(stepTraverse);
        addLogLine("Graph traversal: payment-gateway -> cert-manager -> checkout-service", "log-line white");
        
        // Draw the dynamic Cognee relation graph mock for simulation
        drawCogneeGraph(
            { id: "ALERT-101", service: "checkout-service" },
            [{ id: "INC-003", category: "Expired Certificate" }]
        );

        // Step 5: Match found
        setStepActive(stepMatch);
        await delay(800);
        setStepSuccess(stepMatch);
        addLogLine("match found (Incident #11) with 92% confidence.", "log-line cyan");
        addLogLine("AI recommendations prepared. Ready to apply fix.", "log-line white");
        
        // Enable resolution UI
        btnApplyFix.disabled = false;
        checks.forEach(check => check.disabled = false);
        
        showToast("Memory match found! AI Recommendations ready.", "success");
        btnRunIncident.disabled = false;
        btnRunIncident.innerHTML = `<i class="fa-solid fa-play"></i> Run Live Incident`;
    });

    // APPLY RESOLUTION & IMPROVE LIFECYCLE
    btnApplyFix.addEventListener("click", async () => {
        btnApplyFix.disabled = true;
        btnApplyFix.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Applying...`;
        
        showToast("Executing remediation actions...", "info");
        await delay(600);

        // 1. Verify TLS certificate expiry
        checks[0].checked = true;
        checks[0].closest("label").style.textDecoration = "line-through";
        checks[0].closest("label").style.color = "var(--color-text-muted)";
        addLogLine("Applying fix: python resolve.py --incident-id 11", "log-line cmd");
        addLogLine("Verify TLS certificate expiry check: EXPIRED ✓", "log-line white");
        await delay(1000);

        // 2. Renew TLS certificate
        checks[1].checked = true;
        checks[1].closest("label").style.textDecoration = "line-through";
        checks[1].closest("label").style.color = "var(--color-text-muted)";
        addLogLine("Executing Let's Encrypt manual renewal challenge...", "log-line white");
        addLogLine("Renew TLS certificate: SUCCESS ✓", "log-line white");
        await delay(1000);

        // 3. Restart payment-gateway pods
        checks[2].checked = true;
        checks[2].closest("label").style.textDecoration = "line-through";
        checks[2].closest("label").style.color = "var(--color-text-muted)";
        addLogLine("Restarting payment-gateway deployment pods...", "log-line white");
        await delay(1000);

        // 4. Verify checkout flow is healthy
        checks[3].checked = true;
        checks[3].closest("label").style.textDecoration = "line-through";
        checks[3].closest("label").style.color = "var(--color-text-muted)";
        addLogLine("Verification check: HTTP 200 OK checkout flow healthy. ✓", "log-line white");
        await delay(800);

        // Cognee Improve loop
        addLogLine("improve() Enriching memory graph node weights...", "log-line cyan");
        await delay(800);
        addLogLine("memory updated", "log-line cyan");
        addLogLine("incident resolved", "log-line white");
        addLogLine("MTTR: 42 min → 4 min", "log-line cmd");

        // Animate circular gauge
        gaugeFill.setAttribute("stroke-dasharray", "96, 100");
        gaugePct.textContent = "96%";
        
        // Show celebration & MTTR improvement
        celebrationBadge.style.display = "block";
        mttrDisplay.textContent = "4 min";
        mttrDisplay.classList.add("highlighted");
        
        showToast("Incident resolved. Cognee memory reinforced!", "success");
        btnApplyFix.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> Apply Fix`;
    });

    // Toast Helpers
    function showToast(message, type = "success") {
        // Remove previous toast instances if rapidly triggered
        const oldToast = document.querySelector(".toast-dynamic");
        if (oldToast) oldToast.remove();
        
        const toast = document.createElement("div");
        toast.className = `toast toast-dynamic show ${type}`;
        
        let iconHtml = '<i class="fa-solid fa-circle-check"></i>';
        if (type === "error") {
            iconHtml = '<i class="fa-solid fa-triangle-exclamation"></i>';
        } else if (type === "info") {
            iconHtml = '<i class="fa-solid fa-circle-info"></i>';
        }
        
        toast.innerHTML = `${iconHtml} <span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
});
