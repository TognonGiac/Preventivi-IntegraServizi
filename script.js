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

const coordinate_HUAWEI_MONOFASE = {
    "data": [0, 165, 655], 
    "referente": [0, 165, 630],
    "telefono": [0, 165, 605],
    "cliente": [0, 330, 630],
    "indirizzo": [0, 330, 577],
    "telefono_cliente": [0, 380, 529],
    "email_cliente": [0, 360, 502],
    "indirizzo_installazione": [0, 70, 506],
    
    // NUOVI CAMPI FOTOVOLTAICO
    "potenza": [0, 270, 445],
    "kwh_totali": [0, 235, 417], 
    "n_moduli": [1, 83, 745],
    "n_sistemi": [2, 80, 775], 
    
    "prezzo": [2, 240, 547],      
    "piu' iva": [2, 438, 547],
    "chiavi in mano": [2, 220, 392],
    "note": [4, 57, 740]
};

const coordinate_SUNGROW_MONOFASE = {
    // Pagina 1 (indice 0)
    "data": [0, 165, 655],
    "referente": [0, 165, 630],
    "telefono": [0, 165, 605],
    "cliente": [0, 330, 630],
    "indirizzo": [0, 330, 578],
    "telefono_cliente": [0, 380, 555],
    "email_cliente": [0, 362, 527],
    "indirizzo_installazione": [0, 70, 511],
    "potenza_nominale": [0, 280, 445],
    "kwh_totali": [0, 243, 416],  
    
    // Pagina 2 (indice 1)
    "moduli": [1, 85, 745],
    
    // Pagina 3 (indice 2)
    "sistemi di accumulo": [2, 85, 598],
    "prezzo": [2, 240, 135],
    "piu' iva": [2, 438, 135],

    // Pagina 4 (indice 3)
    "Ottimizzazione Tigo": [3, 84, 630],
    "Prezzo Tigo": [3, 310, 365],
    "Prezzo Tigo piu' iva": [3, 491, 365],
    "Ottimizzatore Sungrow": [3, 83, 337],
    "Prezzo Sungrow": [3, 312, 70],
    "Prezzo Sungrow piu' iva": [3, 500, 70],
    
    // Pagina 5 (indice 4)
    "chiavi in mano": [4, 220, 657],

    // Pagina 7 (indice 6)
    "note": [6, 76, 735],
};

