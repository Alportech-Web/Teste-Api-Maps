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
            getEstimatedTime(userLat, userLng, destination, travelMode);
        } else {
            alert("Não foi possível traçar a rota: " + status);
        }
    });
}

function getEstimatedTime(userLat, userLng, destination, travelMode) {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
        {
            origins: [new google.maps.LatLng(userLat, userLng)],  // Corrigido
            destinations: [new google.maps.LatLng(destination.lat, destination.lng)], // Corrigido
            travelMode: google.maps.TravelMode[travelMode],
            unitSystem: google.maps.UnitSystem.METRIC,
        },
        (response, status) => {
            console.log("Response da API Distance Matrix:", response, "Status:", status); // Log de depuração
            if (status === "OK" && response.rows[0].elements[0].status !== "ZERO_RESULTS") {
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
}
