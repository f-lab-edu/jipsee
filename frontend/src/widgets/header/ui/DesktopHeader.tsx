import { Box, HStack, Text } from "@seed-design/react";
import Link from "next/link";
import type { Session } from "@/entities/session/model/session";
import { siteMetadata } from "@/shared/config/siteMetadata";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import ContentContainer from "@/shared/ui/ContentContainer";
import { headerStyles } from "@/widgets/header/config/headerStyles";
import AccountLink from "@/widgets/header/ui/AccountLink";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

interface DesktopHeaderProps {
	session: Nullable<Session>;
}

/** 헤더 > 데스크톱 레이아웃 */
export default function DesktopHeader({ session }: DesktopHeaderProps) {
	const style = headerStyles.desktop;

	return (
		<Box {...style.container}>
			<ContentContainer>
				<HStack {...style.row}>
					<Link href={paths.home} aria-label={`${siteMetadata.name} 홈`}>
						<HStack {...style.brandLink}>
							<LogoSymbol size={style.logoSize} />
							<Text {...style.serviceName}>{siteMetadata.name}</Text>
						</HStack>
					</Link>
					<AccountLink session={session} variant="desktop" />
				</HStack>
			</ContentContainer>
		</Box>
	);
}
