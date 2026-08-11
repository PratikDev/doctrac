export default async function DoctorDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return (
		<p className="text-muted-foreground text-sm">
			Doctor detail for {id} coming in M10.
		</p>
	);
}
