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
    const destination = { lat: -23.593204, lng: -46.684361 };

    const map = new google.maps.Map(document.getElementById("map"), {
        center: destination,
        zoom: 14,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
        origin: { lat: userLat, lng: userLng },
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
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
