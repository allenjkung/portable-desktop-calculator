let ghostOutputElem = document.getElementById('ghost-output');
const pemdasOperators = [
    {'(' : '', ')' : (a) => handleRightParenthesis(a)},
    {'^' : (a, b) => Math.pow(a,b), '√' : (a) => Math.sqrt(a)},
    {'*' : (a, b) => a * b, '/' : (a, b) => a / b},
    {'+' : (a, b) => handleAddition(a, b), '-' : (a, b) => handleSubtraction(a, b)}
];

function tokenize(str) {
    const tokenArr = [];
    let token = '';
    try {
        for(const character of str) {
            if(character.match(/[a-zA-Z]/) && character !== 'e') {
                throw new Error(('Invalid Character: ' + character));
            }
            if('()^√*/+-'.includes(character)) {
                if(token === '' && character === '-') {
                    token = '-';
                }
                else {
                    if(token) {
                        let pushedToken = (token === '-' || token.includes('e')) ? token : parseFloat(token);
                        tokenArr.push(pushedToken, character);
                    }
                    else {
                        tokenArr.push(character);
                    }
                    token = '';
                }
            }
            else {
                token += character;
            }
        }
        if(token !== '') {
            if(token.includes('e')) {
                if(token[token.length - 1] !== 'e') {
                    throw new Error(('Invalid Use of e: '));
                }
                tokenArr.push(token);
            }
            else {
                tokenArr.push(parseFloat(token));
            }
        }
    }
    catch(error) {
        return error;
    }
    return tokenArr;
}

function reverseArray(arr) {
    for(let i = 0, j = arr.length; i < j; i+=1, j-=1) {
        const tempVar = arr[i];
        arr[i] = arr[j];
        arr[j] = tempVar;
    }
    return arr;
}

function handleRightParenthesis(pastTokens) {
    let parenthesisTokens = [];
    try {
        let poppedToken = '';
        while(pastTokens.length > 0) {
            poppedToken = pastTokens.pop();
            if(poppedToken === '(') {
                break;
            }
            parenthesisTokens.push(poppedToken);
        }
        if(poppedToken !== '(') {
            throw new Error('Missing (');
        }
        parenthesisTokens = reverseArray(parenthesisTokens);
        emdasOperators = pemdasOperators.slice(1);
        let operator = '';
        let operatorValue = '';
        for(const operators of emdasOperators) {
            const newTokens = [];
            for(const token of parenthesisTokens) {
                if(token in operators) {
                    operator = operators[token];
                    operatorValue = token;
                }
                else if(operator) {
                    if(operatorValue === '√') {
                        newTokens.push(operator(token));
                    }
                    else {
                        if(newTokens.length - 1 < 0) {
                            throw new Error('Missing value before operator');
                        }
                        newTokens[newTokens.length - 1] = operator(newTokens[newTokens.length - 1], token);
                    }
                    operator = '';
                    operatorValue = '';
                }
                else {
                    newTokens.push(token);
                }
            }
            parenthesisTokens = newTokens;
        }
        let parenthesisTokenRes = parenthesisTokens.pop();
        let resultToPush = '';
        if(pastTokens.length > 0 && (typeof pastTokens[pastTokens.length - 1] === 'number' || pastTokens[pastTokens.length - 1] === '-')) {
            let lastValue = pastTokens.pop();
            if(lastValue === '-') {
                lastValue = -1;
            }
            resultToPush = lastValue * parenthesisTokenRes;
        }
        else {
            resultToPush = parenthesisTokenRes;
        }
        pastTokens.push(resultToPush);
    }
    catch(error) {
        return error;
    }
    return pastTokens;
}

function handleAddition(a, b) {
    if(a[a.length - 1] === 'e') {
        return (a.substring(0, a.length - 1) * Math.pow(10, b));
    }
    return a + b;
}

function handleSubtraction(a, b) {
    if(a[a.length - 1] === 'e') {
        return (a.substring(0, a.length - 1) * Math.pow(10, (-1 * b)));
    }
    return a - b;
}

function handleTokens(tokens) {
    try {
        let operator = '';
        let operatorValue = '';
        for(const operators of pemdasOperators) {
            let newTokens = [];
            for(const token of tokens) {
                if(token in operators) {
                    operator = operators[token];
                    operatorValue = token;
                    if(token === '(') {
                        newTokens.push(token);
                    }
                    else if(token === ')') {
                        newTokens = operator(newTokens);
                        operator = '';
                    }
                }
                else if(operator) {
                    if(operatorValue === '√') {
                        newTokens.push(operator(token));
                    }
                    else {
                        if(newTokens.length - 1 < 0) {
                            throw new Error('Missing value before operator');
                        }
                        newTokens[newTokens.length - 1] = operator(newTokens[newTokens.length - 1], token);
                    }
                    operator = '';
                    operatorValue = '';
                }
                else {
                    newTokens.push(token);
                }
            }
            tokens = newTokens;
        }
    }
    catch(error) {
        return 'INVALID INPUT';
    }
    if(tokens.length > 1) {
        return 'INVALID INPUT';
    }
    return tokens;
}

function predictedOutput(str) {
    let tokens = tokenize(str);
    return handleTokens(tokens);
}

function handlePredictedOutput(outputStr) {
    if(!ghostOutputElem) {
        ghostOutputElem = document.getElementById('ghost-output');
    }
    const output = predictedOutput(outputStr);
    ghostOutputElem.innerHTML = output;
}

function removeLastCharacter() {
    const resultBarElem = document.getElementById('result-bar');
    const resultBarValue = resultBarElem.value;
    const resultBarValueNew = resultBarValue.substring(0, (resultBarValue.length - 1));
    resultBarElem.value = resultBarValueNew;
    handlePredictedOutput(resultBarValueNew);
}

function clearInput() {
    const resultBarElem = document.getElementById('result-bar');
    resultBarElem.value='';

    if(!ghostOutputElem) {
        ghostOutputElem = document.getElementById('ghost-output');
    }
    ghostOutputElem.innerHTML = '';
}

function handleResult() {
    const resultBarElem = document.getElementById('result-bar');
    const resultBarValue = resultBarElem.value;
    const output = predictedOutput(resultBarValue);

    const newResultRow = document.createElement('div');
    newResultRow.setAttribute('class', 'result-hist-row');
    const resultHistRowInput = document.createElement('div');
    resultHistRowInput.innerHTML = resultBarValue;
    resultHistRowInput.setAttribute('class', 'result-hist-row-input');
    const resultHistRowOutput = document.createElement('div');
    resultHistRowOutput.setAttribute('class', 'result-hist-row-output');
    resultHistRowOutput.innerHTML = output;
    newResultRow.append(resultHistRowInput);
    newResultRow.append(resultHistRowOutput);
    const resultHistoryElem = document.getElementById('result-history-wrapper');
    resultHistoryElem.prepend(newResultRow);

    clearInput();
}

function handleButtonValue(value) {
    const resultBarElem = document.getElementById('result-bar');
    const resultBarValue = resultBarElem.value;
    const resultBarValueNew = `${resultBarValue}${value}`;
    resultBarElem.value = resultBarValueNew;
    handlePredictedOutput(resultBarValueNew);
}

addEventListener("load", () => {
    const resultBar = document.getElementById('result-bar');
    resultBar.addEventListener('input', (event) => {
        handlePredictedOutput(event.target.value);
    });
    resultBar.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            handleResult();
        }
    });
});