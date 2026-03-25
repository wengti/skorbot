import { VscPreview } from "react-icons/vsc";
import { Skeleton } from "../tailgrids/core/skeleton";

export default function LoadingMatchHomePreview() {

    return (
        <section className='mt-4 mb-4 w-full'>

            {/* Title */}
            <div className="text-xl font-bold mb-2 flex gap-2 items-center">
                <VscPreview />
                <p>Game Profile Preview</p>
            </div>

            {/* Inner Container */}
            <div className="w-full h-145 border px-2 py-4 rounded-xl flex flex-col justify-center items-center">
                {/* The preview cards and pagination */}
                <Skeleton className='rounded-xl h-113.25 w-70.5'/>
            </div>
        </section>
    )
}