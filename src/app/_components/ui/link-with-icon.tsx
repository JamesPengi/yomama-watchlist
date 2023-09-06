import Link from "next/link";
import React from "react";

interface LinkWithIconProps {
  link: string;
  Icon: React.ComponentType<{ className?: string }>;
  textUnderIcon: string;
}

export default function LinkWithIcon({
  link,
  Icon,
  textUnderIcon,
}: LinkWithIconProps) {
  return (
    <Link href={link} target="_blank">
      <div className="flex flex-col items-center">
        <Icon className="h-10 w-10" />
        <span className="text-[12px]">{textUnderIcon}</span>
      </div>
    </Link>
  );
}
