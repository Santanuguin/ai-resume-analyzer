import {Link} from "react-router-dom";
import ScoreCircle from "~/components/ScoreCircle";

const ResumeCard =({resume:{ id,companyName,jobTitle,feedback,imagePath }}:{resume:Resume})=>{
    const resolvedImagePath = imagePath.startsWith("/")
        ? imagePath
        : `/images/${imagePath}`;
    return(
        <Link
            to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
            <div className="resume-card-header">
                <div className="flex flex-col gap-2"> </div>
                <h2 className="!text-black font-bold break-words">{companyName}</h2>
                <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
                <div className="flex-shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>
            <div className="gradient-border animate-in fade-in duration-1000">
                <div className="w-full h-full">
                    <img
                        src={resolvedImagePath} // <--- Make sure this line is exactly as shown
                        alt="resume"
                        className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    />
                </div>
            </div>
        </Link>
    )
}
export default ResumeCard