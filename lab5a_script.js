const apiKey = "F7KrkrjEqxFV7yHC2v8To8ONqkfI99VxV3sNhVJW";

var activeJsonFile = null;
var highlightActive = false;

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".apiRequest").addEventListener("submit", getMarsRoverPhotos);
});

document.getElementById("roverSelect").addEventListener("change", function () {
    const selectedRover = this.value;
    const roverInfo = document.getElementById("roverInfo");

    var message = "";

    switch (selectedRover) {
        case "curiosity":
            message = "Curiosity was launched in Nov 2011 and is still active.";
            break;
        case "opportunity":
            message = "Opportunity operated from Jan 2004 to June 2018.";
            break;
        case "spirit":
            message = "Spirit operated from Jan 2004 to March 2010.";
            break;
        default:
            message = "";
    }

    roverInfo.textContent = message;
});

function isValidDate(dateString) {
    const date = new Date(dateString);
    
    return !isNaN(date.getTime());
}

function formatDate(dateString) {
    const date = new Date(dateString);
  
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = months[date.getMonth()];
  
    const day = date.getDate();
    const year = date.getFullYear();
  
    return `${monthName} ${day}, ${year}`;
  }

  function capitalizeFirstLetter(str) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

function getMarsRoverPhotos(event){
    event.preventDefault();

    const photosDiv = document.getElementById("photos");
    photosDiv.innerHTML = "";

    const formData = new FormData(event.target);

    const rover = formData.get("rover");
    const month = formData.get("month");
    const day = formData.get("day");
    const year = formData.get("year");

    const date = `${year}-${month}-${day}`;

    if (!isValidDate(date)){
        document.getElementById("apiPrompt").innerHTML = "Input date is invalid.";
        return;
    }

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?earth_date=${date}&api_key=${apiKey}`;

    
    document.getElementById("apiPrompt").innerHTML = "";
    fetch(url)
        .then(res => res.json())
        .then(data => {
            activeJsonFile = data

            const photosDiv = document.getElementById("photos");
            const photos = data.photos;

            if (photos.length === 0) {
                photosDiv.innerHTML = "<p>No photos found for this date.</p>";
                return;
            } 

            const cameraGroup = {};
            photos.forEach(photo => {
                const cam = photo.camera.name;

                if (!cameraGroup[cam]) cameraGroup[cam] = [];
                cameraGroup[cam].push(photo);
            });

            for (var camera in cameraGroup) {
                const groupContainer = document.createElement("div");

                const groupHeader = document.createElement("h3");
                groupHeader.textContent = `Camera: ${camera}`;
                
                groupContainer.appendChild(groupHeader);

                cameraGroup[camera].forEach(photo => {
                    const img = document.createElement("img");
                    img.src = photo.img_src;
                    img.alt = `Taken by ${photo.rover.name} on ${photo.earth_date}`;

                    groupContainer.appendChild(img);
                });

                photosDiv.appendChild(groupContainer);
            }
            
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("photos").innerHTML = "<p>Failed to load photos.</p>";
        });

    document.getElementById("apiPrompt").innerHTML = `Fetching photos from <strong>${capitalizeFirstLetter(rover)}</strong> rover on Earth date: <strong>${formatDate(date)}</strong>`;
}
