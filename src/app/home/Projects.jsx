'use client'

import { space_grotesk } from "@/font"
import { getGithubUserDetails, getRepos } from "@/service/gitHubServices";
import { useEffect, useMemo, useRef, useState } from "react"
import DropDown from '../../icons/dropdown.svg'
import Image from "next/image";
import { Grow, Slide } from "@mui/material";


export default function Projects({ toggleDrawer }) {

    const [gitHubDetail, setGitHubDetail] = useState({});
    const [repositoryDetails, setRepositoryDetails] = useState([])

    async function getGitubUserInfo() {
        try {
            const resp = await getGithubUserDetails('saibarathr');
            setGitHubDetail(resp);
        }
        catch (error) {
            console.error(error)
        }
    }

    async function getRepositoryList() {
        try {
            const resp = await getRepos('saibarathr');
            setRepositoryDetails(resp.sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at)));
            console.log(resp.sort((first, second) => new Date(second.updated_at) - new Date(first.updated_at)));
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getGitubUserInfo()
        getRepositoryList()
    }, [])



    function onClickContact(link, name) {
        copyTextToClipboard(name)
        link.includes('mail') ? window.open(link) : window.open(link, '_blank', 'noreferrer')
    }

    return <div className={" w-full md:w-auto bg-white h-full flex flex-row " + space_grotesk.className}>
        <div className="w-full flex flex-col m-2 ml-5 md:ml-10 md:m-6  gap-9 items-center ">
            <h1 className="font-semibold text-3xl ">Projects</h1>
            <ProjectList repositoryDetails={repositoryDetails} header="Github Projects" />
            <ProjectList
                header="Professional Projects"
                repositoryDetails={[{
                    name: "Agent Portal - Ozonetel Communications",
                    created_at: new Date("2022-09-05"),
                    id: 1,
                    language: "React",
                    description: "Agent Portal is a cloud-based call center solution that provides: 1. WebRTC calls, chats, and notifications for seamless communication. 2. Multiple types of campaigns, such as outbound, inbound, progressive, blended, and predictive for different business needs. 3. Conference and transfer functions for collaboration and customer service. 4. Interactive charts and graphs for data visualisation and analysis.",
                    topics: ["Redux", "Websocket", "WebRTC", "Service Worker", "TypeScript", "REST APIs"]

                }]} />
        </div>
        <div className="w-[6px] h-[30px] bg-slate-400 rounded-lg flex self-center items-center m-2 md:mr-2 cursor-pointer " onMouseDown={toggleDrawer(false)}></div>
    </div>
}

function ProjectList({ repositoryDetails, header }) {

    const [openPersonalPRojects, setOpenPersonalPRojects] = useState(false);
    const isProfessionalProject = useMemo(() => header === "Professional Projects", [])

    function formatDate(string) {
        var options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(string).toLocaleDateString([], options);
    }

    return <div className="w-full flex flex-col shadow-2xl items-start  rounded-2xl" >
        <div className="p-4 md:p-6 mt-3 flex justify-between gap-8 w-full items-center" >
            <h1 className="font-normal text-2xl">{header}</h1>
            <Image className={`cursor-pointer min-w-[30px] min-h-[30px] p-1 rounded-full hover:bg-[#F6F7F9] hover:scale-125 ${openPersonalPRojects ? " rotate-180" : ""}`} onClick={() => setOpenPersonalPRojects((prev) => !prev)} src={DropDown} alt={"arrow"} />
        </div>
        <div className=" w-full items-center justify-center flex flex-col gap-4 mb-4 ">
            {openPersonalPRojects && repositoryDetails.map((repo, index) => (
                <div key={repo.id} className={`w-11/12 gap-3  p-4 flex-col ${isProfessionalProject ? '' : 'cursor-pointer'} bg-[#F6F7F9] rounded-2xl shadow-md ${isProfessionalProject ? '' : 'hover:bg-slate-200 hover:scale-105 transition ease-in-out delay-75'}  flex`}>
                    <div className="flex  w-full justify-between">
                        <p className="uppercase font-medium">{repo.name}</p>
                        <p>{formatDate(repo.created_at)}</p>
                    </div>
                    <p >{repo.description}</p>
                    <p className="uppercase font-medium">{repo.language}</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 text-center gap-2">
                        {repo.topics.map((topic) => <div className="bg-slate-300 break-words capitalize  p-2 gap-1  rounded-2xl" key={topic}> {topic}</div>)}
                    </div>
                </div>
            ))
            }
        </div>
    </div>
}