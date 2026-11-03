import { Box } from "@seed-design/react";
import type { ReactNode } from "react";

interface ResponsiveLayoutProps {
	testId: string;
	mobile: ReactNode;
	desktop: ReactNode;
}

/**
 * 반응형 레이아웃
 *
 * - lg 미만에서는 모바일 레이아웃만 출력
 * - lg 이상에서는 데스크톱 레이아웃만 출력
 *
 * @param testId 각 레이아웃의 data-testid 접두사. -mobile, -desktop을 붙임
 */
export default function ResponsiveLayout({
	testId,
	mobile,
	desktop,
}: ResponsiveLayoutProps) {
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
