import { Box, type BoxProps } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import { headerRootStyles } from "@/widgets/header/config/headerRootStyles";
import DesktopHeader from "@/widgets/header/ui/DesktopHeader";
import MobileHeader from "@/widgets/header/ui/MobileHeader";

interface HeaderProps {
	session: Nullable<Session>;
	currentPath: string;
	mobileBackground: BoxProps["bg"];
	mobileBack?: ReactNode;
	mobileBottom?: ReactNode;
}

/**
 * 헤더
 *
 * - 모바일과 데스크톱 레이아웃을 함께 렌더링
 * - 스크롤해도 화면 위에 고정(sticky)
 * - 모바일 배경은 사용처에서 주입. 고정 헤더라 본문이 비치지 않게 불투명한 값을 넘김
 *
 * @param currentPath 로그인 링크가 돌아올 현재 경로(쿼리 포함)
 * @param mobileBackground 모바일 헤더 배경. 데스크톱 행은 항상 흰색
 * @param mobileBack 모바일 로고 왼쪽에 둘 뒤로 가기 요소
 * @param mobileBottom 모바일 로고 줄 아래에 둘 둘째 줄
 */
export default function Header({
	session,
	currentPath,
	mobileBackground,
	mobileBack,
	mobileBottom,
}: HeaderProps) {
	return (
		<Box as="header" {...headerRootStyles.root}>
			<ResponsiveLayout
				testId="header"
				mobile={
					<MobileHeader
						session={session}
						currentPath={currentPath}
						background={mobileBackground}
						back={mobileBack}
						bottom={mobileBottom}
					/>
				}
				desktop={<DesktopHeader session={session} currentPath={currentPath} />}
			/>
		</Box>
	);
}
