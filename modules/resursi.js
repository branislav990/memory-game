const slike = ['alien-ship.png', 'baby.png', 'basketball.png', 'bat-with-sharp-wings-silhouette.png', 'beer-mug.png', 'books.png', 'box-truck.png', 'butterfly.png', 'c-.png', 'cactus.png', 'chandelier.png', 'chess-piece.png', 'clock.png', 'crayfish.png', 'earth-globe.png', 'fishing-rod.png', 'flower.png', 'frog-prince.png', 'guitar-music.png', 'hacker.png', 'help.png', 'hive.png', 'island.png', 'kangaroo.png', 'microphone.png', 'microscope-science.png', 'mountains.png', 'old-video-camera.png', 'paint-palette.png', 'pi-mathematical-constant-symbol.png', 'pirate-ship.png', 'python.png', 'santa-claus-face.png', 'saturn.png', 'serpent.png', 'ship-wheel.png', 'snail.png', 'sound.png', 'spider.png', 'storm.png', 'structure.png', 'tea-pot.png', 'tennis-racket.png', 'tiger.png', 'toucan.png', 'trophy-cup.png', 'villager.png', 'web-programming.png', 'whale.png', 'wool-ball.png'];


function permutacija(niz) {
    for (let i = niz.length-1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [niz[i], niz[j]] = [niz[j], niz[i]];
    }
}


function kreirajMatricu(nizSlika, brKolona) {
    const divTablaKartica = document.querySelector('.tabla-container');
    permutacija(nizSlika);
    let slikeLice = [];
    for (let i = 0; i < brKolona * (brKolona / 2); i++) {
        slikeLice.push(nizSlika[i]);
        slikeLice.push(nizSlika[i]);
    }
    permutacija(slikeLice);

    let divTabla = document.createElement('div');
    divTabla.classList.add('slike-container');
    divTabla.style.gridTemplateColumns = `repeat(${brKolona}, 1fr)`;
    divTablaKartica.appendChild(divTabla);
    
    for (let i = 0; i < brKolona ** 2; i++) {

        let imgCard = document.createElement('img');
        imgCard.src = 'styles/images/memory.png';
        imgCard.alt = 'memory card';
        imgCard.classList.add('img-card');
        imgCard.id = i;
        divTabla.appendChild(imgCard);
    }
    return slikeLice;
}


function kreirajTabeluRezultata(nivoTezine) {
    db.collection('nivoi-tezine').doc(nivoTezine)
    .get()
    .then(doc => {
        if (doc.exists) {
            let rezNivo = doc.data().rezultati;
            rezNivo.sort((a, b) => a.vreme - b.vreme);

            for (let i = 0; i < 10; i++) {
                const td2 = document.getElementById(`td-${i}-2`);
                const td3 = document.getElementById(`td-${i}-3`);
                if (rezNivo[i]) {
                    td2.textContent = rezNivo[i].ime;
                    
                    let min = Math.floor(rezNivo[i].vreme / 60);
                    let sec = (rezNivo[i].vreme % 60 < 10) ? ('0' + rezNivo[i].vreme % 60) : rezNivo[i].vreme % 60;
                    td3.textContent = (min > 0) ? `${min}:${sec}` : rezNivo[i].vreme;
                } 
                else {
                    td2.textContent = '';
                    td3.textContent = '';
                }
            }
        } 
        else {
            for (let i = 0; i < 10; i++) {
                const td2 = document.getElementById(`td-${i}-2`);
                const td3 = document.getElementById(`td-${i}-3`);
                td2.textContent = '';
                td3.textContent = '';
            }
        }
    })
    .catch(err => console.log(err));
}


function updateTabela() {
    const radioRezultatiChecked = document.querySelector('input[name="tezina-rezultati"]:checked');
    const tabelaRezultata = document.querySelector('table');
    const tbodyRezultati = document.getElementById('telo-tabele');

    if (tbodyRezultati) tabelaRezultata.removeChild(tbodyRezultati);

    switch (radioRezultatiChecked.value) {
        case 'lako-rezultati':
            kreirajTabeluRezultata('lako');
            break;
        case 'srednje-rezultati':
            kreirajTabeluRezultata('srednje');
            break;
        case 'tesko-rezultati':
            kreirajTabeluRezultata('tesko');
            break;
        case 'ekspert-rezultati':
            kreirajTabeluRezultata('ekspert');
            break;
    }
}


export { slike, kreirajMatricu, updateTabela };