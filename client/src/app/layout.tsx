import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Public_Sans } from "next/font/google";
import "./globals.css";

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Doctor Tracker",
	description: "Manage doctors and their patients.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
	return (
		<html
			lang="en"
			className={cn(
				"h-full",
				"antialiased",
				geistSans.variable,
				geistMono.variable,
				"font-sans",
				publicSans.variable,
			)}
		>
			<body className="min-h-full flex flex-col">
				<TooltipProvider>{children}</TooltipProvider>
			</body>
		</html>
	);
}
