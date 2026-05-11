function renderSOP(id) {
    const data = sopRegistry[id];
    const headerInfo = document.getElementById('header-info');
    
    // 1. Render Header Info
    const sevLabels = {
        low: { label: "Low Urgency", class: "sev-low" },
        medium: { label: "Medium", class: "sev-medium" },
        high: { label: "High Priority", class: "sev-high" },
        critical: { label: "CRITICAL", class: "sev-critical" }
    };
    const sev = sevLabels[data.severity || 'low'];

    headerInfo.innerHTML = `
        <div>
            <h2 class="text-xl font-bold flex items-center gap-3">
                ${data.title}
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${sev.class}">${sev.label}</span>
            </h2>
            <div class="flex items-center gap-4 mt-1 text-[10px] text-slate-400 font-medium">
                <span class="flex items-center gap-1 uppercase tracking-wider"><i data-lucide="folder" class="w-3 h-3 text-cyan-400"></i> ${data.category}</span>
                <span class="flex items-center gap-1 uppercase tracking-wider"><i data-lucide="calendar" class="w-3 h-3 text-slate-500"></i> ${data.updated}</span>
            </div>
        </div>
    `;

    // 2. Load Iframes (Ini solusi ampuh agar JS & Layout tidak bentrok)
    document.getElementById('pdf-iframe').src = `${data.folderPath}/document.pdf`;
    document.getElementById('web-iframe').src = `${data.folderPath}/content.html`;

    setView('web');
    lucide.createIcons();
}

function buildSidebar() {
    const nav = document.getElementById('sidebar-nav');
    const categories = [...new Set(Object.values(sopRegistry).map(s => s.category))];
    
    nav.innerHTML = categories.map(cat => `
        <div>
            <p class="px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 opacity-60">${cat}</p>
            <div class="space-y-1">
                ${Object.entries(sopRegistry)
                    .filter(([id, data]) => data.category === cat)
                    .map(([id, data]) => `
                        <button onclick="switchActiveSOP('${id}')" id="btn-${id}" class="sidebar-link w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all opacity-60 hover:opacity-100 group">
                            <i data-lucide="file-text" class="w-4 h-4 group-hover:text-cyan-400"></i>
                            <span class="font-medium text-left leading-tight">${data.title}</span>
                        </button>
                    `).join('')}
            </div>
        </div>
    `).join('');
    
    lucide.createIcons();
}

function switchActiveSOP(id) {
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active', 'opacity-100'));
    const activeBtn = document.getElementById('btn-' + id);
    if (activeBtn) activeBtn.classList.add('active', 'opacity-100');
    renderSOP(id);
}

function setView(mode) {
    const btnWeb = document.getElementById('btn-web');
    const btnPdf = document.getElementById('btn-pdf');
    const viewWeb = document.getElementById('view-web');
    const viewPdf = document.getElementById('view-pdf');

    if (mode === 'web') {
        btnWeb.classList.add('active');
        btnPdf.classList.remove('active');
        viewWeb.classList.remove('hidden');
        viewPdf.classList.add('hidden');
    } else {
        btnPdf.classList.add('active');
        btnWeb.classList.remove('active');
        viewPdf.classList.remove('hidden');
        viewWeb.classList.add('hidden');
    }
}

window.onload = () => {
    buildSidebar();
    const firstId = Object.keys(sopRegistry)[0];
    if(firstId) switchActiveSOP(firstId);
};