//2. Funzione per mostrare il modulo giusto (quella che abbiamo visto prima)
function mostraModulo() {
    const selezione = document.getElementById("tipo_preventivo").value;
    
    document.getElementById("modulo_huawei").style.display = "none";
    document.getElementById("modulo_huawei_monofase").style.display = "none";
    document.getElementById("modulo_sungrow_monofase").style.display = "none";

    if (selezione === "HUAWEI") {
        document.getElementById("modulo_huawei").style.display = "block";
    } else if (selezione === "HUAWEI_MONOFASE") {
        document.getElementById("modulo_huawei_monofase").style.display = "block";
    } else if (selezione === "SUNGROW_MONOFASE") {
        document.getElementById("modulo_sungrow_monofase").style.display = "block";
    }
}
// 3. FUNZIONE PER GENERARE IL PDF
async function generaPdfHuawei() {
    try {
        // A. Raccogliamo i dati dai campi HTML come TESTO (senza forzare lo 0)
        const kwh_val = document.getElementById("h_kwh").value;
        const n_sistemi_val = document.getElementById("h_sistemi").value;
        const prezzoSenzaIva_val = document.getElementById("h_prezzo_base").value;
        const prezzoTotale_val = document.getElementById("h_totale").value;

        // Nuova funzione: se la casella è vuota, restituisce "" (niente), altrimenti formatta il numero
        const trasformaInFormatoItaliano = (valoreInput) => {
            if (valoreInput === "" || valoreInput === null) {
                return ""; // Ritorna vuoto se non scrivi nulla
            }
            return parseFloat(valoreInput).toLocaleString('it-IT', { 
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
            
            // Usiamo i valori presi sopra. Se "n_sistemi" è vuoto, non scrive nulla.
            "n_sistemi": n_sistemi_val, 
            "kwh_totali": trasformaInFormatoItaliano(kwh_val),
            "prezzo": trasformaInFormatoItaliano(prezzoSenzaIva_val),
            "piu' iva": trasformaInFormatoItaliano(prezzoTotale_val),
            "chiavi in mano": trasformaInFormatoItaliano(prezzoTotale_val)
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
        
        // MODIFICA NOME FILE: Se c'è il nome lo aggiunge, altrimenti lascia solo il nome base
        const suffissoCliente = dati_inseriti.cliente ? `_${dati_inseriti.cliente.replace(/\s+/g, '_')}` : "";
        link.download = `Preventivo_Batterie_Accumulo_HUAWEI${suffissoCliente}.pdf`;
        link.click();

    } catch (err) {
        console.error(err);
        alert("Errore: " + err.message);
    }
}

async function generaPdfHuaweiMonofase() {
    try {
        // Funzione per formattare la valuta vuota (uguale a prima)
        const trasformaInFormatoItaliano = (valoreInput) => {
            if (valoreInput === "" || valoreInput === null) return "";
            return parseFloat(valoreInput).toLocaleString('it-IT', { 
                minimumFractionDigits: 2, maximumFractionDigits: 2 
            });
        };

        const dati_inseriti = {
            "data": document.getElementById("hm_data").value,
            "referente": document.getElementById("hm_referente").value,
            "telefono": document.getElementById("hm_telefono_ref").value,
            "cliente": document.getElementById("hm_cliente").value,
            "indirizzo": document.getElementById("hm_indirizzo").value,
            "telefono_cliente": document.getElementById("hm_telefono_cliente").value,
            "email_cliente": document.getElementById("hm_email_cliente").value,
            "indirizzo_installazione": document.getElementById("hm_indirizzo_inst").value,
            
            // Nuovi campi
            "potenza": document.getElementById("hm_potenza").value,
            "n_moduli": document.getElementById("hm_moduli").value,
            "note": document.getElementById("hm_note").value,

            "n_sistemi": document.getElementById("hm_sistemi").value, 
            "kwh_totali": trasformaInFormatoItaliano(document.getElementById("hm_kwh").value),
            "prezzo": trasformaInFormatoItaliano(document.getElementById("hm_prezzo_base").value),
            "piu' iva": trasformaInFormatoItaliano(document.getElementById("hm_totale").value),
            "chiavi in mano": trasformaInFormatoItaliano(document.getElementById("hm_totale").value)
        };

        // ASSICURATI CHE IL NOME DEL FILE SIA ESATTO A QUELLO NELLA CARTELLA ASSETS
        const url_pdf = 'assets/MASTER HUAWEI MONOFASE.pdf'; 
        const bytesOriginali = await fetch(url_pdf).then(res => {
            if (!res.ok) throw new Error("File PDF Monofase non trovato in assets!");
            return res.arrayBuffer();
        });

        const pdfDoc = await PDFLib.PDFDocument.load(bytesOriginali);
        const pages = pdfDoc.getPages();
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const fontNormale = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        // Scrittura
        for (const [chiave, valore] of Object.entries(dati_inseriti)) {
            if (coordinate_HUAWEI_MONOFASE[chiave] && valore !== "") {
                const [numPagina, x, y] = coordinate_HUAWEI_MONOFASE[chiave];
                const pagina = pages[numPagina];

                const fontDaUsare = (chiave === "chiavi in mano") ? fontBold : fontNormale;
                const dimensione = (chiave === "chiavi in mano") ? 14 : 11;

                // Prepariamo le opzioni base per scrivere il testo
                const opzioniTesto = {
                    x: x,
                    y: y,
                    size: dimensione,
                    font: fontDaUsare,
                    color: PDFLib.rgb(0, 0, 0),
                };

                // SE stiamo scrivendo il campo "note", attiviamo l'a capo automatico!
                if (chiave === "note") {
                    opzioniTesto.maxWidth = 460;   // Larghezza massima prima di andare a capo (puoi abbassarlo o alzarlo)
                    opzioniTesto.lineHeight = 14;  // Distanza tra una riga e l'altra
                }

                // Disegniamo il testo sul PDF
                pagina.drawText(String(valore), opzioniTesto);
            }
        }

        // Download
        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        const suffissoCliente = dati_inseriti.cliente ? `_${dati_inseriti.cliente.replace(/\s+/g, '_')}` : "";
        link.download = `Preventivo_HUAWEI_MONOFASE${suffissoCliente}.pdf`;
        link.click();

    } catch (err) {
        console.error(err);
        alert("Errore: " + err.message);
    }
}

async function generaPdfSungrowMonofase() {
    try {
        const trasformaInFormatoItaliano = (valoreInput) => {
            if (valoreInput === "" || valoreInput === null) return "";
            return parseFloat(valoreInput).toLocaleString('it-IT', { 
                minimumFractionDigits: 2, maximumFractionDigits: 2 
            });
        };

        const dati_inseriti = {
            "data": document.getElementById("sm_data").value,
            "referente": document.getElementById("sm_referente").value,
            "telefono": document.getElementById("sm_telefono_ref").value,
            "cliente": document.getElementById("sm_cliente").value,
            "indirizzo": document.getElementById("sm_indirizzo").value,
            "telefono_cliente": document.getElementById("sm_telefono_cliente").value,
            "email_cliente": document.getElementById("sm_email_cliente").value,
            "indirizzo_installazione": document.getElementById("sm_indirizzo_inst").value,
            
            "potenza_nominale": document.getElementById("sm_potenza").value,
            "kwh_totali": trasformaInFormatoItaliano(document.getElementById("sm_kwh").value),
            "moduli": document.getElementById("sm_moduli").value,
            "sistemi di accumulo": document.getElementById("sm_sistemi").value,
            
            "prezzo": trasformaInFormatoItaliano(document.getElementById("sm_prezzo_base").value),
            "piu' iva": trasformaInFormatoItaliano(document.getElementById("sm_totale_iva").value),
            
            // TIGO
            "Ottimizzazione Tigo": document.getElementById("sm_n_tigo").value,
            "Prezzo Tigo": trasformaInFormatoItaliano(document.getElementById("sm_prezzo_tigo_base").value),
            "Prezzo Tigo piu' iva": trasformaInFormatoItaliano(document.getElementById("sm_prezzo_tigo_iva").value),
            
            // SUNGROW
            "Ottimizzatore Sungrow": document.getElementById("sm_n_sungrow").value,
            "Prezzo Sungrow": trasformaInFormatoItaliano(document.getElementById("sm_prezzo_sungrow_base").value),
            "Prezzo Sungrow piu' iva": trasformaInFormatoItaliano(document.getElementById("sm_prezzo_sungrow_iva").value),
            
            "chiavi in mano": trasformaInFormatoItaliano(document.getElementById("sm_chiavi_in_mano").value),
            "note": document.getElementById("sm_note").value
        };

        const url_pdf = 'assets/MASTER SUNGROW MONOFASE.pdf'; 
        const bytesOriginali = await fetch(url_pdf).then(res => {
            if (!res.ok) throw new Error("File PDF Sungrow Monofase non trovato in assets!");
            return res.arrayBuffer();
        });

        const pdfDoc = await PDFLib.PDFDocument.load(bytesOriginali);
        const pages = pdfDoc.getPages();
        const fontBold = await pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
        const fontNormale = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

        for (const [chiave, valore] of Object.entries(dati_inseriti)) {
            if (coordinate_SUNGROW_MONOFASE[chiave] && valore !== "") {
                const [numPagina, x, y] = coordinate_SUNGROW_MONOFASE[chiave];
                const pagina = pages[numPagina];

                const fontDaUsare = (chiave === "chiavi in mano") ? fontBold : fontNormale;
                const dimensione = (chiave === "chiavi in mano") ? 14 : 11;

                const opzioniTesto = {
                    x: x,
                    y: y,
                    size: dimensione,
                    font: fontDaUsare,
                    color: PDFLib.rgb(0, 0, 0),
                };

                if (chiave === "note") {
                    opzioniTesto.maxWidth = 450;
                    opzioniTesto.lineHeight = 14;
                }

                pagina.drawText(String(valore), opzioniTesto);
            }
        }

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        
        const suffissoCliente = dati_inseriti.cliente ? `_${dati_inseriti.cliente.replace(/\s+/g, '_')}` : "";
        link.download = `Preventivo_SUNGROW_MONOFASE${suffissoCliente}.pdf`;
        link.click();

    } catch (err) {
        console.error(err);
        alert("Errore: " + err.message);
    }
}

function toggleTema() {
    // Il comando toggle aggiunge la classe se non c'è, e la toglie se c'è.
    document.body.classList.toggle("light-mode");
}
