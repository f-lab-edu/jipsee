import { Box } from "@seed-design/react";
import type { ReactNode } from "react";

interface ResponsiveLayoutProps {
	testId: string;
	mobile: ReactNode;
	desktop: ReactNode;
	fillsHeight?: boolean;
}

/**
 * 반응형 레이아웃
 *
 * - lg 미만에서는 모바일 레이아웃만 출력
 * - lg 이상에서는 데스크톱 레이아웃만 출력
 * - fillsHeight이면 각 래퍼를 flex 열로 만들어 부모의 남는 높이를 채움
 *
 * @param testId 각 레이아웃의 data-testid 접두사. -mobile, -desktop을 붙임
 * @param fillsHeight 래퍼가 flex 부모 안에서 남는 높이를 채울지 여부
 */
export default function ResponsiveLayout({
	testId,
	mobile,
	desktop,
	fillsHeight = false,
}: ResponsiveLayoutProps) {
	if (fillsHeight) {
		return (
			<>
				<Box
					hideFrom="lg"
					display="flex"
					flexDirection="column"
					flexGrow={1}
					data-testid={`${testId}-mobile`}
				>
					{mobile}
				</Box>
				<Box
					display={{ base: "none", lg: "flex" }}
					flexDirection="column"
					flexGrow={1}
					data-testid={`${testId}-desktop`}
				>
					{desktop}
				</Box>
			</>
		);
	}

	return (
		<>
			<Box hideFrom="lg" data-testid={`${testId}-mobile`}>
				{mobile}
			</Box>
			<Box
				display={{ base: "none", lg: "block" }}
				data-testid={`${testId}-desktop`}
			>
				{desktop}
			</Box>
		</>
	);
}
