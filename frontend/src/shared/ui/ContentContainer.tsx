import { VStack } from "@seed-design/react";
import type { ReactNode } from "react";

interface ContentContainerProps {
	children: ReactNode;
}

/** 내용을 lg 이상에서 좌우 여백을 포함해 최대 1200으로 가운데 정렬해 표시함 */
export default function ContentContainer({ children }: ContentContainerProps) {
	return (
		<VStack
			width={{ base: "auto", lg: "full" }}
			maxWidth={{ base: "none", lg: "1152px" }}
			mx={{ base: 0, lg: "auto" }}
			px={{ base: 0, lg: "x6" }}
			flexGrow={1}
		>
			{children}
		</VStack>
	);
}
