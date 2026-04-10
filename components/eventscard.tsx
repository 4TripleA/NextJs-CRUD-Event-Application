import Link from "next/link";

declare interface CardProps {
    slug: string;
    title: string;
    category: string;
    location: string;
    date: string;
} 

const EventsCard = ({ slug, title, category, location, date }: CardProps) => {
  return (
    <Link href={`/${slug}`} className="block">
      <div className="border border-gray-500 rounded-xl px-5 pt-3 pb-6 hover:shadow-lg transition-shadow duration-150">
        <p className="text-[10px] text-gray-500">{category}</p>
        <p className="mt-1.5 font-semibold">{title}</p>
        <div className="flex flex-row mt-1"> 
            <div className="border border-gray-600 rounded-[3px] w-[15px] h-[15px] mt-1"></div>
            <p className="ml-2">{date}</p>
        </div>
        <div className="flex flex-row mt-1">
            <div className="border border-gray-600 rounded-[3px] w-[15px] h-[15px] mt-1"></div>
            <p className="ml-2">{location}</p>
        </div>

        <div className="border border-gray-300 w-full h-[0] my-4"></div>

        <p className="border border-gray-500 rounded-[7px] p-2 mb-2.5 mt-3 inline">View Event Details</p>
      </div>
    </Link>
  )
}

export default EventsCard