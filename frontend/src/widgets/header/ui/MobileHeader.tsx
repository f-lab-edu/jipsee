import { type BoxProps, HStack, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import { siteMetadata } from "@/shared/config/siteMetadata";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import { headerStyles } from "@/widgets/header/config/headerStyles";
import AccountLink from "@/widgets/header/ui/AccountLink";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

interface MobileHeaderProps {
	session: Nullable<Session>;
	background: BoxProps["bg"];
}

/**
 * 헤더 > 모바일 레이아웃
 *
 * @param background 사용처가 주입한 행 배경
 */
export default function MobileHeader({
	session,
	background,
}: MobileHeaderProps) {
	const style = headerStyles.mobile;

	return (
		<HStack bg={background} {...style.row}>
			<Link href={paths.home} aria-label={`${siteMetadata.name} 홈`}>
				<HStack {...style.brandLink}>
					<LogoSymbol size={style.logoSize} />
					<Text {...style.serviceName}>{siteMetadata.name}</Text>
				</HStack>
			</Link>
			<AccountLink session={session} variant="mobile" />
		</HStack>
	);
}
