import { getSession } from "@/entities/session/api/getSession";
import Header from "@/widgets/header/ui/Header";

export default async function HomeLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<>
			<Header session={session} />
			{children}
		</>
	);
}
