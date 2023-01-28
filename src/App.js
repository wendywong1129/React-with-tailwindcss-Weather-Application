import { useState, useEffect } from "react";
import axios from "axios";
import { IoMdSearch } from "react-icons/io";
import { BsEye, BsWater, BsThermometer, BsWind } from "react-icons/bs";
import { TbTemperatureCelsius } from "react-icons/tb";
import { ImSpinner8 } from "react-icons/im";

const APIkey = "9903ec09a10036c495749138fdce7063";

const App = () => {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Sydney");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setLoading(true);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios
      .get(url)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setErrorMsg(err);
      });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMsg("");
    }, 2000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  const handleInput = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputValue !== "") {
      setLocation(inputValue);
      setInputValue("");
    } else {
      setAnimate(true);
      setTimeout(() => {
        setAnimate(false);
      }, 500);
    }
  };

  if (!data) {
    return (
      <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col justify-center items-center">
        <div>
          <ImSpinner8 className="text-5xl animate-spin" />
        </div>
      </div>
    );
  }

  const date = new Date();
  const day =
    date.getUTCDate() < 10 ? "0" + date.getUTCDate() : "" + date.getUTCDate();
  const month =
    date.getUTCMonth() + 1 < 10
      ? "0" + (date.getUTCMonth() + 1)
      : "" + date.getUTCMonth() + 1;
  const year = "" + date.getUTCFullYear();

  return (
    <div className="w-full h-screen bg-gradientBg bg-no-repeat bg-cover bg-center flex flex-col items-center justify-center px-4 lg:px-0">
      {errorMsg && (
        <div className="w-full max-w-[90vw] lg:max-w-[450px] bg-[#ff208c] text-white absolute top-2 lg:top-10 p-4 capitalize rounded-md">
          {`${errorMsg.response.data.message}`}
        </div>
      )}
      {/* form */}
      <form
        className={`${
          animate ? "animate-shake" : "animate-none"
        } h-16 bg-black/30 w-full max-w-[450px]
      rounded-full backdrop-blur-[32px] mb-8`}
      >
        <div className="h-full relative flex items-center justify-between p-2">
          <input
            className="flex-1 bg-transparent outline-none  text-white text-[15px] font-light pl-6 h-full"
            type="text"
            placeholder="Search by city or country ..."
            onChange={(e) => handleInput(e)}
          />
          <button
            className="bg-[#1ab8ed] hover:bg-[#15abdd] w-20 h-12 rounded-full flex justify-center items-center transition"
            onClick={(e) => handleSubmit(e)}
          >
            <IoMdSearch className="text-2xl text-white" />
          </button>
        </div>
      </form>

      {/* card */}
      <div className="w-full max-w-[450px] bg-black/20 min-h-[584px] text-white backdrop-blur-[32px] rounded-[32px] py-12 px-6">
        {loading ? (
          <div className="w-full h-full flex justify-center items-center">
            <ImSpinner8 className="text-white text-5xl animate-spin" />
          </div>
        ) : (
          <div>
            {/* card top */}
            <div className="flex items-center gap-x-5">
              <div className="text-[87px]">
                <img
                  src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
                  alt={`${data.weather[0].main}`}
                />
              </div>
              <div>
                <div className="text-2xl font-semibold">
                  {data.name}, {data.sys.country}
                </div>
                <div>
                  {day}/{month}/{year}
                </div>
              </div>
            </div>
            {/* card body */}
            <div className="my-20">
              <div className="flex justify-center items-center">
                <div className="text-[144px] leading-none  font-light">
                  {parseInt(data.main.temp)}
                </div>
                <div className="text-4xl">
                  <TbTemperatureCelsius />
                </div>
              </div>
              <div className="capitalize text-center">
                {data.weather[0].description}
              </div>
            </div>
            {/* card bottom */}
            <div className="max-w-[378px] mx-auto flex flex-col gap-y-6">
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsThermometer />
                  </div>
                  <div className="flex">
                    Feels like
                    <div className="flex ml-2">
                      {parseInt(data.main.feels_like)}
                      <TbTemperatureCelsius />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsEye />
                  </div>
                  <div>
                    Visibility{" "}
                    <span className="ml-2">{data.visibility / 1000} km</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsWater />
                  </div>
                  <div>
                    Humidity
                    <span className="ml-2">{data.main.humidity} %</span>
                  </div>
                </div>
                <div className="flex items-center gap-x-2">
                  <div className="text-[20px]">
                    <BsWind />
                  </div>
                  <div>
                    Wind <span className="ml-2">{data.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
