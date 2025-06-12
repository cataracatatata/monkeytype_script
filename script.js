// хуйню эту вставляйте в консоль браузера короче или как там ещё можно ну понятно ебать

(function() {
    var isExpanded = false;
    var isToggled = false;
    var Index = 0;
    var typeWord = "";

    // Создаем плавающую панель
    var rect = document.createElement('div');
    rect.style.position = 'absolute';
    rect.style.top = '50%';
    rect.style.left = '50%';
    rect.style.width = '300px';
    rect.style.height = '35px';
    rect.style.backgroundColor = 'rgba(229, 222, 255, 0.2)';
    rect.style.backdropFilter = 'blur(10px)';
    rect.style.border = '1px solid rgba(234, 56, 76, 0.3)';
    rect.style.borderRadius = '10px';
    rect.style.boxShadow = '0 4px 15px rgba(234, 56, 76, 0.2)';
    rect.style.transform = 'translate(-50%, -50%)';
    rect.style.zIndex = '9999';
    rect.style.display = 'flex';
    rect.style.flexDirection = 'column';
    rect.style.padding = '0 10px';
    rect.style.transition = 'height 0.3s ease';
    document.body.appendChild(rect);

    // Контейнер для верхней части (toggle и resize)
    var topContainer = document.createElement('div');
    topContainer.style.display = 'flex';
    topContainer.style.alignItems = 'center';
    topContainer.style.height = '35px';
    topContainer.style.width = '100%';
    topContainer.style.position = 'relative';
    rect.appendChild(topContainer);

    // Переключатель
    var toggleContainer = document.createElement('div');
    toggleContainer.style.width = '40px';
    toggleContainer.style.height = '20px';
    toggleContainer.style.backgroundColor = 'rgba(234, 56, 76, 0.3)';
    toggleContainer.style.borderRadius = '10px';
    toggleContainer.style.position = 'relative';
    toggleContainer.style.cursor = 'pointer';
    toggleContainer.style.transition = 'background-color 0.3s ease';
    topContainer.appendChild(toggleContainer);

    var toggleCircle = document.createElement('div');
    toggleCircle.style.width = '16px';
    toggleCircle.style.height = '16px';
    toggleCircle.style.backgroundColor = '#ea384c';
    toggleCircle.style.borderRadius = '50%';
    toggleCircle.style.position = 'absolute';
    toggleCircle.style.top = '2px';
    toggleCircle.style.left = '2px';
    toggleCircle.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    toggleCircle.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
    toggleContainer.appendChild(toggleCircle);

    // Кнопка resize
    var resizeButton = document.createElement('button');
    resizeButton.innerHTML = '↕️';
    resizeButton.style.marginLeft = 'auto';
    resizeButton.style.background = 'none';
    resizeButton.style.border = 'none';
    resizeButton.style.color = '#ea384c';
    resizeButton.style.cursor = 'pointer';
    topContainer.appendChild(resizeButton);

    // Контейнер для инпутов
    var inputsContainer = document.createElement('div');
    inputsContainer.style.display = 'none';
    inputsContainer.style.flexDirection = 'column';
    inputsContainer.style.padding = '10px 0';
    rect.appendChild(inputsContainer);

    function createInputGroup(labelText, defaultValue = 0, id) {
        var group = document.createElement('div');
        group.className = 'input-group';
        group.style.margin = '5px 0';
        var label = document.createElement('label');
        label.textContent = labelText;
        label.style.color = '#ea384c';
        label.style.marginRight = '10px';
        var input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = '100';
        input.value = defaultValue;
        input.style.background = 'rgba(255,255,255,0.1)';
        input.style.border = '1px solid rgba(234,56,76,0.3)';
        input.style.borderRadius = '4px';
        input.style.color = '#ea384c';
        input.style.padding = '2px 5px';
        if (id) input.id = id;
        group.appendChild(label);
        group.appendChild(input);
        return group;
    }

    // Добавляем инпуты
    var inputs = {
        errorChance: createInputGroup('Error chance', 15, 'errorChance'),
        swapChars: createInputGroup('Swap chars', 5, 'swapChars'),
        neighborChars: createInputGroup('Neighbor chars', 15, 'neighborChars'),
        wordLastChar: createInputGroup('Word last char', 50, 'wordLastChar'),
        cutLastChars: createInputGroup('Cut last chars', 1, 'cutLastChars')
    };
    Object.values(inputs).forEach(function(group) {
        inputsContainer.appendChild(group);
    });

    // Обработчики событий
    resizeButton.addEventListener('click', function(e) {
        e.stopPropagation();
        isExpanded = !isExpanded;
        rect.style.height = isExpanded ? '215px' : '35px';
        inputsContainer.style.display = isExpanded ? 'flex' : 'none';
    });

    var isDragging = false, offsetX, offsetY;
    rect.addEventListener('mousedown', function(e) {
        isDragging = true;
        var rectPos = rect.getBoundingClientRect();
        offsetX = e.clientX - rectPos.left;
        offsetY = e.clientY - rectPos.top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            rect.style.left = (e.clientX - offsetX) + 'px';
            rect.style.top = (e.clientY - offsetY) + 'px';
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    toggleContainer.addEventListener('click', function(e) {
        e.stopPropagation();
        isToggled = !isToggled;
        toggleCircle.style.transform = isToggled ? 'translateX(20px)' : 'translateX(0)';
        toggleContainer.style.backgroundColor = isToggled ? 'rgba(234, 56, 76, 0.5)' : 'rgba(234, 56, 76, 0.3)';
        rect.style.backgroundColor = isToggled ? 'rgba(214, 188, 250, 0.2)' : 'rgba(229, 222, 255, 0.2)';
    });

    // Остальные функции
    const adjacentKeys = {'q': ['w', 'a'],
        'w': ['q', 'e', 'a', 's'],
        'e': ['w', 'd', 's'],
        'r': ['e', 'd', 'f'],
        't': ['r', 'f', 'g'],
        'y': ['t', 'g', 'h'],
        'u': ['y', 'h', 'j'],
        'i': ['u', 'j', 'k'],
        'o': ['i', 'k', 'l'],
        'p': ['o', 'l'],

        'a': ['q', 'w', 's', 'z'],
        's': ['a', 'w', 'e', 'd', 'z', 'x'],
        'd': ['e', 's', 'x', 'c'],
        'f': ['r', 't', 'g', 'd'],
        'g': ['t', 'y', 'h', 'f'],
        'h': ['y', 'u', 'j', 'g'],
        'j': ['u', 'i', 'k', 'h'],
        'k': ['i', 'o', 'l', 'j'],
        'l': ['o', 'p', 'k'],

        'z': ['a', 's', 'x'],
        'x': ['s', 'd', 'c', 'z'],
        'c': ['d', 'f', 'x', 'v'],
        'v': ['c', 'f', 'g', 'b'],
        'b': ['v', 'g', 'h', 'n'],
        'n': ['b', 'h', 'j', 'm'],
        'm': ['n', 'j', 'k'],

        '1': ['2', '`'],
        '2': ['1', '3'],
        '3': ['2', '4'],
        '4': ['3', '5'],
        '5': ['4', '6'],
        '6': ['5', '7'],
        '7': ['6', '8'],
        '8': ['7', '9'],
        '9': ['8', '0'],
        '0': ['9', '-'],

        '-': ['0', '='],
        '=': ['-'],

        ' ': [' '],

        'й': ['ц', 'ф'],
        'ц': ['й', 'у', 'ф', 'ы'],
        'у': ['ц', 'к', 'ы', 'в'],
        'к': ['у', 'е', 'в', 'а'],
        'е': ['к', 'н', 'а', 'п'],
        'н': ['е', 'г', 'п', 'р'],
        'г': ['н', 'ш', 'р', 'о'],
        'ш': ['г', 'щ', 'о', 'л'],
        'щ': ['ш', 'з', 'л', 'д'],
        'з': ['щ', 'х', 'д', 'ж'],
        'х': ['з', 'ъ', 'ж', 'э'],
        'ъ': ['х', 'э'],

        'ф': ['й', 'ц', 'ы', 'я'],
        'ы': ['ф', 'ц', 'у', 'в', 'я', 'ч'],
        'в': ['ы', 'у', 'к', 'а', 'ч', 'с'],
        'а': ['в', 'к', 'е', 'п', 'с', 'м'],
        'п': ['а', 'е', 'н', 'р', 'м', 'и'],
        'р': ['п', 'н', 'г', 'о', 'и', 'т'],
        'о': ['р', 'г', 'ш', 'л', 'т', 'ь'],
        'л': ['о', 'ш', 'щ', 'д', 'ь', 'б'],
        'д': ['л', 'щ', 'з', 'ж', 'б', 'ю'],
        'ж': ['д', 'з', 'х', 'э', 'ю', '.'],
        'э': ['ж', 'х', 'ъ', '.'],

        'я': ['ф', 'ы', 'ч'],
        'ч': ['я', 'ы', 'в', 'с'],
        'с': ['ч', 'в', 'а', 'м'],
        'м': ['с', 'а', 'п', 'и'],
        'и': ['м', 'п', 'р', 'т'],
        'т': ['и', 'р', 'о', 'ь'],
        'ь': ['т', 'о', 'л', 'б'],
        'б': ['ь', 'л', 'д', 'ю'],
        'ю': ['б', 'д', 'ж', '.'],
        '.': ['ю', 'ж', 'э']
    };


    function getCurrentWordAndSpace() {
        var activeWords = document.querySelectorAll('.word.active');
        var characterList = [];
        activeWords.forEach(function(wordElement) {
            var letters = wordElement.querySelectorAll('letter');
            letters.forEach(function(letterElement) {
                characterList.push(letterElement.textContent.trim());
            });
            characterList.push(' ');
        });
        return characterList.join('');
    }

    function ErroredWord(word, chances) {
        var analy = word.trim();
        if (Math.random() < chances.errorChance) {
            var shuffledWord = shuffle(analy, chances);
            return shuffledWord + ' ';
        }
        return analy + ' ';
    }

    function shuffle(word, chances) {
   
    var array = word.split('');

    for (let i = 0; i < array.length; i++) {
        if (Math.random() < chances.neighborChars) {
            const currentChar = array[i];
            const possibleSwaps = adjacentKeys[currentChar] || [];
            if (possibleSwaps.length > 0) {
                const randomNeighbor = possibleSwaps[Math.floor(Math.random() * possibleSwaps.length)];
                array[i] = randomNeighbor;
            }
        }
        if (Math.random() < chances.swapChars) {
            if (i > 0 && Math.random() < 0.5) {
                [array[i], array[i - 1]] = [array[i - 1], array[i]];
            } else if (i < array.length - 1) {
                [array[i], array[i + 1]] = [array[i + 1], array[i]];
            }
        }
    }

    function addAdjacentChar(arr) {
        if (arr.length === 0) return arr;
        const lastIndex = arr.length - 1;
        const secondLastIndex = arr.length - 2;
        const targetIndex = (arr.length > 1 && Math.random() < 0.5) ? secondLastIndex : lastIndex;
        const targetChar = arr[targetIndex];
        const possibleAdjacent = adjacentKeys[targetChar] || [];
        if (possibleAdjacent.length > 0) {
            const randomAdjacent = possibleAdjacent[Math.floor(Math.random() * possibleAdjacent.length)];
            arr.splice(targetIndex + 1, 0, randomAdjacent);
        }
        return arr;
    }

    if (Math.random() < chances.wordLastChar) {
        array = addAdjacentChar(array);
    }

    if (Math.random() < chances.cutLastChars && array.length > 0) {
        array.pop();
    }

    if (Math.random() < chances.cutLastChars && array.length >= 2) {
        array.splice(array.length - 2, 1);
    }

    return array.join('');
}

function getCurrentWordAndSpace() {
    var activeWords = document.querySelectorAll('.word.active');
    var characterList = [];
    activeWords.forEach(function(wordElement) {
        var letters = wordElement.querySelectorAll('letter');
        letters.forEach(function(letterElement) {
            characterList.push(letterElement.textContent.trim());
        });
        characterList.push(' ');
    });
    return characterList.join('');
}

    document.addEventListener('keydown', function(e) {
        if (isToggled) {
            var chances = {
                errorChance: parseFloat(document.getElementById('errorChance').value) / 100,
                swapChars: parseFloat(document.getElementById('swapChars').value) / 100,
                neighborChars: parseFloat(document.getElementById('neighborChars').value) / 100,
                wordLastChar: parseFloat(document.getElementById('wordLastChar').value) / 100,
                cutLastChars: parseFloat(document.getElementById('cutLastChars').value) / 100
            };

            var CurrentWord = getCurrentWordAndSpace();

            if (['Tab', 'Escape', 'Enter'].includes(e.key)) {
                CurrentWord = "";
                Index = 0;
                typeWord = "";
                return;
            }
            if (e.key === 'Backspace') {
               Index--;
               return;
            }

            e.preventDefault();
            e.stopPropagation();

            if (Index >= typeWord.length) {
                CurrentWord = getCurrentWordAndSpace();
                Index = 0;
                typeWord = ErroredWord(CurrentWord, chances);
            }

            if (typeWord === "") {
                typeWord = ErroredWord(CurrentWord, chances);
            }

            let correctChar = typeWord[Index];
            Index++;
            document.execCommand('insertText', false, correctChar);
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Control') {
            isToggled = !isToggled;
            toggleCircle.style.transform = isToggled ? 'translateX(20px)' : 'translateX(0)';
            toggleContainer.style.backgroundColor = isToggled ? 'rgba(234, 56, 76, 0.5)' : 'rgba(234, 56, 76, 0.3)';
            rect.style.backgroundColor = isToggled ? 'rgba(214, 188, 250, 0.2)' : 'rgba(229, 222, 255, 0.2)';
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Insert') {
            rect.style.display = rect.style.display === 'none' ? 'flex' : 'none';
        }
    });
})();
