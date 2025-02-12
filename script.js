document.getElementById('comoChegarBtn').addEventListener('click', () => {
    // Mostra o overlay e o ícone de carregamento
    document.getElementById('map-overlay').style.display = 'flex';
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, showError);
    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
});

function initMap(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const travelMode = document.getElementById('travelMode').value;

    const destination = { lat: -23.595164, lng: -46.684636 }; // Coordenadas do destino

    const map = new google.maps.Map(document.getElementById("map"), {
        center: destination,
        zoom: 14,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
        origin: new google.maps.LatLng(userLat, userLng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode[travelMode],
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            // Limpa a mensagem antes de fazer nova requisição
            document.getElementById("estimatedTime").innerText = "Calculando...";
            setTimeout(() => {  // Pequeno delay antes de chamar a API
                getEstimatedTime(userLat, userLng, destination, travelMode);
            }, 500);
        } else {
            alert("Não foi possível traçar a rota: " + status);
        }

        // Esconde o overlay e o ícone de carregamento após o retorno da API
        document.getElementById('map-overlay').style.display = 'none';
    });
}

function getEstimatedTime(userLat, userLng, destination, travelMode) {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [new google.maps.LatLng(userLat, userLng)],  
            destinations: [new google.maps.LatLng(destination.lat, destination.lng)], 
            travelMode: google.maps.TravelMode[travelMode],
            unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
            console.log("Response da API Distance Matrix:", response, "Status:", status);

            if (status === "OK" && response.rows[0].elements[0].status === "OK") {
                const duration = response.rows[0].elements[0].duration.text;
                document.getElementById("estimatedTime").innerText = `Tempo estimado: ${duration}`;
            } else {
                document.getElementById("estimatedTime").innerText = "Não foi possível calcular o tempo estimado.";
                console.warn("Erro na Distance Matrix API:", response.rows[0].elements[0].status);
            }
        }
    );
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

    // Esconde o overlay se houver erro
    document.getElementById('map-overlay').style.display = 'none';
}
