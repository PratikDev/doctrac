"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { navItems } from "@/lib/nav";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
	const pathname = usePathname();
	const { open } = useSidebar();

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="flex items-center gap-2 px-2 py-1.5">
					<span className="text-base font-semibold">
						{open ? "DocTrac" : "DT"}
					</span>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								const isActive =
									pathname === item.href ||
									pathname.startsWith(`${item.href}/`);
								return (
									<SidebarMenuItem key={item.href}>
										<SidebarMenuButton
											asChild
											isActive={isActive}
										>
											<Link href={item.href}>
												<item.icon />
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
