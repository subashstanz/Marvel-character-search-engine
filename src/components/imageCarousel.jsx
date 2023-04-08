import React, { useEffect, useState } from "react";
import Drawer from "./drawer";
import marvelLoader from "../assets/marvel.json";
import Lottie from "lottie-react";

const buttonClass =
  "flex items-center rounded-full cursor-pointer justify-center w-20 h-10  text-white";

function ImageCarousel({}) {
  const [characterData, setCharactersData] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 3,
    offset: 0,
    totalCount: 0,
  });
  const [searchValue, setSearchValue] = useState("");
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log("characterData", characterData);

  const debounce = (callBack, delay) => {
    let timeout;
    return function (...arg) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        callBack(...arg);
      }, delay);
    };
  };

  const debounceSearch = debounce((value) => {
    getCharacter(value);
  }, 1000);

  console.log("openDrawer", openDrawer);
  useEffect(() => {
    getCharacter(searchValue);
  }, [pagination.offset]);

  const getCharacter = async (searchValue = "") => {
    try {
      setLoading(true);
      let body = {
        // nameStartsWith: "",
        limit: pagination.limit,
        offset: pagination.offset,
      };
      if (searchValue) {
        body = { ...body, nameStartsWith: searchValue };
      }
      const queryParams = new URLSearchParams(body);
      const response = await fetch(
        `https://gateway.marvel.com/v1/public/characters?ts=1632998235&apikey=ff7d1b4aefa575448f941959adefe76d&hash=bc74402412971310d7a50ccd0dff3c7b&${queryParams}`
      );
      setLoading(false);
      const data = await response.json();
      console.log("data", data.data);
      setPagination({ ...pagination, totalCount: data.data.total });
      setCharactersData([...(data?.data?.results || [])]);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const onClickPrev = () => {
    setPagination((prev) => {
      return {
        ...prev,
        offset: pagination.offset <= 0 ? prev.offset : prev.offset - 3,
      };
    });
  };
  const onClicKNext = () => {
    setPagination((prev) => {
      return {
        ...prev,
        offset:
          pagination.offset < pagination.totalCount
            ? prev.offset + 3
            : prev.offset,
      };
    });
  };

  const onChangeSearchValue = (value = "") => {
    setSearchValue(value);
    debounceSearch(value);
  };

  const onOpenDescription = (index) => {
    setOpenDrawer(true);
    setCurrentIndex(index);
  };
  return (
    <div className="flex w-full h-full ">
      <div className="flex flex-col h-screen space-y-4  bg-red-100 w-full items-center p-5 justify-center">
        <div className="flex-none my-5">
          <input
            className="w-[300px] h-10 rounded-md pl-3 border-2 border-red-300"
            placeholder="Search Character"
            onChange={(e) => onChangeSearchValue(e.target.value)}
            value={searchValue}
          />
        </div>
        <div className="grow h-[500px] w-[1000px] flex  items-center justify-center space-x-9 p-3 bg-red-200">
          {loading ? (
            <div className="w-32 h-32">
              <Lottie animationData={marvelLoader} />
            </div>
          ) : (
            <>
              {characterData?.map((character, index) => {
                return (
                  <div
                    className="bg-red-500"
                    key={character.id}
                    onClick={() => onOpenDescription(index)}
                  >
                    <img
                      src={character?.thumbnail?.path}
                      alt={character.name}
                      className="w-[200px] m-2 h-[200px]   bg-gray-50 rounded-md"
                    />
                    <div className="w-full text-white h-full flex items-center justify-center">
                      {character.name}
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        <div className="flex-none  h-20 w-full ">
          <div className="flex items-center justify-center w-full space-x-3">
            <div
              onClick={onClickPrev}
              className={`${buttonClass} ${
                pagination.offset === 0
                  ? "cursor-not-allowed  bg-red-300"
                  : "bg-red-600"
              } `}
            >
              Prev
            </div>
            <div
              onClick={onClicKNext}
              className={`${buttonClass} ${
                pagination.offset < pagination.totalCount
                  ? "  bg-red-600"
                  : "cursor-not-allowed  bg-red-300"
              } `}
            >
              Next
            </div>
          </div>
        </div>
      </div>
      {currentIndex !== null && characterData[currentIndex] && openDrawer && (
        <Drawer
          isOpen={openDrawer}
          setIsOpen={setOpenDrawer}
          data={characterData[currentIndex]}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
}

export default ImageCarousel;
