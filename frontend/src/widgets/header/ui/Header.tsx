import type { BoxProps } from "@seed-design/react";
import type { ReactNode } from "react";
import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import DesktopHeader from "@/widgets/header/ui/DesktopHeader";
import MobileHeader from "@/widgets/header/ui/MobileHeader";

interface HeaderProps {
	session: Nullable<Session>;
	mobileBackground: BoxProps["bg"];
	mobileBack?: ReactNode;
	mobileBottom?: ReactNode;
}

/**
 * 헤더
 *
 * - 모바일과 데스크톱 레이아웃을 함께 렌더링
 * - 모바일 배경은 사용처에서 주입
 *
 * @param mobileBackground 모바일 헤더 배경. 데스크톱 행은 항상 흰색
 * @param mobileBack 모바일 로고 왼쪽에 둘 뒤로 가기 요소
 * @param mobileBottom 모바일 로고 줄 아래에 둘 둘째 줄
 */
export default function Header({
	session,
	mobileBackground,
	mobileBack,
	mobileBottom,
}: HeaderProps) {
	return (
		<header>
			<ResponsiveLayout
				testId="header"
				mobile={
					<MobileHeader
						session={session}
						background={mobileBackground}
						back={mobileBack}
						bottom={mobileBottom}
					/>
				}
				desktop={<DesktopHeader session={session} />}
			/>
		</header>
	);
}
