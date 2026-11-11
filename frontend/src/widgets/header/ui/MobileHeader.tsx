import { type BoxProps, HStack, Text, VStack } from "@seed-design/react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import { siteMetadata } from "@/shared/config/siteMetadata";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import { paths } from "@/shared/routes/paths";
import { headerStyles } from "@/widgets/header/config/headerStyles";
import AccountLink from "@/widgets/header/ui/AccountLink";
import LogoSymbol from "@/widgets/header/ui/LogoSymbol";

interface MobileHeaderProps {
	session: Nullable<Session>;
	currentPath?: string;
	background: BoxProps["bg"];
	back?: ReactNode;
	bottom?: ReactNode;
}

/**
 * 헤더 > 모바일 레이아웃
 *
 * - 로고 줄은 왼쪽에 뒤로 가기 요소와 로고, 오른쪽에 계정 링크 출력
 * - currentPath가 없으면 계정 링크 출력하지 않음
 * - bottom이 있으면 로고 줄 아래에 둘째 줄로 출력
 *
 * @param currentPath 로그인 링크가 돌아올 현재 경로. 없으면 계정 링크를 숨김
 * @param background 사용처가 주입한 배경
 * @param back 로고 왼쪽 요소
 * @param bottom 로고 줄 아래 요소
 */
export default function MobileHeader({
	session,
	currentPath,
	background,
	back,
	bottom,
}: MobileHeaderProps) {
	const style = headerStyles.mobile;

	return (
		<VStack bg={background}>
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
				{currentPath !== undefined && (
					<AccountLink
						session={session}
						variant="mobile"
						currentPath={currentPath}
					/>
				)}
			</HStack>
			{bottom}
		</VStack>
	);
}
