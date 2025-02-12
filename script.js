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

    const destination = "R. Gomes de Carvalho, 1629 - Vila Olímpia, São Paulo - SP, 04547-006";

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
            origins: [{ lat: userLat, lng: userLng }],
            destinations: [destination],
            travelMode: google.maps.TravelMode[travelMode],
        },
        (response, status) => {
            if (status === 'OK') {
                const duration = response.rows[0].elements[0].duration.text;
                document.getElementById('estimatedTime').innerText = `Tempo estimado: ${duration}`;
            } else {
                document.getElementById('estimatedTime').innerText = "Não foi possível calcular o tempo estimado.";
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
