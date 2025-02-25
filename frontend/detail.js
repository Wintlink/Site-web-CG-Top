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
        <div class="detail-item"><strong>Génération:</strong> <span>${details.Generation}</span></div>
        <div class="detail-item"><strong>Base Clock:</strong> <span>${details.Base_clock} MHz</span></div>
        <div class="detail-item"><strong>Boost Clock:</strong> <span>${details.Boost_clock} MHz</span></div>
        <div class="detail-item"><strong>Fonderie:</strong> <span>${details.Fonderie}</span></div>
        <div class="detail-item"><strong>Date de sortie:</strong> <span>${new Date(details.Date_de_sortie).toLocaleDateString()}</span></div>
        <div class="detail-item"><strong>Interface Bus:</strong> <span>${details.Interface_Bus}</span></div>
        <div class="detail-item"><strong>Fréquence mémoire:</strong> <span>${details.Fréquence_mémoire} MHz</span></div>
        <div class="detail-item"><strong>VRAM:</strong> <span>${details.Qte_VRAM} GB</span></div>
        <div class="detail-item"><strong>Bande passante mémoire:</strong> <span>${details.Bande_passante_mem} GB/s</span></div>
        <div class="detail-item"><strong>Type de mémoire:</strong> <span>${details.Type_mem}</span></div>
        <div class="detail-item"><strong>Cores:</strong> <span>${details.Coeurs}</span></div>
        <div class="detail-item"><strong>Cores Tensor:</strong> <span>${details.Coeurs_Tensor}</span></div>
        <div class="detail-item"><strong>Cores RT:</strong> <span>${details.Coeurs_RT}</span></div>
        <div class="detail-item"><strong>TDP:</strong> <span>${details.TDP} W</span></div>
        <div class="detail-item"><strong>Largeur:</strong> <span>${details.Largeur} mm</span></div>
        <div class="detail-item"><strong>Longueur:</strong> <span>${details.Longueur} mm</span></div>
        <div class="detail-item"><strong>Slots:</strong> <span>${details.Slots}</span></div>
        <div class="detail-item"><strong>Alimentation recommandée:</strong> <span>${details.Alimentation_recom} W</span></div>
        <div class="detail-item"><strong>Connecteurs d'alimentation:</strong> <span>${details.Connecteurs_dalim}</span></div>
        <div class="detail-item"><strong>Connecteurs d'affichage:</strong> <span>${details.Connecteurs_daffi}</span></div>
        <div class="detail-item"><strong>Photo:</strong> <a href="${details.Photo}" target="_blank">Voir la photo</a></div>
    `;
}
