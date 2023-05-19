// const execLine = currentOperation.map(val => String(val)).reduce((accumulator, currentValue) => accumulator + currentValue, "");
// console.log(execLine, '=', eval(execLine))
// eval is evil
//https://developer.mozilla.org/en-US/docs/Web/API/Element/classList

function getPriorityOperationIndex() {
    console.log('currentOperation', currentOperation)
    const priorityOpIndex = currentOperation.lastIndexOf('(')
    if (priorityOpIndex == -1) {
        currentOperation = currentOperation.filter(element => element != ")")
        return 0
    }

    const closingIndex = currentOperation.indexOf(")")

    console.log(priorityOpIndex, closingIndex)

    if (closingIndex == -1) {
        currentOperation.splice(priorityOpIndex, 1)
        return getPriorityOperationIndex()
    }
    if (closingIndex - priorityOpIndex > 2) return (priorityOpIndex + 1)

    currentOperation.splice(closingIndex, 1)
    currentOperation.splice(priorityOpIndex, 1)

    return getPriorityOperationIndex()
}

const execOperation = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
}

function isPriorityOperation(index) {
    const operation = currentOperation[index + 1]
    return (operation == "/" || operation == "*")
}

function calculateOnIndex(index) {
    currentOperation.splice(
        index,
        3,
        execOperation[currentOperation[index + 1]](currentOperation[index], currentOperation[index + 2])
    )
}

function updateOutput() {
    outputNode.textContent = currentOperation.join('') + currentNumber
}

let currentOperation = []
let currentNumber = ""
let outputNode = document.querySelector("#current")
let lastoutputNode = document.querySelector("#last")
const calculatorActions = {
    addCurrentNumberToOperation() {
        if (currentNumber == "") return;
        currentOperation.push(Number(currentNumber))
        currentNumber = ""
    },
    clear() {
        console.log('clear')
        currentOperation = []
        currentNumber = ""
        updateOutput()
        lastoutputNode.textContent = ""
    },
    exec() {
        calculatorActions.addCurrentNumberToOperation()
        
        const lastElement = currentOperation[currentOperation.length - 1]

        // Remove last operation from list if it's incomplete
        if ((typeof lastElement == 'string' || lastElement instanceof String) && lastElement != "(" && lastElement != ")") {
            currentOperation.splice(currentOperation.length - 1)
        }

        let currentIndex = getPriorityOperationIndex()

        while (currentOperation.length > 2) {
            console.log('currentIndex', currentIndex)
            console.log('currentOperation', currentOperation)

            if (typeof currentOperation[currentIndex] != 'number') {
                currentOperation.splice(currentIndex, 1)
                continue
            }

            if (typeof currentOperation[currentIndex + 2] != 'number') {
                currentOperation.splice(currentIndex + 2, 1)
                continue
            }

            if (isPriorityOperation(currentIndex) || !isPriorityOperation(currentIndex + 2)) {
                calculateOnIndex(currentIndex)
            } else {
                calculateOnIndex(currentIndex + 2)
            }

            currentIndex = getPriorityOperationIndex()
        }

        if (currentOperation.length == 0) {
            currentOperation = [0]
        }

        currentOperation = currentOperation.filter(element => typeof element == 'number')

        // 1. Remove #last element
        lastoutputNode.remove()

        // 2. Change current to last
        outputNode.id = "last"
        lastoutputNode = outputNode

        // 3. Create new current element
        outputNode = document.createElement("p")
        outputNode.appendChild(document.createTextNode(""))
        outputNode.id = "current"

        const lastParent = lastoutputNode.parentNode
        lastParent.insertBefore(outputNode, lastoutputNode.nextSibling)

        currentNumber = currentOperation[0].toString()
        currentOperation = []
        
        updateOutput()
        console.log('result', currentNumber)
    },
    back() {
        console.log('back')

        if (currentNumber == "") {
            if (currentOperation.length == 0) {
                return;
            }

            const lastIndex = currentOperation.length - 1
            let element = currentOperation[lastIndex]
            let strElement = element.toString()

            if (typeof element == 'string' || strElement.length == 1) {
                currentOperation.splice(lastIndex)
            } else {
                strElement = strElement.slice(0, -1)
                currentOperation[lastIndex] =  Number(strElement)
            }
        } else {
            currentNumber = currentNumber.slice(0, -1)
        }

        console.log('updateOutput')
        updateOutput()
    }
}
22
document.querySelectorAll('[data-number]').forEach(numberButton => {
    numberButton.addEventListener('click', event => {
        const value = event.target.getAttribute('data-number')

        if (value == "(" || value == ")") {
            calculatorActions.addCurrentNumberToOperation()
            currentOperation.push(value)
        } else {
            if (value == ".") {
                if (currentNumber == "") {
                    currentNumber = "0"
                }

                if (currentNumber.includes(".")) {
                    return;
                }
                // if last character of currentNumber is dot - ignore
            }

            currentNumber += value
            console.log('currentNumber', currentNumber)
        }

        updateOutput()
    })
})

document.querySelectorAll('[data-operation]').forEach(operationButton => {
    operationButton.addEventListener('click', event => {
        calculatorActions.addCurrentNumberToOperation()

        const lastElement = currentOperation[currentOperation.length - 1]
        if (typeof lastElement == 'string' || lastElement instanceof String) {
            currentOperation.splice(currentOperation.length - 1)
        }

        if (currentOperation.length == 0) {
            currentOperation.push(0)
        }

        currentOperation.push(event.target.getAttribute('data-operation'))
        console.log('currentOperation', currentOperation)
        updateOutput()
    })
})

document.querySelectorAll('[data-action]').forEach(actionButton => {
    actionButton.addEventListener('click', event => calculatorActions[event.target.getAttribute('data-action')]())
})
