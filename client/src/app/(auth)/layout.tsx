import StethoscopeSvg from "@/components/icons/stethoscope";
import { Stethoscope } from "lucide-react";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<div className="grid min-h-screen lg:grid-cols-2">
			<div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-10 lg:flex">
				<div
					className="absolute inset-0 opacity-[0.08]"
					style={{
						backgroundImage:
							"radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
						backgroundSize: "22px 22px",
					}}
				/>
				<StethoscopeSvg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-160 opacity-5" />
				<div className="relative flex items-center gap-2 text-lg font-semibold">
					<span className="bg-primary-foreground/15 flex size-8 items-center justify-center rounded-lg">
						<Stethoscope className="size-4.5" />
					</span>
					DocTrac
				</div>
				<div className="relative flex flex-col gap-3">
					<blockquote className="text-2xl font-medium text-balance">
						&ldquo;Track every doctor and patient in one place. Clean, fast, and
						built for the day-to-day of running a clinic.&rdquo;
					</blockquote>
					<p className="text-primary-foreground/70 text-sm">
						Doctor &amp; patient management, simplified.
					</p>
				</div>
			</div>
			<div className="flex items-center justify-center p-4 sm:p-8">
				{children}
			</div>
		</div>
	);
}
