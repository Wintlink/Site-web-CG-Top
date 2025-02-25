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
        vendor: "all",
        generation: "all",
        search: ""
    };

    var sort = ["cores", "desc"]; // Default sorting by cores in descending order

    const fields = ["Nom_CG", "GPU", "Date_de_sortie", "Coeurs", "Base_Clock", "Boost_Clock", "VRAM", "Type_mem"];

    function applyFilters() {
        show_data = data.filter(item => {
            const yearMatch = filters.year === "all" || new Date(item.Date_de_sortie).getFullYear() == filters.year;
            const memoryMatch = filters.memory === "all" || parseMemorySize(item.VRAM) <= filters.memory;
            const memoryTypeMatch = filters.memoryType === "all" || item.Type_mem.toLowerCase() === filters.memoryType;
            const vendorMatch = filters.vendor === "all" || item.Vendor.toLowerCase() === filters.vendor;
            const generationMatch = filters.generation === "all" || item.Nom_CG.includes(filters.generation);
            const searchMatch = filters.search === "" || item.Nom_CG.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.GPU.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.Coeurs.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                item.Base_Clock.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                item.Boost_Clock.toLowerCase().includes(filters.search.toLowerCase()) ||
                item.VRAM.toString().toLowerCase().includes(filters.search.toLowerCase()) ||
                item.Type_mem.toLowerCase().includes(filters.search.toLowerCase());
            return yearMatch && memoryMatch && memoryTypeMatch && vendorMatch && generationMatch && searchMatch;
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
    requete.send(function(données) {
        données.forEach(item => {
            console.log(item);
            data.push({
                Nom_CG: item.Nom_CG ?? "",
                GPU: item.GPU ?? "",
                Date_de_sortie: (item.Date_de_sortie ?? "").substring(0, 10),
                Coeurs: item.Coeurs ?? "",
                Base_Clock: item.Base_clock ?? "",
                Boost_Clock: item.Boost_clock ?? "",
                VRAM: item.Qte_VRAM ?? "",
                Type_mem: item.Type_mem ?? "",
                Vendor: item.Vendor ?? ""
            });
        });
        show_data = data;
        applyFilters();
    });

    document.getElementById("nameAsc").addEventListener("click", (event) => {
        sort = ["name", "asc"];
        generateTableContent();
    });

    document.getElementById("nameDesc").addEventListener("click", (event) => {
        sort = ["name", "desc"];
        generateTableContent();
    });

    document.getElementById("coresDesc").addEventListener("click", (event) => {
        sort = ["cores", "desc"];
        generateTableContent();
    });

    document.getElementById("coresAsc").addEventListener("click", (event) => {
        sort = ["cores", "asc"];
        generateTableContent();
    });

    document.getElementById("search").addEventListener("keyup", (event) => {
        setTimeout(() => {
            filters.search = event.target.value;
            applyFilters();
        }, 200);
    });

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

    document.getElementById("yearFilter").addEventListener("change", (event) => {
        filters.year = event.target.value;
        applyFilters();
    });

    document.getElementById("memoryFilter").addEventListener("change", (event) => {
        filters.memory = event.target.value;
        applyFilters();
    });

    document.getElementById("memoryTypeFilter").addEventListener("change", (event) => {
        filters.memoryType = event.target.value;
        applyFilters();
    });

    document.getElementById("vendorFilter").addEventListener("change", (event) => {
        filters.vendor = event.target.value;
        applyFilters();
    });

    document.getElementById("gpuGenerationFilter").addEventListener("change", (event) => {
        filters.generation = event.target.value;
        applyFilters();
    });

    document.getElementById("resetFilters").addEventListener("click", () => {
        filters = {
            year: "all",
            memory: "all",
            memoryType: "all",
            vendor: "all",
            generation: "all",
            search: ""
        };
        document.getElementById("yearFilter").value = "all";
        document.getElementById("memoryFilter").value = "all";
        document.getElementById("memoryTypeFilter").value = "all";
        document.getElementById("vendorFilter").value = "all";
        document.getElementById("gpuGenerationFilter").value = "all";
        document.getElementById("search").value = "";
        applyFilters();
    });
});