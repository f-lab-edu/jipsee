import { Box, HStack, Icon, Text } from "@seed-design/react";
import { buildingTitleRowStyles } from "@/pages/building/config/buildingTitleRowStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import BackButton from "@/shared/ui/BackButton";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface BuildingTitleRowProps {
	name: Nullable<string>;
	address: string;
}

/**
 * 건물 상세 > 제목 줄
 *
 * - 데스크톱 본문 첫 줄이며 뒤로 가기 원형 버튼과 제목 출력
 * - 건물명이 있으면 제목은 건물명이고 오른쪽에 주소 출력
 * - 건물명이 없으면 제목은 주소이고 부제 없음
 */
export default function BuildingTitleRow({
	name,
	address,
}: BuildingTitleRowProps) {
	const style = buildingTitleRowStyles;

	return (
		<HStack data-area="building-title-row" {...style.row}>
			<BackButton style={style.backButton}>
				<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
			</BackButton>
			<HStack {...style.titleGroup}>
				<Text as="h1" {...style.title}>
					{name ?? address}
				</Text>
				{name !== null && (
					<Box {...style.addressCell}>
						<Text {...style.address}>{address}</Text>
					</Box>
				)}
			</HStack>
		</HStack>
	);
}
