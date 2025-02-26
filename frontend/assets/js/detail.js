document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const model = urlParams.get('model');

    if (model) {
        const url = `http://localhost:3000/api/gpus/${encodeURIComponent(model)}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const gpu = data[0];
                    const maxCores = 21760;
                    const maxTDP = 600;
                    const cores = parseInt(gpu.Coeurs, 10);
                    const tdp = parseInt(gpu.TDP, 10);
                    const corePercentage = (cores / maxCores) * 100;
                    const tdpPercentage = (tdp / maxTDP) * 100;

                    document.getElementById("core-comparison").innerText = `${corePercentage.toFixed(2)}% des coeurs de la 5090.`;
                    updateGauge("gauge", corePercentage);

                    document.getElementById("tdp-comparison").innerText = `${tdpPercentage.toFixed(2)}% de 600W.`;
                    updateTDPGauge(tdpPercentage);
                    displayDetails(gpu);
                } else {
                    document.getElementById("details").innerText = "Aucune information trouvée pour ce modèle.";
                }
            })
            .catch(error => console.error('Error fetching GPU details:', error));
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

function updateGauge(id, percentage) {
    const gauge = document.getElementById(id);
    gauge.innerHTML = `<div style="width: ${percentage}%; background-color: #4CAF50;"></div>`;
}

function updateTDPGauge(percentage) {
    const gauge = document.getElementById("tdp-gauge");
    let color = "#4CAF50"; // Green by default

    if (percentage > 100) {
        color = "purple"; // Exceeds 600W
    } else if (percentage > 75) {
        color = "red"; // Close to 600W
    } else if (percentage > 50) {
        color = "orange"; // Mid-range
    } else if (percentage > 25) {
        color = "yellow"; // Lower range
    } else {
        color = "blue"; // Low TDP
    }

    gauge.innerHTML = `<div style="width: ${percentage}%; background-color: ${color};"></div>`;
}

document.getElementById("techpowerupButton").addEventListener("click", function() {
    const model = new URLSearchParams(window.location.search).get('model');
    if (model) {
        window.open(`https://www.techpowerup.com/gpu-specs/?ajaxsrch=${encodeURIComponent(model)}`, '_blank');
    }
});

document.getElementById("backButton").addEventListener("click", function() {
    window.history.back();
});