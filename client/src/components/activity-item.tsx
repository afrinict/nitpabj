import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ActivityItemProps {
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
  className?: string;
}

export function ActivityItem({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  time,
  className,
}: ActivityItemProps) {
  return (
    <div className={cn("border-b border-neutral-200 pb-4", className)}>
      <div className="flex items-start">
        <div className={cn("p-2 rounded-full", iconBgColor)}>
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="ml-4">
          <p className="font-medium">{title}</p>
          <p className="text-sm text-neutral-600">{description}</p>
          <p className="text-xs text-neutral-500 mt-1">{time}</p>
        </div>
      </div>
    </div>
  );
}
