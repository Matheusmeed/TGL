(function (_window, document) {
    'use strict';

    getData();
    let jsonData;
    let games = [];

    async function getData() {
        await fetch('../games.json')
            .then((res) => res.json())
            .then((res) => (jsonData = res));

        handleInfo();
    }

    function handleInfo() {
        jsonData.types.forEach((element) => {
            games.push(element);
        });
        createGamesBtn();
    }

    const $gamesDiv = document.getElementById('gamesDiv');
    let gameBtns = [];

    function createGamesBtn() {
        games.forEach((el) => {
            let newBtn = document.createElement('button');
            newBtn.className = 'chooseGameBtn';
            newBtn.id = el.type;
            newBtn.innerHTML = el.type;
            newBtn.setAttribute('color', el.color);
            newBtn.style.color = el.color;
            newBtn.style.borderColor = el.color;
            newBtn.addEventListener('click', () => handleChooseGame(newBtn));
            if (newBtn.id == 'Lotofácil') {
                handleChooseGame(newBtn);
            }
            gameBtns.push(newBtn);
        });
        showGameButtons();
    }

    function showGameButtons() {
        gameBtns.forEach((el) => {
            $gamesDiv.appendChild(el);
        });
    }

    let actualGameInfo;
    let $gameTitle = document.getElementById('gameTitle');
    let $gameDescription = document.getElementById('gameDescription');

    // Inciar com primeiro jogo : n feita ainda

    function handleChooseGame(game) {
        gameBtns.forEach((el) => {
            if (el != game) {
                el.style.color = el.getAttribute('color');
                el.style.removeProperty('background');
            }
        });

        games.forEach((el) => {
            if (el.type == game.id) {
                actualGameInfo = el;
            }
        });

        setStyle(game);
        setGameNumbers();
    }

    function setStyle(game) {
        game.style.color = 'white';
        game.style.borderColor = actualGameInfo.color;
        game.style.background = actualGameInfo.color;
        $gameTitle.innerHTML = actualGameInfo.type.toUpperCase();
        $gameDescription.innerHTML = actualGameInfo.description;
    }

    const $divNumbers = document.getElementsByClassName('divNumbers')[0];
    let numberList,
        selectedNumbers = [];
    let qtdNumeros = document.getElementById('qtdNumeros');

    function setGameNumbers() {
        $divNumbers.innerHTML = '';
        numberList = [];
        selectedNumbers = [];
        qtdNumeros.innerHTML = selectedNumbers.length;
        qtdNumeros.style.color = actualGameInfo.color;
        for (let i = 1; i <= actualGameInfo.range; i++) {
            let numberBtn = document.createElement('button');
            numberBtn.innerHTML = i;
            numberBtn.value = i;
            numberList.push(numberBtn);
        }
        numberList.forEach((number) => $divNumbers.appendChild(number));
        listenNumber();
    }

    function listenNumber() {
        numberList.forEach((number) => {
            number.addEventListener('click', () => handleClick(number.value));
        });
    }

    function handleClick(id) {
        numberList.forEach((number) => {
            if (number.value == id && !number.getAttribute('selecionado')) {
                if (selectedNumbers.length == Number(actualGameInfo['max-number'])) {
                    alert(`Você já adicionou ${actualGameInfo['max-number']} números!`);
                } else {
                    number.style.background = actualGameInfo.color;
                    number.setAttribute('selecionado', true);
                    selectedNumbers.push(Number(number.value));
                    qtdNumeros.innerHTML = selectedNumbers.length;
                }
            } else if (number.value == id && number.getAttribute('selecionado')) {
                number.style.removeProperty('background');
                number.removeAttribute('selecionado');
                let index = selectedNumbers.indexOf(Number(id));

                if (index > -1) {
                    selectedNumbers.splice(index, 1);
                }
                qtdNumeros.innerHTML = selectedNumbers.length;
            }
        });
    }

    const $clearGameBtn = document.getElementById('clearGameBtn');
    $clearGameBtn.addEventListener('click', () => clearGame());

    function clearGame() {
        setGameNumbers();
    }

    const $completeGameBtn = document.getElementById('completeGameBtn');
    $completeGameBtn.addEventListener('click', () => completeGame());
    let randomNumbers = [];

    function completeGame() {
        randomNumbers = [];
        let total = Number(actualGameInfo['max-number']) - selectedNumbers.length;
        let range = Number(actualGameInfo['range']);

        while (randomNumbers.length < total) {
            let random = Math.floor(Math.random() * range + 1);

            if (!randomNumbers.includes(random)) {
                if (!selectedNumbers.includes(random)) {
                    randomNumbers.push(random);
                }
            }
        }
        randomNumbers.forEach((number) => {
            handleClick(number);
        });
    }

    const addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => createElement());
    let contId = 0;
    let totalPrice = 0;
    let elements = [];
    let deleteButtons = [];
    let numbers = [];

    function verifyNumber(noRepeatNumbers) {
        let retorno = false;
        numbers.forEach((num) => {
            if (num.toString() == noRepeatNumbers.toString()) {
                retorno = true;
            }
        });
        return retorno;
    }

    function createElement() {
        let noRepeatNumbers = [...new Set(selectedNumbers)];

        if (noRepeatNumbers.length != actualGameInfo['max-number']) {
            if (noRepeatNumbers.length < actualGameInfo['max-number']) {
                alert(`Você deve escolher ${actualGameInfo['max-number']} números! Ainda faltam ${actualGameInfo['max-number'] - noRepeatNumbers.length} números.`);
            }
        } else {
            noRepeatNumbers.sort((a, b) => a - b);

            if (verifyNumber(noRepeatNumbers)) {
                alert('Essa aposta já foi realizada.');
            } else {
                numbers.push(noRepeatNumbers);
                clearGame();
                let selectedNumbersStr = noRepeatNumbers.sort((a, b) => a - b).join(', ');
                let id = (contId += 1);
                totalPrice += Number(actualGameInfo.price);

                // Botão para remover aposta
                let img = document.createElement('img');
                img.className = 'lixeiraImg';
                img.src = 'images/lixeira.png';
                let button = document.createElement('button');
                button.id = id;
                button.className = 'lixeiraBtn';
                button.style.borderRightColor = actualGameInfo.color;
                button.appendChild(img);

                // div contendo nome do jogo, preço e números apostados
                let divInfo = document.createElement('div');
                let divNumbers = document.createElement('div');
                divNumbers.innerHTML = selectedNumbersStr;
                let divGameName = document.createElement('div');
                divGameName.innerHTML = actualGameInfo.type;
                divGameName.style.color = actualGameInfo.color;
                divGameName.className = 'game';
                let divPrice = document.createElement('div');
                divPrice.innerHTML = ` R$ ${realConvert(actualGameInfo.price)}`;
                divPrice.className = 'd-inline';

                divInfo.appendChild(divNumbers, divGameName, divPrice);
                divInfo.appendChild(divGameName);
                divInfo.appendChild(divPrice);

                // Div Pai
                let divMain = document.createElement('div');
                divMain.id = id;
                divMain.value = actualGameInfo.price;
                divMain.className = 'cardApostas';
                divMain.appendChild(button);
                divMain.appendChild(divInfo);

                deleteButtons.push(button);
                elements.push(divMain);
                addElementToCart(divMain);
                addRemoveListener();
            }
        }
    }

    const divFather = document.getElementById('divOverflow');
    const totalPriceDiv = document.getElementById('valorTotal');
    let noBet = document.getElementById('semAposta');

    function addElementToCart(divMain) {
        noBet.innerHTML = '';
        divFather.appendChild(divMain);
        totalPriceDiv.innerHTML = realConvert(totalPrice);
    }

    function addRemoveListener() {
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => deleteElement(button.id));
        });
    }

    function deleteElement(btnId) {
        elements.forEach((el) => {
            if (el.id == btnId) {
                let index = elements.indexOf(el);
                if (index > -1) {
                    elements.splice(index, 1);
                }

                if (elements.length == 0) {
                    noBet.innerHTML = 'Você ainda não possui apostas... Escolha o seu jogo favorito, preencha os números e teste a sua sorte fazendo a sua aposta!';
                }

                el.remove();
                totalPrice -= Number(el.value);
                totalPriceDiv.innerHTML = realConvert(totalPrice);
            }
        });
    }

    function realConvert(num) {
        return num.toLocaleString('pt-br', { minimumFractionDigits: 2 });
    }
})(window, document);
