import { type BoxProps, HStack, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import { siteMetadata } from "@/shared/config/siteMetadata";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import AccountLink from "@/widgets/header/ui/AccountLink";

interface HeaderProps {
	session: Nullable<Session>;
	background: BoxProps["bg"];
}

/**
 * 헤더
 *
 * - 사용처가 정한 배경 위에 서비스 이름 링크와 계정 링크를 가진 헤더를 표시함
 */
export default function Header({ session, background }: HeaderProps) {
	return (
		<header>
			<HStack
				bg={background}
				justifyContent="space-between"
				alignItems="center"
				px="spacingX.globalGutter"
				py="x3"
			>
				<Link href={paths.home}>
					<Text fontSize="t6" fontWeight="bold">
						{siteMetadata.name}
					</Text>
				</Link>
				<AccountLink session={session} />
			</HStack>
		</header>
	);
}
