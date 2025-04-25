const apiKey = "F7KrkrjEqxFV7yHC2v8To8ONqkfI99VxV3sNhVJW";

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".apiRequest").addEventListener("submit", getMarsRoverPhotos);
});

function getMarsRoverPhotos(event){
    event.preventDefault();

    const formData = new FormData(event.target);

    const rover = formData.get("rover");
    const date = formData.get("date");
    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`;

    const photosDiv = document.getElementById("photos");


    photosDiv.innerHTML = "";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            const photosDiv = document.getElementById("photos");
            const photos = data.photos;

            if (photos.length === 0) {
                photosDiv.innerHTML = "<p>No photos found for this date.</p>";
            } else {
                photos.forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.img_src;
                    img.alt = `Taken by ${photo.rover.name} on ${photo.earth_date}`;
                    photosDiv.appendChild(img);
                });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("photos").innerHTML = "<p>Failed to load photos.</p>";
        });
}
