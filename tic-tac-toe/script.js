
let XorO  = 'O'
let buttons = []

function reset(){
    for (elemnet in buttons){
        buttons[elemnet].textContent = ""
        elemnet.textContent = "" 
    }
    
    XorO  = 'O'
    buttons = []

}

document.querySelectorAll('[data-action]').forEach(actionButton => {
    actionButton.addEventListener('click', event => {
        let currentbutton = event.target
        if (currentbutton.textContent == ""){
            if (XorO == 'X'){
                XorO  = 'O'
                currentbutton.className = "bluePlayButton"
                
            }else{
                XorO  = 'X'
                currentbutton.className = "redPlayButton"
                
            }
            currentbutton.textContent = XorO
            buttons.push(currentbutton)
            return;
        }
        if (currentbutton.id == "Reset"){
            reset()
        }
        

       
    })
})



