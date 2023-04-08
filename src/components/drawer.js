import React from "react";

export default function Drawer({ isOpen, setIsOpen, data, setCurrentIndex }) {
  console.log("data", data);
  const {
    thumbnail: { path = "" },
    name,
    description = "",
    urls = [],
  } = data;
  console.log("tets", urls);
  return (
    <main
      className={
        " fixed flex flex-col overflow-hidden  z-10 bg-red-50  inset-0 transform ease-in-out " +
        (isOpen
          ? " transition-opacity opacity-100  w-96 translate-x-0  "
          : " transition-all opacity-0 w-0 translate-x-full  ")
      }
    >
      <div
        onClick={() => {
          setIsOpen(false);
          setCurrentIndex(null);
        }}
        className="w-full flex flex-none justify-end p-3  font-semibold cursor-pointer"
      >
        Close
      </div>
      <div className="flex flex-col  w-full grow items-center justify-start">
        <img
          src={path}
          alt={name}
          className="w-[200px] m-2 h-[250px] border-2 border-red-500  bg-white rounded-md"
        />
        <div className="font-medium m-3 text-red-600">{description || ""}</div>
        <div className="flex flex-col space-y-2">
          {urls?.map((url) => {
            return (
              <a
                href={url.url}
                className="m-2 text-blue-400 font-semibold"
                target="_blank"
              >
                {url?.type || ""}
              </a>
            );
          })}
        </div>
      </div>
    </main>
  );
}
