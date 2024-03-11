import { slike, kreirajMatricu, updateTabela } from "./modules/resursi.js";


let slikeFront;


function restart() {
    document.getElementById('ime').disabled = false;
    const radioIgraChecked = document.querySelector('input[name="tezina-igra"]:checked');
    const divTablaKartica = document.querySelector('.tabla-container');
    const divTabla = document.querySelector('.slike-container');

    if (divTabla) divTablaKartica.removeChild(divTabla);

    switch (radioIgraChecked.value) {
        case 'lako-igra':
            slikeFront = kreirajMatricu(slike, 4);
            document.getElementById('lako-rezultati').checked = true;
            break;
        case 'srednje-igra':
            slikeFront = kreirajMatricu(slike, 6);
            document.getElementById('srednje-rezultati').checked = true;
            break;
        case 'tesko-igra':
            slikeFront = kreirajMatricu(slike, 8);
            document.getElementById('tesko-rezultati').checked = true;
            break;
        case 'ekspert-igra':
            slikeFront = kreirajMatricu(slike, 10);
            document.getElementById('ekspert-rezultati').checked = true;
            break;
    }

    updateTabela();
    clearInterval(timer);
    timer = undefined;
    document.getElementById('vreme').textContent = 0;
    vreme = 0;
    brojacParova = 0;
    brojacKlikova = 0;
    flipped = [];
}


// Upiši rezultat u bazu
function upisiRezultat(nivo, rez) {
    let nivoRezultati = [];
    
    db.collection('nivoi-tezine').doc(nivo)
    .get()
    .then(doc => {
        if (doc.exists) nivoRezultati = doc.data().rezultati;
        nivoRezultati.push(rez);

        return db.collection('nivoi-tezine').doc(nivo)
        .set({rezultati: nivoRezultati})
    })
    .then(() => {
        updateTabela();
        setTimeout(() => confirm('Kraj igre! Da li želite novu igru?') ? restart() : 0, 300);
    })
    .catch(err => console.log(err));
}
/////////////////////////////////////////////////////////////


// On reload
document.getElementById('ime').value = '';
document.getElementById('lako-igra').checked = true;
slikeFront = kreirajMatricu(slike, 4);
document.getElementById('lako-rezultati').checked = true;
updateTabela();


// Restartuj igru (odabrani nivo)
document.getElementById('restart').addEventListener('click', event => {
    event.preventDefault();
    restart();
});


// Promena nivoa težine
document.querySelector('.radio-igra').addEventListener('change', event => {
    event.preventDefault();
    if (event.target.tagName == 'INPUT') restart();
});


document.querySelector('.radio-rezultati').addEventListener('change', event => {
    event.preventDefault();
    if (event.target.tagName == 'INPUT') updateTabela();
});


// Glavna funkcionalnost igrice
let timer;
let vreme = 0;
let brojacParova = 0;
let brojacKlikova = 0;
let flipped = [];

document.querySelector('.tabla-container').addEventListener('click', async event => {
    event.preventDefault();

    if (event.target.tagName == 'IMG') {
        let ime = document.getElementById('ime').value.trim();
        if (ime == '') {
            alert('Unesite korisničko ime');
        } 
        else {
            if (timer === undefined) {
                timer = setInterval(() => {
                    ++vreme;
                    let min = Math.floor(vreme / 60);
                    let sec = (vreme % 60 < 10) ? ('0' + vreme % 60) : vreme % 60;
                    document.getElementById('vreme').textContent = (min > 0) ? `${min}:${sec}` : vreme;
                }, 1000); 
            }

            document.getElementById('ime').disabled = true;

            if (brojacKlikova < 2 && event.target.currentSrc.endsWith('memory.png')) {
                brojacKlikova++;
                flipped.push(event.target);
                event.target.src = `styles/images/${slikeFront[event.target.id]}`;

                if (flipped.length == 2 && flipped[0].src == flipped[1].src) {
                    brojacKlikova = 0;
                    flipped = [];
                    brojacParova++;

                    let radioChecked = document.querySelector('input[name="tezina-igra"]:checked');
                    if ((radioChecked.value == 'lako-igra' && brojacParova == 8) ||
                        (radioChecked.value == 'srednje-igra' && brojacParova == 18) ||
                        (radioChecked.value == 'tesko-igra' && brojacParova == 32) ||
                        (radioChecked.value == 'ekspert-igra' && brojacParova == 50)) {

                        clearInterval(timer);
                        timer = undefined;
                        
                        let rezultat = {};
                        rezultat['ime'] = ime;
                        rezultat['vreme'] = vreme;

                        if (radioChecked.value == 'lako-igra') upisiRezultat('lako', rezultat); 
                        else if (radioChecked.value == 'srednje-igra') upisiRezultat('srednje', rezultat);
                        else if (radioChecked.value == 'tesko-igra') upisiRezultat('tesko', rezultat);
                        else if (radioChecked.value == 'ekspert-igra') upisiRezultat('ekspert', rezultat);
                    }

                } else if (brojacKlikova == 2 && !(flipped[0].src == flipped[1].src)) {
                    setTimeout(() => {
                        flipped.forEach(card => {
                            card.src = 'styles/images/memory.png';
                        })
                        brojacKlikova = 0;
                        flipped = [];
                    }, 666)
                }
            }
        }        
    }
});