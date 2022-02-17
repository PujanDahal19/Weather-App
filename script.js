const container = document.querySelector('.container'),
inputPart = container.querySelector('.input-part'),
infoText = inputPart.querySelector('.info-text'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('.location-btn'),
wIcon = container.querySelector('.weather-part img'),
weatherPart = container.querySelector(".weather-part"),
arrowBack = container.querySelector('.heading i');

let api;


inputField.addEventListener('keyup', e=>{
    if(e.key == 'Enter' && inputField.value != ''){
        // console.log('hello')
        requestApi(inputField.value);
    }
})


locationBtn.addEventListener('click', ()=>{
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(onSuccess, onError)
    }else{
        alert('Your browser doesnot support geolocation API');
    }
});

const onSuccess = position=>{
    const {latitude, longitude} = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=4a4378aa453c277444eceb63bc56e8b9`
    fetchData();
}

const onError = error =>{
    infoText.innerText = error.message;
    infoText.classList.add('error');
}


const requestApi = city=>{
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=4a4378aa453c277444eceb63bc56e8b9`;

    fetchData();
}

const fetchData = ()=>{
    infoText.innerText = 'Getting weather details...';
    infoText.classList.add('pending');

    fetch(api).then(response => response.json()).then(result=> weatherDetails(result));
}
const weatherDetails = (info)=>{
    if(info.cod == '404'){
        infoText.innerText = `${inputField.value} isn't a valid city name`;
        infoText.classList.add('error');
    }else{
        const city = info.name;
        const country = info.sys.country;
        const{description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;


        if(id == 800){
            wIcon.src = "icons/clear.svg";
        }else if(id >= 200 && id <= 232){
            wIcon.src = "icons/storm.svg";  
        }else if(id >= 600 && id <= 622){
            wIcon.src = "icons/snow.svg";
        }else if(id >= 701 && id <= 781){
            wIcon.src = "icons/haze.svg";
        }else if(id >= 801 && id <= 804){
            wIcon.src = "icons/cloud.svg";
        }else if((id >= 500 && id <= 531) || (id >= 300 && id <= 321)){
            wIcon.src = "icons/rain.svg";
        }

        weatherPart.querySelector('.temp .numb').innerText = Math.floor(temp);
        weatherPart.querySelector('.climate').innerText = description;
        weatherPart.querySelector('.location span').innerText = `${city}, ${country}`;
        weatherPart.querySelector('.temp .numb-2').innerText =  Math.floor(feels_like);
        weatherPart.querySelector('.column-humidity span').innerText = `${humidity}%`;

        infoText.innerText = "";
        inputField.value = "";
        infoText.classList.remove('pending', 'error');
        container.classList.add('active');
    }
}

arrowBack.addEventListener('click', ()=>{
    container.classList.remove('active');
});

