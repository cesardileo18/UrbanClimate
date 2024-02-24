import React, { useState, useEffect } from 'react';
import "./Css/home.css"
const Home = () => {
    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [errorMessageApi, setErrorMessageApi] = useState('');


    const getMeteorology = () => {
        if (city.trim() === '') {
            // Manejo de error si la ciudad está vacía
            setErrorMessage('Por favor, ingresa una ciudad.');
            setErrorMessageApi('');
            console.log('Por favor, ingresa una ciudad.');
            return;
        }
        // Expresión regular para validar que no haya números en la cadena
        const regex = /^[^0-9]*$/;

        if (!regex.test(city)) {
            setErrorMessage('Por favor, ingresa una ciudad sin números.');
            setErrorMessageApi('');
            console.log('Por favor, ingresa una ciudad sin números.');
            return;
        }
        setErrorMessage('');
        var requestOptions = {
            method: 'GET',
        };
        fetch(`https://api.tomorrow.io/v4/weather/realtime?location=${city}&apikey=${import.meta.env.VITE_APIKEY}`, requestOptions)
            .then(response => response.json())
            .then((result) => {
                setWeatherData(result.data.values)
                setLocation(result.location);
                localStorage.setItem('lastWeatherData', JSON.stringify(result.data.values));
                if (result.location) {
                    localStorage.setItem('lastLocation', JSON.stringify(result.location));
                }
            })
            .catch((error) => {
                console.log('error', error)
                setErrorMessageApi('Hubo un Error');
            })
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        getMeteorology();
    };
    useEffect(() => {
        // Recuperar la última ciudad al cargar la página
        const lastCity = localStorage.getItem('lastCity');
        if (lastCity) {
            setCity(lastCity);
        }
        // Recuperar la última búsqueda al cargar la página
        const lastWeatherData = JSON.parse(localStorage.getItem('lastWeatherData'));
        if (lastWeatherData) {
            setWeatherData(lastWeatherData);
        }
        // Recuperar la última ubicación al cargar la página
        const lastLocation = JSON.parse(localStorage.getItem('lastLocation'));
        if (lastLocation) {
            setLocation(lastLocation);
        }
    }, []);

    useEffect(() => {
        // Guardar la última ciudad en localStorage
        localStorage.setItem('lastCity', city);
    }, [city]);
    const deleteMenssage = () => {
        setErrorMessage('');
    }
    return (
        <div>
            <h2>Consulta del Tiempo</h2>
            <form className="form-inline d-flex justify-content-center flex-column align-items-center" onSubmit={handleSubmit}>
                <div className='form-group mx-sm-3 mb-2 col-md-8 col-lg-8 col-xl-8 col-12' >
                    <input
                        className='form-control'
                        type="text"
                        id="cityInput"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='Ingresa una ciudad'
                    />
                </div>
                <button className='btn btn-sm btn-primary' type="submit">Consultar</button>
            </form>
            {errorMessage && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className='mb-0 mx-2'>{errorMessage}</p>
                    <button className='btn' onClick={deleteMenssage}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            )}
            {errorMessageApi && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <p className='mx-2'>{errorMessageApi}</p>
                </div>
            )}
            {!errorMessageApi && weatherData !== null && (
                <div className="weather-info">
                    <h3>Clima Actual</h3>
                    <p>Temperatura: {weatherData.temperature ? weatherData.temperature : ""}°C</p>
                    <p>Sensación Térmica: {weatherData.temperatureApparent ? weatherData.temperatureApparent : ""}°C</p>
                    <p>Humedad: {weatherData.humidity ? weatherData.humidity : ""}%</p>
                    <p>Cobertura de Nubes: {weatherData.cloudCover ? weatherData.cloudCover : ""}%</p>

                    <h3>Viento</h3>
                    <p>Dirección del Viento: {weatherData.windDirection ? weatherData.windDirection : ""} grados</p>
                    <p>Velocidad del Viento: {weatherData.windSpeed ? weatherData.windSpeed : ""} m/s</p>
                    <p>Ráfaga Máxima: {weatherData.windGust ? weatherData.windGust : ""} m/s</p>

                    <h3>Condiciones Adicionales</h3>
                    <p>Índice UV: {weatherData.uvIndex !== undefined ? `${weatherData.uvIndex}` : 'N/A'}</p>
                    <p>Visibilidad: {weatherData.visibility ? weatherData.visibility : ""} km</p>

                    <h3>Probabilidades</h3>
                    <p>Probabilidad de Precipitación, Lluvia:{weatherData.precipitationProbability !== undefined ? `${weatherData.precipitationProbability}` : 'N/A'}%</p>

                    <h3>Ciudad</h3>
                    <p>{location && `${location.name}`}</p>
                </div>
            )}
        </div>
    );
};

export default Home;
