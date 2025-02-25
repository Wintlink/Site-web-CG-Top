document.getElementById('form').addEventListener('submit', (event) => {
  event.preventDefault();
  console.log(event);
  formSend(event);
})

function formSend(eventData){
  let object = {};
  let isMissing = false;

  for (let idName of eventData.target) {
    if(idName.value === '' && idName.type === 'text'){
        isMissing = true;
    }

    if(!idName.value && idName.type === 'text'){
        isMissing = true;
    } else {
        if (idName.type !== 'submit' && idName.name) {
            object[idName.name] = idName.value;
        }
    }
    }
    
  if(isMissing === true){
      alert("Nope");
  } else {
      
    const url = `http://localhost:3000/api/gpus`;
    const requete = new ajax(url, { method: "POST", body: JSON.stringify(object),  headers: { "Content-Type": "application/json" } });
      
    requete.send(function(data) {
        console.log(data);
        if(data) {
            alert("GPU ajouté avec succès");
        } else {
            alert("Erreur lors de l'ajout du GPU");
        }
    });

      
  }
}

document.getElementById('randomData').addEventListener('click', function() {
    document.getElementById('Nom_CG').value = 'Nom CG Aléatoire ' + Math.floor(Math.random() * 1000);
    document.getElementById('GPU').value = 'GPU Aléatoire ' + Math.floor(Math.random() * 1000);
    document.getElementById('Generation').value = 'Gen Aléatoire ' + Math.floor(Math.random() * 1000);
    document.getElementById('Base_clock').value = Math.floor(Math.random() * 2000) + 1000;
    document.getElementById('Boost_clock').value = Math.floor(Math.random() * 2000) + 1000;
    document.getElementById('Fonderie').value = 'Fonderie Aléatoire';
    document.getElementById('Taille_puce').value = Math.floor(Math.random() * 500) + 100;
    document.getElementById('Date_de_sortie').value = '2023-01-01';
    document.getElementById('Interface_Bus').value = 'PCIe 4.0';
    document.getElementById('Fréquence_mémoire').value = Math.floor(Math.random() * 2000) + 1000;
    document.getElementById('Qte_VRAM').value = Math.floor(Math.random() * 24) + 1;
    document.getElementById('Bande_passante_mem').value = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('Type_mem').value = 'GDDR6';
    document.getElementById('Coeurs').value = Math.floor(Math.random() * 10000) + 1000;
    document.getElementById('Coeurs_Tensor').value = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('Coeurs_RT').value = Math.floor(Math.random() * 1000) + 100;
    document.getElementById('TDP').value = Math.floor(Math.random() * 500) + 100;
    document.getElementById('Largeur').value = Math.floor(Math.random() * 300) + 100;
    document.getElementById('Longueur').value = Math.floor(Math.random() * 300) + 100;
    document.getElementById('Slots').value = Math.floor(Math.random() * 4) + 1;
    document.getElementById('Alimentation_recom').value = Math.floor(Math.random() * 1000) + 500;
    document.getElementById('Connecteurs_dalim').value = '8-pin';
    document.getElementById('Connecteurs_daffi').value = 'HDMI, DisplayPort';
});