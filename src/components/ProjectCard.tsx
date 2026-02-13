import Image from "next/image";
import { Button } from "./ui/button";

interface ProjectCardProps {
    name : string;
    description : string;
    imgURL? : string | undefined
}

export default function ProjectCard({ name, description, imgURL } : ProjectCardProps) {
    return (
        <div className="h-auto w-125 bg-gray-200 rounded-lg p-4 shadow-md flex flex-col">
            {/* Project Image */}
            <Image src={imgURL || "/imgs/cat.jpg"} alt="A picture of a cat" width={500} height={150} className="mb-4"/>

            {/* Project Details */}
            <div className="border-2 w-full flex flex-col h-full" >
                <h2 className="h-[30%] text-4xl font-extrabold tracking-tight text-balance mb-3">{name}</h2>
                <p className="h-[70%] wrap-break-word">{description}</p>
            </div>

            {/* Action Button */}
            <Button className="mt-10 relative bottom-0">View Project</Button>
        </div>
    );
}