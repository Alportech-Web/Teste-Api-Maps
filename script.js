document.getElementById('comoChegarBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
});

function initMap(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    
    // NOVO DESTINO: VIP OFFICE - Vila Olímpia
    const destination = "R. Gomes de Carvalho, 1629 - Vila Olímpia, São Paulo - SP, 04547-006";
    
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: userLat, lng: userLng },
        zoom: 14,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
        origin: { lat: userLat, lng: userLng },
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        provideRouteAlternatives: true,
        drivingOptions: {
            departureTime: new Date(),
            trafficModel: 'bestguess'
        },
        unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);

            // Exibir informações de tempo e distância
            const route = result.routes[0];
            const summaryPanel = document.createElement('div');
            summaryPanel.innerHTML = `<p><strong>Distância:</strong> ${route.legs[0].distance.text}</p>
                                     <p><strong>Tempo estimado:</strong> ${route.legs[0].duration.text}</p>`;
            document.querySelector('.container').appendChild(summaryPanel);

            // Adicionar opções de transporte
            const travelModeSelector = document.createElement('select');
            travelModeSelector.innerHTML = `
                <option value="DRIVING">Carro</option>
                <option value="WALKING">Caminhada</option>
                <option value="BICYCLING">Bicicleta</option>
                <option value="TRANSIT">Transporte Público</option>
            `;
            travelModeSelector.addEventListener('change', () => {
                request.travelMode = travelModeSelector.value;
                directionsService.route(request, (result, status) => {
                    if (status === google.maps.DirectionsStatus.OK) {
                        directionsRenderer.setDirections(result);
                    }
                });
            });
            document.querySelector('.container').appendChild(travelModeSelector);

        } else {
            alert("Não foi possível traçar a rota: " + status);
        }
    });
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Permissão de localização negada.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Informação de localização indisponível.");
            break;
        case error.TIMEOUT:
            alert("Tempo de requisição expirado.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Ocorreu um erro desconhecido.");
            break;
    }
}