function openDetailPage(model) {
    window.location.href = `detail.html?model=${encodeURIComponent(model)}`;
}

document.addEventListener("DOMContentLoaded", function() {
    var data = [];
    var show_data = [];
    var filters = {
        year: "all",
        memory: "all",
        memoryType: "all",
        constructeur: "all",
        generation: "all",
        search: ""
    };

    var sort = ["cores", "desc"]; // Default sorting by cores in descending order

    const fields = ["Nom_CG", "GPU", "Date_de_sortie", "Coeurs", "Base_clock", "Boost_clock", "Qte_VRAM", "Type_mem"];

    function fillFilterValues(years, memories, memoryTypes, constructeurs, generations) {
        const yearFilter = document.getElementById("yearFilter");
        if (yearFilter) {
            yearFilter.innerHTML = "<option value='all'>All</option>";
            years.forEach(year => {
                yearFilter.innerHTML += `<option value='${year}'>${year}</option>`;
            });
        }
        const memoryFilter = document.getElementById("memoryFilter");
        if (memoryFilter) {
            memoryFilter.innerHTML = "<option value='all'>All</option>";
            memories.sort((a, b) => a - b).forEach(memory => {
                memoryFilter.innerHTML += `<option value='${memory}'>${memory} GB</option>`;
            });
        }
        const memoryTypeFilter = document.getElementById("memoryTypeFilter");
        if (memoryTypeFilter) {
            memoryTypeFilter.innerHTML = "<option value='all'>All</option>";
            memoryTypes.forEach(memoryType => {
                memoryTypeFilter.innerHTML += `<option value='${memoryType}'>${memoryType}</option>`;
            });
        }
        const constructeurFilter = document.getElementById("constructeurFilter");
        if (constructeurFilter) {
            constructeurFilter.innerHTML = "<option value='all'>All</option>";
            constructeurs.forEach(constructeur => {
                constructeurFilter.innerHTML += `<option value='${constructeur}'>${constructeur}</option>`;
            });
        }
        const gpuGenerationFilter = document.getElementById("gpuGenerationFilter");
        if (gpuGenerationFilter) {
            gpuGenerationFilter.innerHTML = "<option value='all'>All</option>";
            generations.forEach(generation => {
                gpuGenerationFilter.innerHTML += `<option value='${generation}'>${generation}</option>`;
            });
        }
    }

    function applyFilters() {
        show_data = data.filter(item => {
            const yearMatch = filters.year === "all" || new Date((item.Date_de_sortie ?? "")).getFullYear() == filters.year;
            const memoryMatch = filters.memory === "all" || parseMemorySize((item.Qte_VRAM ?? "")) <= filters.memory;
            const memoryTypeMatch = filters.memoryType === "all" || (item.Type_mem ?? "").toLowerCase() === filters.memoryType;
            const constructeurMatch = filters.constructeur === "all" || (item.Nom_Constructeur ?? "").toLowerCase() === filters.constructeur;
            const generationMatch = filters.generation === "all" || (item.Generation ?? "").includes(filters.generation);
            const searchMatch = filters.search === "" || (item.Nom_CG ?? "").toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.GPU ?? "").toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.Coeurs ?? "").toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.Base_clock ?? "").toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.Boost_clock ?? "").toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.Qte_VRAM ?? "").toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                (item.Type_mem ?? "").toString().toLowerCase().includes(filters.search.toLowerCase());
            return yearMatch && memoryMatch && memoryTypeMatch && constructeurMatch && generationMatch && searchMatch;
        });
        generateTableContent();
    }

    function generateTableContent() {
        let content = "";
        console.log(sort);
        show_data.sort((a, b) => {
            if (sort[0] === "name" && sort[1] === "asc") return a.Nom_CG > b.Nom_CG ? 1 : -1;
            if (sort[0] === "name" && sort[1] === "desc") return a.Nom_CG < b.Nom_CG ? 1 : -1;
            if (sort[0] === "cores" && sort[1] === "asc") return parseInt(a.Coeurs) > parseInt(b.Coeurs) ? 1 : -1;
            if (sort[0] === "cores" && sort[1] === "desc") return parseInt(a.Coeurs) < parseInt(b.Coeurs) ? 1 : -1;
            return 0;
        }).forEach((rowData) => {
            content += `<tr onclick="openDetailPage('${rowData.Nom_CG}')">`;
            fields.forEach((field) => {
                content += "<td>" + rowData[field] + "</td>";
            })
            content += "</tr>";
        });
        document.getElementById("tbody").innerHTML = content;
    }

    const url = "http://localhost:3000/api/gpus";
    const requete = new ajax(url);
    requete.send(function (données) {
        
        let years = [];
        let memories = [];
        let memoryTypes = [];
        let constructeurs = [];
        let generations = [];

        données.forEach(item => {

            if (!item.Nom_CG) return;

            const year = new Date((item.Date_de_sortie ?? "")).getFullYear();
            if (!years.includes(year)) years.push(year);

            const memory = parseMemorySize((item.Qte_VRAM ?? ""));
            if (!memories.includes(memory)) memories.push(memory);

            const memoryType = (item.Type_mem ?? "").toLowerCase();
            if (!memoryTypes.includes(memoryType)) memoryTypes.push(memoryType);

            const constructeur = ((item.Nom_Constructeur ?? "") ?? "").toLowerCase();
            if (!constructeurs.includes(constructeur)) constructeurs.push(constructeur);

            (item.Generation ?? "").split(",").forEach(generation => {
                if (!generations.find(g => g.generation === generation)) generations.push({ generation, length: 1 });
                else generations.find(g => g.generation === generation).length++;
            });

            data.push({
                Nom_CG: item.Nom_CG ?? "",
                GPU: item.GPU ?? "",
                Date_de_sortie: (item.Date_de_sortie ?? "Unreleased").substring(0, 10),
                Coeurs: item.Coeurs ?? "",
                Base_clock: item.Base_clock ?? "",
                Boost_clock: item.Boost_clock ?? "",
                Qte_VRAM: item.Qte_VRAM ?? "",
                Type_mem: item.Type_mem ?? "",
                Nom_Constructeur: item.Nom_Constructeur ?? "",
                Generation: item.Generation ?? ""
            });
        });
        show_data = data;

        years = years.sort((a, b) => b - a);
        memoryType = memoryTypes.sort();
        constructeurs = constructeurs.sort();
        generations = generations.sort((a, b) => b.length - a.length).filter((g, i) => g.length > 15).map(g => g.generation).sort();
        fillFilterValues(years, memories, memoryTypes, constructeurs, generations);
        applyFilters();

    });

    const nameAsc = document.getElementById("nameAsc");
    if (nameAsc) {
        nameAsc.addEventListener("click", (event) => {
            sort = ["name", "asc"];
            generateTableContent();
        });
    }

    const nameDesc = document.getElementById("nameDesc");
    if (nameDesc) {
        nameDesc.addEventListener("click", (event) => {
            sort = ["name", "desc"];
            generateTableContent();
        });
    }

    const coresDesc = document.getElementById("coresDesc");
    if (coresDesc) {
        coresDesc.addEventListener("click", (event) => {
            sort = ["cores", "desc"];
            generateTableContent();
        });
    }

    const coresAsc = document.getElementById("coresAsc");
    if (coresAsc) {
        coresAsc.addEventListener("click", (event) => {
            sort = ["cores", "asc"];
            generateTableContent();
        });
    }

    const search = document.getElementById("search");
    if (search) {
        search.addEventListener("keyup", (event) => {
            setTimeout(() => {
                filters.search = event.target.value;
                applyFilters();
            }, 200);
        });
    }

    function parseMemorySize(size) {
        if (typeof size === 'string') {
            size = size.toLowerCase();
            if (size.includes('gb')) {
                return parseFloat(size) * 1024;
            } else if (size.includes('mb')) {
                return parseFloat(size);
            }
        }
        return parseFloat(size);
    }

    const yearFilter = document.getElementById("yearFilter");
    if (yearFilter) {
        yearFilter.addEventListener("change", (event) => {
            filters.year = event.target.value;
            applyFilters();
        });
    }

    const memoryFilter = document.getElementById("memoryFilter");
    if (memoryFilter) {
        memoryFilter.addEventListener("change", (event) => {
            filters.memory = event.target.value;
            applyFilters();
        });
    }

    const memoryTypeFilter = document.getElementById("memoryTypeFilter");
    if (memoryTypeFilter) {
        memoryTypeFilter.addEventListener("change", (event) => {
            filters.memoryType = event.target.value;
            applyFilters();
        });
    }

    const constructeurFilter = document.getElementById("constructeurFilter");
    if (constructeurFilter) {
        constructeurFilter.addEventListener("change", (event) => {
            filters.constructeur = event.target.value;
            applyFilters();
        });
    }

    const gpuGenerationFilter = document.getElementById("gpuGenerationFilter");
    if (gpuGenerationFilter) {
        gpuGenerationFilter.addEventListener("change", (event) => {
            filters.generation = event.target.value;
            applyFilters();
        });
    }

    const resetFilters = document.getElementById("resetFilters");
    if (resetFilters) {
        resetFilters.addEventListener("click", () => {
            filters = {
                year: "all",
                memory: "all",
                memoryType: "all",
                constructeur: "all",
                generation: "all",
                search: ""
            };
            document.getElementById("yearFilter").value = "all";
            document.getElementById("memoryFilter").value = "all";
            document.getElementById("memoryTypeFilter").value = "all";
            document.getElementById("constructeurFilter").value = "all";
            document.getElementById("gpuGenerationFilter").value = "all";
            document.getElementById("search").value = "";
            applyFilters();
        });
    }
});