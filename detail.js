

class ajax {
    constructor(url, method, options) {
        this.url = url;
        this.method = method;
        this.options = options;
    }
    send(callback) {
        const http = new XMLHttpRequest();
        http.onload = function() {
            callback(JSON.parse(http.response));
        }
        http.open(this.method, this.url, this.options);
        http.send();
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get('model');

    if (model) {
        const requete = new ajax("https://raw.githubusercontent.com/voidful/gpu-info-api/gpu-data/gpu.json", "get");
        requete.send(function(données) {
            const details = Object.entries(données).find(([key, item]) => key === model || item.Model === model || item.Model.toString() === model);
            if (details) {
                displayDetails(details[1]);
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
    const coreConfig = details["Core config"] || details["Core Config"] || details["Config core"] || details["Core config12*"];
    const [cores, tmus, rops] = coreConfig ? coreConfig.split(":") : ["", "", ""];
    
    detailsContainer.innerHTML = `
        <h2>${details.Model}</h2>
        <div class="detail-item"><strong>Code name:</strong> <span>${details["Code name"]}</span></div>
        <div class="detail-item"><strong>Launch:</strong> <span>${details.Launch}</span></div>
        <div class="detail-item"><strong>Cores:</strong> <span>${cores}</span></div>
        <div class="detail-item"><strong>TMUS:</strong> <span>${tmus}</span></div>
        <div class="detail-item"><strong>ROPS:</strong> <span>${rops}</span></div>
        <div class="detail-item"><strong>Memory Size:</strong> <span>${details["Memory Size"] || details["Memory Size (MiB)"] || details["Memory Size (GiB)"]}</span></div>
        <div class="detail-item"><strong>Memory Bus type:</strong> <span>${details["Memory Bus type"]}</span></div>
        <div class="detail-item"><strong>Vendor:</strong> <span>${details.Vendor}</span></div>
    `;
}
