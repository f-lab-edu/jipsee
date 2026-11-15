import { VStack } from "@seed-design/react";
import type { ReactNode } from "react";
import { columnWidth } from "@/shared/config/columnWidth";

interface PageColumnProps {
	children: ReactNode;
}

/**
 * 페이지 > 세로 열
 *
 * - 1280 미만은 한 열로 두고, md 이상에서 열 폭을 넓은 열 폭까지 넓힘
 * - 1280 미만에서 열은 흰색(page-column)이고 1280 이상은 폭 제한 없음
 * - 고정 헤더가 푸터까지 따라오도록 내용을 이 열의 직접 자식으로 배치
 */
export default function PageColumn({ children }: PageColumnProps) {
	return (
		<VStack minHeight="100dvh">
			<VStack
				data-area="page-column"
				className="page-column"
				width="full"
				maxWidth={{
					base: columnWidth.narrow,
					md: columnWidth.wide,
					lg: "none",
				}}
				mx="auto"
				flexGrow={1}
			>
				{children}
			</VStack>
		</VStack>
	);
}
