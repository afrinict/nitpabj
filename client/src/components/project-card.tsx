import { cn } from "@/lib/utils";

interface ProjectCardProps {
  image: string;
  title: string;
  category: string;
  categoryColor: string;
  description: string;
  status: string;
  className?: string;
}

export function ProjectCard({
  image,
  title,
  category,
  categoryColor,
  description,
  status,
  className,
}: ProjectCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg", className)}>
      <img
        src={image}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <span className={cn("inline-block px-2 py-1 text-xs font-semibold rounded-full mb-2", categoryColor)}>
          {category}
        </span>
        <h3 className="font-heading font-semibold mb-2">{title}</h3>
        <p className="text-neutral-600 text-sm mb-3">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-500">{status}</span>
          <a href="#" className="text-[#3D8361] hover:text-[#2F6649] text-sm font-medium">
            View Details
          </a>
        </div>
      </div>
    </div>
  );
}
