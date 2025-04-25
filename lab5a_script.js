const apiKey = "F7KrkrjEqxFV7yHC2v8To8ONqkfI99VxV3sNhVJW"; // Replace with your actual key if needed
const rover = "curiosity";
const date = "2020-07-01";
const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`;

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