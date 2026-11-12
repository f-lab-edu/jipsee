import { HStack, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import type { ReactNode } from "react";
import { siteMetadata } from "@/shared/config/siteMetadata";
import { paths } from "@/shared/routes/paths";
import { headerStyles } from "@/widgets/header/config/headerStyles";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

interface MobileHeaderProps {
	back?: ReactNode;
	bottom?: ReactNode;
}

/**
 * 헤더 > 모바일 레이아웃
 *
 * - 로고 줄은 왼쪽에 뒤로 가기 요소와 로고 출력
 * - 계정 링크는 출력하지 않음. 하단 내비게이션의 내 정보 탭이 대신함
 * - 배경은 흰색(`bg.layerDefault`)
 * - bottom이 있으면 로고 줄 아래에 둘째 줄로 출력
 *
 * @param back 로고 왼쪽 요소
 * @param bottom 로고 줄 아래 요소
 */
export default function MobileHeader({ back, bottom }: MobileHeaderProps) {
	const style = headerStyles.mobile;

	return (
		<VStack bg="bg.layerDefault">
			<HStack {...style.row}>
				<HStack {...style.leftGroup}>
					{back}
					<Link href={paths.home} aria-label={`${siteMetadata.name} 홈`}>
						<HStack {...style.brandLink}>
							<LogoSymbol size={style.logoSize} />
							<Text {...style.serviceName}>{siteMetadata.name}</Text>
						</HStack>
					</Link>
				</HStack>
			</HStack>
			{bottom}
		</VStack>
	);
}
