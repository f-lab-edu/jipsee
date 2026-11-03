import { Box, Flex, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import type { SearchGuideLayoutStyle } from "@/pages/home/model/searchGuideLayoutStyle";

interface SearchGuideItemProps {
	style: SearchGuideLayoutStyle;
	icon: ReactNode;
	children: ReactNode;
}

/** 홈 > 검색 안내 항목 */
export default function SearchGuideItem({
	style,
	icon,
	children,
}: SearchGuideItemProps) {
	return (
		<Flex {...style.item}>
			<Box {...style.iconCell}>{icon}</Box>
			<Text as="p" {...style.text}>
				{children}
			</Text>
		</Flex>
	);
}
