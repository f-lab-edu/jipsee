import { getSession } from "@/entities/session/api/getSession";
import Footer from "@/widgets/footer/ui/Footer";
import Header from "@/widgets/header/ui/Header";

export default async function HomeLayout({ children }: LayoutProps<"/">) {
	const session = await getSession();

	return (
		<>
			<Header session={session} />
			{children}
			<Footer />
		</>
	);
}
