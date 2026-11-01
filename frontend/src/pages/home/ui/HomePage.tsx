import { TextFieldInput, TextFieldRoot } from "@seed-design/react";
import { getSession } from "@/entities/session/api/getSession";
import Header from "@/widgets/header/ui/Header";

export default async function HomePage() {
	const session = await getSession();

	return (
		<>
			<Header session={session} />
			<main>
				<TextFieldRoot>
					<TextFieldInput aria-label="seed" />
				</TextFieldRoot>
			</main>
		</>
	);
}
