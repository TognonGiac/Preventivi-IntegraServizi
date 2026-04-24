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

//2. Funzione per mostrare il modulo giusto (quella che abbiamo visto prima)
function mostraModulo() {
    const selezione = document.getElementById("tipo_preventivo").value;
    const modulo = document.getElementById("modulo_huawei");
    if (selezione === "HUAWEI") {
        modulo.style.display = "block";
    } else {
        modulo.style.display = "none";
    }
}
// 3. FUNZIONE PER GENERARE IL PDF
async function generaPdfHuawei() {
    try{
        // A. Raccogliamo e formattiamo i dati dai campi HTML (esattamente come facevi in Python)
        const kwh = parseFloat(document.getElementById("h_kwh").value || 0);
        const prezzoSenzaIva = parseFloat(document.getElementById("h_prezzo_base").value || 0);
        const prezzoTotale = parseFloat(document.getElementById("h_totale").value || 0);
    
        const trasformaInFormatoItaliano = (numero) => {
            return numero.toLocaleString('it-IT', { 
                minimumFractionDigits: 2, 
                maximumFractionDigits: 2 
            });
        };
    
        const dati_inseriti = {
            "data": document.getElementById("h_data").value,
            "referente": document.getElementById("h_referente").value,
            "telefono": document.getElementById("h_telefono_ref").value,
            "cliente": document.getElementById("h_cliente").value,
            "indirizzo": document.getElementById("h_indirizzo").value,
            "telefono_cliente": document.getElementById("h_telefono_cliente").value,
            "email_cliente": document.getElementById("h_email_cliente").value,
            "indirizzo_installazione": document.getElementById("h_indirizzo_inst").value,
            "n_sistemi": document.getElementById("h_sistemi").value,
            "kwh_totali": trasformaInFormatoItaliano(kwh),
            "prezzo": trasformaInFormatoItaliano(prezzoSenzaIva),
            "piu' iva": trasformaInFormatoItaliano(prezzoTotale),
            "chiavi in mano": trasformaInFormatoItaliano(prezzoTotale)
        };

        // B. Caricamento del PDF originale dalla cartella assets
        const url_pdf = 'assets/BATTERIE ACCUMULO HUAWEI.pdf';
        const bytesOriginali = await fetch(url_pdf).then(res => {
            if (!res.ok) throw new Error("File PDF non trovato in assets!");
            return res.arrayBuffer();
        });

        // C. Magia con pdf-lib
        const pdfDoc = await PDFLib.PDFDocument.load(bytesOriginali);
        const pages = pdfDoc.getPages();
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const fontNormale = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        // D. Scrittura sulle coordinate
        for (const [chiave, valore] of Object.entries(dati_inseriti)) {
            if (coordinate_HUAWEI[chiave]) {
                const [numPagina, x, y] = coordinate_HUAWEI[chiave];
                const pagina = pages[numPagina];

                const fontDaUsare = (chiave === "chiavi in mano") ? fontBold : fontNormale;
                const dimensione = (chiave === "chiavi in mano") ? 14 : 11;

                pagina.drawText(String(valore), {
                    x: x,
                    y: y,
                    size: dimensione,
                    font: fontDaUsare,
                    color: PDFLib.rgb(0, 0, 0),
                });
            }
        }

        // E. Download automatico
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Preventivo_HUAWEI_${dati_inseriti.cliente.replace(/\s+/g, '_')}.pdf`;
        link.click();

    } catch (err) {
        console.error(err);
        alert("Errore: " + err.message);
    }
}
