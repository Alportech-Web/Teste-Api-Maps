document.getElementById('comoChegarBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showRoute, showError);
    } else {
        alert("Seu navegador não suporta geolocalização.");
    }
});

function showRoute(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const destination = "Rua Arroio Grande, 19, São Paulo, SP, Brasil";

    const googleMapsUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyBGxfropwbTg9lsObKpk5-7UMTjZ7JfmFw
        &origin=${userLat},${userLng}
        &destination=${encodeURIComponent(destination)}
        &mode=driving`;

    document.getElementById('map').innerHTML = `<iframe width="100%" height="100%" 
        style="border:0;" loading="lazy" allowfullscreen 
        referrerpolicy="no-referrer-when-downgrade" src="${googleMapsUrl}"></iframe>`;
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
