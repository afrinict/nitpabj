import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { LucideIcon } from "lucide-react";

interface QuickLinkCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  iconBgColor: string;
  className?: string;
}

export function QuickLinkCard({
  title,
  description,
  icon: Icon,
  href,
  iconBgColor,
  className,
}: QuickLinkCardProps) {
  return (
    <Link href={href}>
      <a className={cn("bg-white p-4 rounded-lg shadow-md text-center transition-transform hover:-translate-y-1 hover:shadow-lg", className)}>
        <div className={cn("inline-flex items-center justify-center p-3 rounded-full text-white mb-3", iconBgColor)}>
          <Icon className="text-xl" />
        </div>
        <h3 className="font-medium text-neutral-800">{title}</h3>
        <p className="text-sm text-neutral-600">{description}</p>
      </a>
    </Link>
  );
}
