import { Box, HStack, Text } from "@seed-design/react";
import Link from "next/link";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { paths } from "@/shared/routes/paths";
import ContentContainer from "@/shared/ui/ContentContainer";
import { headerStyles } from "@/widgets/header/config/headerStyles";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

/**
 * 헤더 > 데스크톱 레이아웃
 *
 * - 계정 링크는 출력하지 않음
 */
export default function DesktopHeader() {
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
				</HStack>
			</ContentContainer>
		</Box>
	);
}
