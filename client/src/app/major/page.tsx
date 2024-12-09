"use client";

import AnimatedComponent from "@/component/AnimateComponent";
import { useEffect, useState } from "react";

interface majorData {
    id?: string;
    name?: string;
    school_id?: string;
    min_score?: string;
    max_score?: string;
}

export default function MajorPage() {
    const [major, setMajor] = useState<majorData[]>();

    useEffect(() => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0Iiwic2NvcmUiOjU2OSwicmVnaW9uIjoiQ2hpbmEiLCJpYXQiOjE3MzM2NjA4NDksImV4cCI6MTczMzY2NDQ0OX0.6wUkBmiFBzYckTSgDPVuePwi6vY24r9ekKVLgR5ZHOQ");

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow" as RequestRedirect,
        };

        fetch("http://localhost:3001/api/major/", requestOptions)
            .then((response) => response.text())
            .then((result) => {
                console.log(result);
                setMajor(JSON.parse(result));
            })
            .catch((error) => console.error(error));

    }, []);


    return (
        <>
            <AnimatedComponent>
                <div className="w-full h-[900px] flex justify-center items-cente text-black p-14">
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
                            {major && major.map((major: any) => {
                                return (
                                    <tbody key={major.id}>
                                        <tr >
                                            <td className="border px-4 py-2">{major.id}</td>
                                            <td className="border px-4 py-2">{major.name}</td>
                                            <td className="border px-4 py-2">{major.school_id}</td>
                                            <td className="border px-4 py-2">{major.min_score}</td>
                                            <td className="border px-4 py-2">{major.max_score}</td>
                                        </tr>
                                    </tbody>
                                )
                            })}
                        </table>
                    </div>
                </div>
            </AnimatedComponent>

        </>
    )
}