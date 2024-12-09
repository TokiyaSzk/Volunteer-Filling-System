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
    const [school, setSchool] = useState<schoolData[]>()

    useEffect(() => {
        const url = 'http://localhost:3001/api/school'
        const requestOptions = {
            method: "GET",
            redirect: "follow" as RequestRedirect,
        };
        fetch("http://localhost:3001/api/school", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setSchool(JSON.parse(result))
            })
            .catch((error) => console.error(error));

    }, [])

    return (
        <>
            <div className="w-full h-[900px] bg-white text-black flex items-center justify-center">
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
            </div>

        </>
    )
}