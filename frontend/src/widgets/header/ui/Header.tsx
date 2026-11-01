import { HStack, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import AccountLink from "@/widgets/header/ui/AccountLink";

interface HeaderProps {
	session: Nullable<Session>;
}

export default function Header({ session }: HeaderProps) {
	return (
		<header>
			<HStack
				justifyContent="space-between"
				alignItems="center"
				px="spacingX.globalGutter"
				py="x3"
			>
				<Link href={paths.home}>
					<Text fontSize="t6" fontWeight="bold">
						집씨
					</Text>
				</Link>
				<AccountLink session={session} />
			</HStack>
		</header>
	);
}
