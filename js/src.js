let ghostOutputElem = document.getElementById('ghost-output');
const pemdasOperators = [
    {'(' : '', ')' : (a) => handleRightParenthesis(a)},
    {'^' : (a, b) => Math.pow(a,b)},
    {'*' : (a, b) => a * b, '/' : (a, b) => a / b},
    {'+' : (a, b) => a + b, '-' : (a, b) => a - b}
];

function tokenize(str) {
    const tokenArr = [];
    let token = '';
    for(const character of str) {
        if('()^*/+-'.includes(character)) {
            if(token === '' && character === '-') {
                token = '-';
            }
            else {
                if(token) {
                    tokenArr.push(parseFloat(token), character);
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
        tokenArr.push(parseFloat(token));
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
        for(const operators of emdasOperators) {
            const newTokens = [];
            for(const token of parenthesisTokens) {
                if(token in operators) {
                    operator = operators[token];
                }
                else if(operator) {
                    if(newTokens.length - 1 < 0) {
                        throw new Error('Missing value before operator');
                    }
                    newTokens[newTokens.length - 1] = operator(newTokens[newTokens.length - 1], token);
                    operator = '';
                }
                else {
                    newTokens.push(token);
                }
            }
            parenthesisTokens = newTokens;
        }
        pastTokens.push(parenthesisTokens.pop());
    }
    catch(error) {
        return error;
    }
    return pastTokens;
}

function handleTokens(tokens) {
    try {
        let operator = '';
        for(const operators of pemdasOperators) {
            let newTokens = [];
            for(const token of tokens) {
                if(token in operators) {
                    operator = operators[token];
                    if(token === '(') {
                        newTokens.push(token);
                    }
                    else if(token === ')') {
                        newTokens = operator(newTokens);
                        operator = '';
                    }
                }
                else if(operator) {
                    if(newTokens.length - 1 < 0) {
                        throw new Error('Missing value before operator');
                    }
                    newTokens[newTokens.length - 1] = operator(newTokens[newTokens.length - 1], token);
                    operator = '';
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
    const resultOutputElem = document.getElementById('result-output-div');
    resultOutputElem.innerHTML = output;
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
});