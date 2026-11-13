import { Box, Text } from "@seed-design/react";
import { mobileBuildingTitleStyles } from "@/pages/building/config/mobileBuildingTitleStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";

interface MobileBuildingTitleProps {
	name: Nullable<string>;
	address: string;
}

/**
 * 건물 상세 > 모바일 제목
 *
 * - 모바일 본문 카드의 첫 줄에 건물명 출력
 * - 건물명이 없으면 주소 출력
 */
export default function MobileBuildingTitle({
	name,
	address,
}: MobileBuildingTitleProps) {
	const style = mobileBuildingTitleStyles;

	return (
		<Box data-area="building-title-mobile" {...style.box}>
			<Text as="h1" {...style.title}>
				{name ?? address}
			</Text>
		</Box>
	);
}
