const req = new XMLHttpRequest();
const elements_info = {}
var statements = [[],[]]
//The following functions are used by the lexical analyzer in order to get a sense of what exactly is being typed into the entry form
function isCapital(char_code){
    return (char_code >= 65 && char_code <= 90)
}

function isLowercase(char_code){
    return (char_code >= 97 && char_code <= 122)
}

function isDigit(char_code){
    return (char_code >= 48 && char_code <= 57)
}

//I made NaN, +, and white spaces be ignorable in order to account for user input style
//I.E. The inputs "H2O + CO2" and "H2O+CO2" are both valid
function isIgnorable(char_code){
    return (isNaN(char_code) || char_code == 32 || char_code == 43)
}
req.open('GET', window.location + 'elements-info');
req.send()
req.onreadystatechange = function(){
    if(req.readyState == 4){
        req.responseText.split('\r\n').forEach(line => {
            [periodic_symbol, element_name] = line.split(',');
            elements_info[periodic_symbol] = element_name;
        })
    }
}

function inputEvent(input, is_left, self){
    //This is a simple lexical analyzer
    //I'm using it to construct the left and right part of the formula from user input
    var running_statement = []
    var running_compound = {}
    var running_lexeme = ''
    let previewObj = is_left?document.getElementById('left_preview'):document.getElementById('right_preview');
    previewObj.innerHTML = ''
    let statementIdx =is_left?0:1;
    console.log(input.length)
    for(var i = 0; i< input.length; i++){
        var next_is_new = null;
        let current_char_code = input.charCodeAt(i);
        if(isIgnorable(input.charCodeAt(i+1))){
            next_is_new = true;
        }else{
            next_is_new = isCapital(input.charCodeAt(i+1));
        }
        if (isCapital(current_char_code) || isLowercase(current_char_code)){
            running_lexeme += input[i];
            console.log(running_lexeme);
            if(next_is_new && Object.keys(elements_info).includes(running_lexeme)){
                running_compound[running_lexeme] = 1;
                running_lexeme = '';
                self.style.backgroundColor = '#FFFFFF'
            }else{
                self.style.backgroundColor = '#EF8989';
            }
        
        }else if(current_char_code >= 50 && current_char_code <= 57){
            var runningDigit = '';
            var offset = 0
            try{
                while(isDigit(input.charCodeAt(i+offset))){
                    runningDigit += input[i+offset]
                    offset += 1
                }
            }finally{
                running_compound[running_lexeme] = parseInt(runningDigit);
                i = i + offset - 1;
                running_lexeme = '';
            }
            }else if(current_char_code == 43){
            running_statement.push({...running_compound});
            running_compound = {};
            running_lexeme = '';
        }else{
            if(current_char_code != 32){
                self.style.backgroundColor = '#EF8989'
            }
        }
    }
    running_statement.push({...running_compound});
    statements[statementIdx] = running_statement;
    running_statement.forEach((compound, index) => {
        Object.keys(compound).forEach(element => {
            previewObj.innerHTML += (compound[element] > 1)?`${element}<sub>${compound[element]}</sub>`:`${element}`
        })
        if(index < running_statement.length-1){
            previewObj.innerHTML += ' + ';
        }
    })
}

function ExecuteBalance(){
    //this function first checks to make sure that the same elements are in each side of the function
    //It then makes a call to the web server (python file) with the user defined formula. The response is the answer.
    let elements = [[],[]];
    for(let i = 0; i < statements.length; i++){
        for(let v = 0; v < statements[i].length; v++){
            Object.keys(statements[i][v]).forEach(element => {
                if(!elements[i].includes(element)){
                    elements[i].push(element);
                }
            })
        }
    }
    if(elements[0].length == elements[1].length && elements[0].every(element => elements[1].includes(element))){
        let req = new XMLHttpRequest();
        req.open("POST", window.location + 'solve');
        req.setRequestHeader("Content-Type", "application/json");
        req.send(JSON.stringify({data:statements, present_elements:elements[0]}));
        console.log({data:statements});
        req.onreadystatechange = function(){
            if(req.readyState == 4){
                if(req.status == 200){
                    let answer_key = JSON.parse(req.response).res;
                    console.log(answer_key);    
                    document.getElementById('answer_area').style.display = 'block';
                    let answer = document.getElementById('balanced_formula')
                    answer.innerHTML = ''
                    for(let i = 0; i < statements[0].length; i++){
                        answer.innerHTML += `<span style='color:blue'>${answer_key[i]}</span>`
                        Object.keys(statements[0][i]).forEach(element => {
                            answer.innerHTML += (statements[0][i][element] > 1)?`${element}<sub>${statements[0][i][element]}</sub>`:`${element}`
                        })
                        if(i < statements[0].length - 1){
                            answer.innerHTML += ' + '
                        }
                    }
                    answer.innerHTML += ' &rarr; '
                    for(let i = 0; i < statements[1].length; i++){
                        answer.innerHTML += `<span style='color:blue'>${answer_key[i + statements[0].length]}</span>`
                        Object.keys(statements[1][i]).forEach(element => {
                            answer.innerHTML += (statements[1][i][element] > 1)?`${element}<sub>${statements[1][i][element]}</sub>`:`${element}`
                        })
                        if(i < statements[1].length - 1){
                            answer.innerHTML += ' + '
                        }
                    }
                }else if(req.status == 204){
                    alert("That Formula has no solution")
                }
            }
        }
    }else{
        alert('Improper input, please check formula')
    }
}