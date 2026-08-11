"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { navItems } from "@/lib/nav";
import { usePathname } from "next/navigation";

function pageTitle(pathname: string): string {
	const match = navItems.find(
		(item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
	);
	return match?.title ?? "Doctor Tracker";
}

export function SiteHeader() {
	const pathname = usePathname();

	return (
		<header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
			<SidebarTrigger className="-ml-1" />
			<Separator
				orientation="vertical"
				className="mr-2"
			/>
			<h1 className="text-base font-medium">{pageTitle(pathname)}</h1>
		</header>
	);
}
