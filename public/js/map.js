document.addEventListener("DOMContentLoaded", function () {
    mapboxgl.accessToken = window.mapToken;

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [72.8777, 19.0760],
        zoom: 10
    });
});
