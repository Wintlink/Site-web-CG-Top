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
    detailsContainer.innerHTML = `
        <h2>${details.Nom_CG}</h2>
        <div class="detail-item"><strong>GPU:</strong> <span>${details.GPU}</span></div>
        <div class="detail-item"><strong>Date de sortie:</strong> <span>${details.Date_de_sortie}</span></div>
        <div class="detail-item"><strong>Cores:</strong> <span>${details.Coeurs}</span></div>
        <div class="detail-item"><strong>Base Clock:</strong> <span>${details.Base_clock}</span></div>
        <div class="detail-item"><strong>Boost Clock:</strong> <span>${details.Boost_clock}</span></div>
        <div class="detail-item"><strong>VRAM:</strong> <span>${details.Qte_VRAM}</span></div>
        <div class="detail-item"><strong>Type de mémoire:</strong> <span>${details.Type_mem}</span></div>
        <div class="detail-item"><strong>Vendor:</strong> <span>${details.Vendor}</span></div>
        <div class="detail-item"><strong>Architecture:</strong> <span>${details.Architecture}</span></div>
        <div class="detail-item"><strong>Processus de fabrication:</strong> <span>${details.Processus_fabrication}</span></div>
        <div class="detail-item"><strong>Transistors:</strong> <span>${details.Transistors}</span></div>
        <div class="detail-item"><strong>TDP:</strong> <span>${details.TDP}</span></div>
        <div class="detail-item"><strong>Prix de lancement:</strong> <span>${details.Prix_lancement}</span></div>
    `;
}
