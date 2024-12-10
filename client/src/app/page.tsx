"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import AnimatedComponent from "@/component/AnimateComponent";


export default function Home() {
  const [display, setDisplay] = useState("正在初始化数据");
  const [signal, setSignal] = useState(false);


  const handleButtonClick = async () => {
    const requestOptions = {
      method: "GET"
    };

    setSignal(true);
    try {
      const response = await fetch("http://localhost:3001/init", requestOptions);
      const result = await response.text();
      setDisplay('数据初始化成功');
    } catch (error) {
      console.error('Error initializing data:', error);
      setDisplay('数据初始化失败');
    }
  };

  return (
    <>
      <AnimatedComponent>

        <div className="relative w-full h-[900px] p-10 flex flex-col bg-gradient-to-br from-blue-200 via-gray-100 to-gray-200 justify-center items-center z-1">
          <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-lg rounded-lg border border-gray-200">
            <h1 className="text-3xl font-extrabold text-gray-800 tracking-wide mb-4">
              Welcome to Volunteer System
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              这是一个软件工程的大实验项目，使用Next Js + TailwindCSS + Express + Mysql搭建的一个志愿者管理系统。
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-md transition-all duration-300"
              onClick={handleButtonClick}>
              初始化数据
            </button>
          </div>

          {signal &&
            <AnimatedComponent>

              <div className="fixed inset-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="relative bg-gradient-to-br from-white via-gray-100 to-gray-200 shadow-2xl rounded-2xl p-8 w-[90%] max-w-3xl text-center flex flex-col justify-center items-center">
                  <h1 className="text-gray-800 font-extrabold text-xl  tracking-wider drop-shadow-md mb-6">
                    {display}
                  </h1>

                  <button
                    className="absolute top-4 right-4 w-10 h-10 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center shadow-md hover:bg-gray-300 hover:text-gray-900 transition-all duration-300"
                    onClick={() => { console.log('关闭提示框'); setSignal(false) }}
                  >
                    ✕
                  </button>

                  <div className="absolute bottom-[-10px] left-[50%] translate-x-[-50%] w-[100px] h-[10px] bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-sm opacity-75"></div>
                </div>
              </div>
            </AnimatedComponent>

          }
        </div>
      </AnimatedComponent>

    </>
  )
}
