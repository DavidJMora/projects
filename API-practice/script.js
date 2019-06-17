window.onload = function() {
    init()
}

function init() {
    document.querySelector('.input')
        .addEventListener('keyup', function() {
            userInput = document.querySelector('.input').value;
            httpRequest = new XMLHttpRequest()
        
            if(!httpRequest) {
                alert("Giving up! Cannot create an XMLHTTP instance")
            }
        
            httpRequest.onreadystatechange = processContents;
            httpRequest.open("GET", `https://rickandmortyapi.com/api/character/?name=${userInput}`);
            httpRequest.send()
        })
    let buttons = document.querySelector(".button");
    buttons.addEventListener('click', function() {
        
        let e = event.target;

        if(e.innerText === "Start" && variable !== 1) {
            variable = 1;
            makeRequest();
        } else if(e.innerText === "Back" && variable !== 1) {
            variable--;
            makeRequest();
        } else if(e.innerText === "Forward" && variable !== 25) {
            variable++;
            makeRequest();
        } else if(e.innerText === "End" && variable !== 25) {
            variable = 25;
            makeRequest();
        }
    })


    let httpRequest

    let variable = 1;

    function makeRequest() {

        
            httpRequest = new XMLHttpRequest()
        
            if(!httpRequest) {
                alert("Giving up! Cannot create an XMLHTTP instance")
            }
        
            httpRequest.onreadystatechange = processContents;
            httpRequest.open("GET", `https://rickandmortyapi.com/api/character/?page=${variable}`);
            httpRequest.send()
        
    }

    function processContents() {
        if(httpRequest.readyState === XMLHttpRequest.DONE) {
            if(httpRequest.status === 200) {
                let data = httpRequest.responseText;
                
                if(data) {
                    data = JSON.parse(data);
                    
                    if(data.results) {
                        createCards(data.results)            
                    }
                }
            } else {
                alert('Character not found.')
                document.querySelector('.input').value = "";
            }
        }
    }

    function createCards(items) {
        let cardDeck = document.querySelector(".container > .card-deck");
        
        let cards = '';

        for(let item in items) {
            if(items.hasOwnProperty(item)) {
                cards += `<div class="col-md-4">
                            <div class="card mb-2 mx-2 shadow-sm">
                                <img class="border" src="${items[item].image}">
                                <div class="d-flex flex-column justify-content-between align-items-center">
                                <p>${items[item].name}</p>
                                <p>${items[item].origin.name}</p>
                                <p>${items[item].status}</p>
                                </div>
                            </div>
                        </div>`
            }
        }

        cardDeck.innerHTML = cards;
    }

    makeRequest()
}