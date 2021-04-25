/*
document.querySelector('#Mexico').addEventListener('click', function() {
    obtenerPais('Mexico');
});

document.querySelector('#Germany').addEventListener('click', function() {
    obtenerPais('Germany');
});
document.querySelector('#Italy').addEventListener('click', function() {
    obtenerPais('Italy');
});
*/

function obtenerPais(pais) {
    
    const url = `https://api.weatherapi.com/v1/current.json?key=5120dbecece74fce9a0233430212104&q=${pais}&aqi=yes`;

    fetch(url)
        .then(response => response.json())
        .then(data =>{
            let element = document.getElementById('clima')
            element.innerHTML = `
            <div class="row">
                <div class="columnClima">
                    <img class="clima" style="width:50%" src='${data.current.condition.icon}'/>
                </div>
                <div>
                    <p class="clima tempClima">${data.current.temp_c} °C</p>
                    <p class="clima estClima">${data.current.condition.text}</p>
                </div>
            </div>
            `;

            let elementH = document.getElementById('hora')
            elementH.innerHTML = `
            <p>${data.location.localtime}</p>
            `;

            let elementP = document.getElementById('pais')
            if (pais == 'Mexico') {
                elementP.innerHTML = `
                <div class="row">
                <div class="columnClima">
                    <p>${data.location.country}</p>
                </div>
                <div>
                    <img class="nomPais" style="width:30%" src='https://flagcdn.com/w40/mx.png'/>
                </div>
                </div>
                `;
            }else if(pais=='Germany') {
                elementP.innerHTML = `
                <div class="row">
                <div class="columnClima">
                    <p>${data.location.country}</p>
                </div>
                <div>
                    <img class="nomPais" style="width:30%" src='https://flagcdn.com/w40/de.png'/>
                </div>
                </div>
                `;
            }else if(pais == 'Italy'){
                elementP.innerHTML = `
                <div class="row">
                <div class="columnClima">
                    <p>${data.location.country}</p>
                </div>
                <div>
                    <img class="nomPais" style="width:30%" src='https://flagcdn.com/w40/it.png'/>
                </div>
                </div>
                `;
            }



            let elementZ = document.getElementById('zonas')
            if(pais== 'Mexico' ){
                elementZ.innerHTML = `
                <a id="Mexico" onclick="obtenerPais('Mexico')">Ciudad de Mexico - Central</a>
                <br>
                <a id="Tijuana" onclick="obtenerPais('Tijuana')">Tijuana</a>
                <br>
                <a id="Tijuana" onclick="obtenerPais('Monterrey')">Monterrey</a>
            `;
            }else if(pais == 'Germany'){
                elementZ.innerHTML = `
                <a id="Hamburgo" onclick="obtenerPais('Hamburgo')">Hamburgo</a>
            `;
            }else if(pais == 'Italy'){
                elementZ.innerHTML = `
                <a id="Napoles" onclick="obtenerPais('Napoles')">Napoles</a>
            `;
            }
        })
        
        .catch(err => console.log(err))
    }