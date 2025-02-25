class ajax {
    constructor(url, options) {
        this.url = url;
        this.options = options;
    }
    async send(callback) {
        try {
            const response = await fetch(this.url, this.options);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            callback(data);
        } catch (err) {
            console.error('Fetch failed: ', err);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get('model');

    if (model) {
        const url = `http://localhost:3000/api/gpus/${model}`;
        const requete = new ajax(url);
        requete.send(function(details) {
            if (details) {
                displayDetails(details);
            } else {
                document.getElementById("details").innerText = "Aucune information trouvée pour ce modèle.";
            }
        });
    } else {
        document.getElementById("details").innerText = "Modèle non spécifié.";
    }
});

function displayDetails(details) {
    const detailsContainer = document.getElementById("details");
    const coreConfig = details["CoreConfig"];
    const [cores, tmus, rops] = coreConfig ? coreConfig.split(":") : ["", "", ""];

    detailsContainer.innerHTML = `
        <h2>${details.Model}</h2>
        <div class="detail-item"><strong>Code name:</strong> <span>${details.CodeName}</span></div>
        <div class="detail-item"><strong>Launch:</strong> <span>${details.Launch}</span></div>
        <div class="detail-item"><strong>Cores:</strong> <span>${cores}</span></div>
        <div class="detail-item"><strong>TMUS:</strong> <span>${tmus}</span></div>
        <div class="detail-item"><strong>ROPS:</strong> <span>${rops}</span></div>
        <div class="detail-item"><strong>Memory Size:</strong> <span>${details.MemorySize}</span></div>
        <div class="detail-item"><strong>Memory Bus type:</strong> <span>${details.MemoryBusType}</span></div>
        <div class="detail-item"><strong>Vendor:</strong> <span>${details.Vendor}</span></div>
    `;
}
