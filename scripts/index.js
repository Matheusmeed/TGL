(function (_window, document) {
    'use strict';

    var $lotofacilBtn = document.getElementById('lotofacilGame');
    var $megasenaBtn = document.getElementById('megasenaGame');
    var $lotomaniaBtn = document.getElementById('lotomaniaGame');

    getData();
    var jsonData, lotofacilInfo, megasenaInfo, lotomaniaInfo;

    async function getData() {
        await fetch('../games.json')
            .then((res) => res.json())
            .then((res) => (jsonData = res));

        handleInfo();
    }

    function handleInfo() {
        jsonData.types.forEach((element) => {
            switch (element.type) {
                case 'Lotofácil':
                    lotofacilInfo = element;
                case 'Mega-Sena':
                    megasenaInfo = element;
                case 'Quina':
                    lotomaniaInfo = element;
                default:
                    break;
            }
        });
    }

    var actualGameInfo;
    var $gameTitle = document.getElementById('gameTitle');
    var $gameDescription = document.getElementById('gameDescription');

    $lotofacilBtn.addEventListener('click', () => handleChooseGame($lotofacilBtn));
    $megasenaBtn.addEventListener('click', () => handleChooseGame($megasenaBtn));
    $lotomaniaBtn.addEventListener('click', () => handleChooseGame($lotomaniaBtn));

    function handleChooseGame(game) {
        lotofacilGame.removeAttribute('style');
        megasenaGame.removeAttribute('style');
        lotomaniaGame.removeAttribute('style');

        if (game == lotofacilGame) {
            actualGameInfo = lotofacilInfo;
        } else if (game == megasenaGame) {
            actualGameInfo = megasenaInfo;
        } else {
            actualGameInfo = lotomaniaInfo;
        }

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

    var $divNumbers = document.getElementsByClassName('divNumbers')[0];
    var numberList,
        selectedNumbers = [];

    function setGameNumbers() {
        $divNumbers.innerHTML = '';
        numberList = [];
        selectedNumbers = [];
        for (let i = 1; i <= actualGameInfo.range; i++) {
            var numberBtn = document.createElement('button');
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
            if (number.value == id) {
                number.style.background = actualGameInfo.color;
                selectedNumbers.push(Number(number.value));
            }
        });
    }

    var $clearGameBtn = document.getElementById('clearGameBtn');
    $clearGameBtn.addEventListener('click', () => clearGame());

    function clearGame() {
        setGameNumbers();
    }

    var $completeGameBtn = document.getElementById('completeGameBtn');
    $completeGameBtn.addEventListener('click', () => completeGame());
    var randomNumbers = [];

    function completeGame() {
        clearGame();
        randomNumbers = [];
        let total = Number(actualGameInfo['max-number']);
        let range = Number(actualGameInfo['range']);

        while (randomNumbers.length < total) {
            var random = Math.floor(Math.random() * range + 1);

            if (!randomNumbers.includes(random)) {
                randomNumbers.push(random);
            }
        }
        randomNumbers.forEach((number) => {
            handleClick(number);
        });
    }

    var addToCartBtn = document.getElementById('addToCartBtn');
    addToCartBtn.addEventListener('click', () => createElement());
    var contId = 0;
    var totalPrice = 0;
    var elements = [];
    var deleteButtons = [];

    function createElement() {
        const noRepeatNumbers = [...new Set(selectedNumbers)];

        if (noRepeatNumbers.length != actualGameInfo['max-number']) {
            alert(`Você deve escolher ${actualGameInfo['max-number']} números!`);
        } else {
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
            divPrice.innerHTML = ` R$ ${actualGameInfo.price}`;
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

    var divFather = document.getElementById('divOverflow');
    var totalPriceDiv = document.getElementById('valorTotal');

    function addElementToCart(divMain) {
        divFather.appendChild(divMain);
        totalPriceDiv.innerHTML = totalPrice;
    }

    function addRemoveListener() {
        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => deleteElement(button.id));
        });
    }

    function deleteElement(btnId) {
        elements.forEach((el) => {
            if (el.id == btnId) {
                var index = elements.indexOf(el);
                if (index > -1) {
                    elements.splice(index, 1);
                }

                el.remove();
                totalPrice -= Number(el.value);
                totalPriceDiv.innerHTML = totalPrice;
            }
        });
    }
})(window, document);
