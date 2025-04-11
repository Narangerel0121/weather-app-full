"use client"
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { MapPin } from "lucide";

export default function Home() {
  const [countries, setCountries] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Ulaanbaatar");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [value, setValue] = useState("");
  const [dayImage, setDayImage] = useState("/assets/sun.svg");
  const [nightImage, setNightImage] = useState("/assets/moon.svg");

  useEffect(() => {
    const getCitiesWithCountries = async () => {
      const response = await fetch("https:/countriesnow.space/api/v0.1/countries");
      const citiesWithCountries = await response.json();
      // console.log(citiesWithCountries.data);
      setCountries(citiesWithCountries.data);
    }
    getCitiesWithCountries();
  }, [])

  const arr = [];
  countries.map((country) => {
    country.cities.map((city) => { arr.push(`${city}, ${country.country}`) })
  });

  const handleSearch = (event) => {
    setValue(event.target.value)
    if (value) {
      const filteredCitiesBySearch = arr.filter((a) => {
        return a.toLowerCase().startsWith(value.toLowerCase())
      }).slice(0, 4);
      // console.log(filteredCitiesBySearch)
      setFilteredCities(filteredCitiesBySearch);
    }
  };

  const handleSelectedCity = (index) => {
    setSelectedCity(filteredCities[index]);
    setFilteredCities([]);
    setValue("");
  };

  useEffect(() => {
    const getWeatherByCity = async () => {
      const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f3ba84b06d684526a46225752251302&q=${selectedCity}`);
      const weather = await response.json();
      console.log(weather);
      setCurrentWeather(weather);
    }
    getWeatherByCity();
  }, [selectedCity]);

  const handleImageByText = () => {
    if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("cloudy")) {
      setDayImage("/assets/daycloud.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("snow")) {
      setDayImage("/assets/daysnow.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("thunderstorm")) {
      setDayImage("/assets/daystorm.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("rain")) {
      setDayImage("/assets/dayrain.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("drizzle")) {
      setDayImage("/assets/dayrain.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("wind")) {
      setDayImage("/assets/daywind.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("clear")) {
      setDayImage("/assets/sun.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("sunny")) {
      setDayImage("/assets/sun.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[12].condition.text.toLowerCase().includes("overcast")) {
      setDayImage("/assets/daycloud.svg")
    }
  };

  const handleNightImageByText = () => {
    if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("cloudy")) {
      setNightImage("/assets/nightcloud.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("snow")) {
      setNightImage("/assets/nightsnow.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("thunderstorm")) {
      setNightImage("/assets/nightstorm.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("rain")) {
      setNightImage("/assets/nightrain.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("drizzle")) {
      setNightImage("/assets/nightrain.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("wind")) {
      setNightImage("/assets/nightwind.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("clear")) {
      setNightImage("/assets/moon.svg")
    } else if (currentWeather?.forecast.forecastday[0].hour[21].condition.text.toLowerCase().includes("overcast")) {
      setNightImage("/assets/nightcloud.svg")
    }
  }

  useEffect(() => {
    handleImageByText();
    handleNightImageByText();
  }, [currentWeather])

  return (
    <div className="relative flex justify-center items-center overflow-hidden">
      <div className="flex h-screen w-full">
        <div className="bg-[#F3F4F6] w-1/2">
          <div className="mt-10 ml-10">
            <div className="flex bg-white backdrop-blur-xs rounded-full px-6 py-4 w-1/2 gap-4 relative z-5">
              <img src="icons/search.svg" />
              <input placeholder="Search..." onChange={handleSearch} value={value} className="focus:outline-none placeholder: font-bold text-3xl" />
            </div>
            <div className={`absolute z-10 w-[410px] rounded-3xl object-fit p-6 mt-3 bg-white backdrop-blur-xs ${filteredCities.length === 0 ? "invisible" : "visible"}`}>
              {filteredCities.map((city, index) => {
                return <div key={nanoid()} onClick={() => handleSelectedCity(index)} className="text-2xl font-bold flex gap-4 pb-2 cursor-pointer"><span><img src="/icons/nightpin.svg" /></span>{city}</div>
              })}
            </div>
          </div>
          <img src="/assets/yellow.svg" className="absolute z-5 pl-36 pt-6" />
          <div className="rounded-4xl bg-white/75 backdrop-blur-xs w-1/2 object-fit mx-auto mt-25 px-12 py-16 relative z-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-leg font-medium">{currentWeather?.forecast.forecastday[0].date}</p>
                <h1 className="text-5xl font-extrabold">{currentWeather?.location.name}</h1>
              </div>
              <img src="/icons/daypin.svg" />
            </div>
            <div className="w-[277px] h-[277px] mx-auto rounded-full">
              <img src={`${dayImage}`} className="w-[264px] h-[264px] mt-6 backdrop-blur-xs" />
            </div>
            <div className="mt-3 mb-12">
              <h1 className="py-3 font-extrabold text-9xl text-transparent bg-clip-text bg-linear-to-bl from-[#111827] to-[#6B7280]">{`${currentWeather?.forecast.forecastday[0].hour[12].temp_c}°`}</h1>
              <p className="font-extrabold text-2xl text-[#FF8E27]">{currentWeather?.forecast.forecastday[0].hour[12].condition.text}</p>
            </div>
            <div className="flex justify-between">
              <img src="/icons/dayhouse.svg" />
              <img src="/icons/daybotpin.svg" />
              <img src="/icons/dayheart.svg" />
              <img src="/icons/dayuser.svg" />
            </div>
          </div>
        </div>
        <div className="bg-[#0F141E] w-1/2 text-white">
        <img src="/assets/purple.svg" className="absolute z-5 pl-145 pt-225" />
          <div className="mt-[202px] rounded-4xl bg-[#1F2937]/75 backdrop-blur-xs w-1/2 object-fit mx-auto px-12 py-16 relative z-5">
            <div className="flex justify-between">
              <div>
                <p className="text-gray-400 text-leg font-medium">{currentWeather?.forecast.forecastday[0].date}</p>
                <h1 className="text-5xl font-extrabold">{currentWeather?.location.name}</h1>
              </div>
              <img src="/icons/nightpin.svg" />
            </div>
            <div className="w-[277px] h-[277px] mx-auto">
              <img src={`${nightImage}`} className="w-[264px] h-[264px] mt-6 rounded-full backdrop-blur-xs" />
            </div>
            <div className="mt-3 mb-12">
              <h1 className="py-3 font-extrabold text-9xl text-transparent bg-clip-text bg-linear-to-bl from-gray-100 to-gray-700">{`${currentWeather?.forecast.forecastday[0].hour[21].temp_c}°`}</h1>
              <p className="font-extrabold text-2xl text-[#777CCE]">{currentWeather?.forecast.forecastday[0].hour[21].condition.text}</p>
            </div>
            <div className="flex justify-between">
              <img src="/icons/nighthouse.svg" />
              <img src="/icons/botnightpin.svg" />
              <img src="/icons/nightheart.svg" />
              <img src="/icons/nightuser.svg" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute flex [&>*]: justify-center [&>*]: items-center">
        <div className="rounded-full h-250 w-250 border border-white flex justify-center items-center">
          <div className="rounded-full h-150 w-150 border border-white flex justify-center items-center">
            <div className="rounded-full h-100 w-100 border border-white flex justify-center items-center">
              <img src="/assets/logo.jpg" className="rounded-full w-50 h-50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
