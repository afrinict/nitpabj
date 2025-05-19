import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h1 className="font-heading text-2xl md:text-3xl font-bold text-[#1E5631]">
        {title}
      </h1>
      {description && (
        <p className="text-neutral-600 mt-1">{description}</p>
      )}
    </div>
  );
}
