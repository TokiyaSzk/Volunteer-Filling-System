"use client";

import { useEffect, useState } from "react"

interface schoolData {
    id?: string;
    name?: string;
    province?: string;
    ranking?: string;
    category?: string;
}

export default function SchoolPage() {
    const [dataDict, setDataDict] = useState<{ [key: string]: string }>({});
    const [school, setSchool] = useState<schoolData[]>([
        {
            id: "1",
            name: "清华大学",
            province: "北京",
            ranking: "1",
            category: "综合"
        }
    ])
    const [schoolLogin, setSchoolLogin] = useState(false)

    useEffect(() => {
        const requestOptions = {
            method: "GET"
        };
        fetch("http://localhost:3001/api/school", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setSchool(JSON.parse(result))
            })
            .catch((error) => console.error(error));

    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setDataDict({ ...dataDict, [name]: value })
    }
    const displayLogin = () => {
        setSchoolLogin(true)
    }
    const hiddenLogin = () => {
        setSchoolLogin(false)
    }

    const loginButtonClick = () => {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify(dataDict);

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw
        };

        fetch("http://localhost:3001/api/admin/login", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                const tokenData = JSON.parse(result);
                const token = tokenData.token;
                localStorage.setItem("AdminToken", token);
                window.location.href = "/school/profile";
            })
            .catch((error) => console.error(error));

    }

    return (
        <>
            <div className="relative z-[1] w-full h-[900px] bg-white flex items-center justify-center flex-col space-y-5 text-black font-bold">
                <div className="w-[500px] h-[600px] rounded-2xl bg-white border border-solid border-black shadow-lg hover:shadow-xl shadow-gray-500 hover:shadow-gray-700 transition-all duration-300 flex justify-center items-center">

                    <table className="table-auto ">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Id</th>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Province</th>
                                <th className="px-4 py-2">Ranking</th>
                                <th className="px-4 py-2">Category</th>
                            </tr>
                        </thead>
                        {school && school.map((school: any) => {
                            return (
                                <tbody key={school.id}>
                                    <tr >
                                        <td className="border px-4 py-2">{school.id}</td>
                                        <td className="border px-4 py-2">{school.name}</td>
                                        <td className="border px-4 py-2">{school.province}</td>
                                        <td className="border px-4 py-2">{school.ranking}</td>
                                        <td className="border px-4 py-2">{school.category}</td>
                                    </tr>
                                </tbody>
                            )

                        })}
                    </table>
                </div>
                <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                    <button className="text-blue-500 hover:text-blue-700 transition-all duration-300" onClick={displayLogin}>
                        学校登陆
                    </button>
                </div>
                {schoolLogin &&
                    <div className='fixed inset-0 w-screen h-screen z-[50] bg-gray-500 bg-opacity-20 flex justify-center items-center'>
                        <div className='w-[300px] h-[550px] bg-white rounded-2xl p-14 pt-8 overflow-auto'>
                            <div className='space-y-2'>
                                <div className="w-full h-10 text-2xl tracking-widest text-center">账户登陆</div>
                                <div className="space-y-2">
                                    <label htmlFor="">账户名</label>
                                    <input type="text" name="username" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        onChange={handleChange} />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="">密码</label>
                                    <input type="text" name="password" placeholder=" " className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                                        onChange={handleChange} />
                                </div>
                                <div className="flex flex-row justify-center items-center ">
                                    <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                                        <button className="text-blue-500 hover:text-blue-700 transition-all duration-300" onClick={hiddenLogin}>
                                            取消
                                        </button>
                                    </div>
                                    <div className=" rounded-xl shadow-lg p-2 hover:shadow-xl hover:scale-110 transition-all duration-300">
                                        <button className="text-blue-500 hover:text-blue-700 transition-all duration-300" onClick={loginButtonClick}>
                                            登陆
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}