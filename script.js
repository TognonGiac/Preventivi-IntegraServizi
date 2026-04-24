// Mostra il modulo giusto quando si seleziona il menu a tendina
function mostraModulo() {
    const selezione = document.getElementById("tipo_preventivo").value;
    document.getElementById("modulo_huawei").style.display = (selezione === "HUAWEI") ? "block" : "none";
}

// 1. LE TUE COORDINATE (Tradotte da coordinate.py)
// Sostituisci questi numeri di esempio con quelli veri del tuo file coordinate.py
const coordinate_HUAWEI = {
    "data": [0, 165, 655], // [pagina (0 = prima pagina), x, y]
    "referente": [0, 165, 630],
    "telefono":[0, 165, 600],
    "cliente": [0, 330, 630],
    "indirizzo": [0, 330, 577],
    "telefono_cliente": [0, 380, 553],
    "email_cliente": [0, 357, 527],
    "indirizzo_installazione": [0, 70, 531],
    
    "kwh_totali": [0, 190, 435],
    "n_sistemi": [0, 80, 360],
    "prezzo": [0, 240, 125],      // Esempio: Pagina 2 (indice 1)
    "piu' iva": [0, 430, 125],
    "chiavi in mano": [1, 220, 705],
};

// 2. FUNZIONE PER GENERARE IL PDF
async function generaPdfHuawei() {
    // A. Raccogliamo e formattiamo i dati dai campi HTML (esattamente come facevi in Python)
    const cliente = document.getElementById("h_cliente").value;
    const kwh = parseFloat(document.getElementById("h_kwh").value || 0);
    const prezzo = parseFloat(document.getElementById("h_prezzo_base").value || 0);
    const totale = parseFloat(document.getElementById("h_totale_finale").value || 0);

    const kwh_formattato = kwh.toFixed(2).replace('.', ',');
    const prezzo_formattato = prezzo.toLocaleString('it-IT', { minimumFractionDigits: 2 }) + " €";
    const totale_formattato = totale.toLocaleString('it-IT', { minimumFractionDigits: 2 }) + " €";

    const dati_inseriti = {
        "data": document.getElementById("h_data").value,
        "referente": document.getElementById("h_referente").value,
        "cliente": cliente,
        "indirizzo": document.getElementById("h_indirizzo").value,
        "kwh_totali": kwh_formattato,
        "n_sistemi": document.getElementById("h_sistemi").value,
        "prezzo": prezzo_formattato,
        "chiavi in mano": totale_formattato
    };

    try {
        // B. Scarichiamo il PDF vuoto dalla tua cartella assets su GitHub
        // (Assicurati che il percorso sia giusto!)
        const url_pdf = 'assets/BATTERIE ACCUMULO HUAWEI.pdf';
        const existingPdfBytes = await fetch(url_pdf).then(res => res.arrayBuffer());

        // Carichiamo il PDF nella libreria
        const pdfDoc = await PDFLib.PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        
        // Impostiamo il font (Helvetica)
        const fontNormale = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);

        // C. Scriviamo i testi sul PDF usando le coordinate!
        for (const [chiave, valore] of Object.entries(dati_inseriti)) {
            if (coordinate_HUAWEI[chiave]) {
                const [num_pagina, x, y] = coordinate_HUAWEI[chiave];
                const pagina = pages[num_pagina]; // Prende la pagina giusta (0, 1, 2...)

                // Se è "chiavi in mano" usa il grassetto, altrimenti normale
                const fontScelto = (chiave === "chiavi in mano") ? fontBold : fontNormale;
                const grandezza = (chiave === "chiavi in mano") ? 16 : 12;

                pagina.drawText(String(valore), {
                    x: x,
                    y: y,
                    size: grandezza,
                    font: fontScelto,
                    color: PDFLib.rgb(0, 0, 0)
                });
            }
        }

        // D. Salviamo e facciamo scaricare il file allo zio
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        const nomeClientePulito = cliente.replace(/\s+/g, '_');
        link.download = `Preventivo_Integra_${nomeClientePulito}.pdf`;
        link.click(); // Simula il click per scaricare!

    } catch (error) {
        alert("Errore nella generazione del PDF: " + error.message);
    }
}
