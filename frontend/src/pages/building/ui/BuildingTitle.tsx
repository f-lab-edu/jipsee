import { Box, Icon, Text, VStack } from "@seed-design/react";
import { buildingTitleStyles } from "@/pages/building/config/buildingTitleStyles";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import BackButton from "@/shared/ui/BackButton";
import HeaderBackIcon from "@/widgets/header/ui/HeaderBackIcon";

interface BuildingTitleProps {
	name: Nullable<string>;
	address: string;
}

/**
 * 건물 상세 > 제목
 *
 * - 모바일과 데스크톱이 같은 h1 하나를 쓰고 글자 크기와 줄 위치만 반응형으로 바꿈
 * - 모바일은 본문 첫 줄에 건물명만 출력
 * - 데스크톱은 뒤로 가기 원형 버튼과 건물명을 한 줄에 출력
 * - 건물명이 있으면 데스크톱에서 오른쪽에 주소 출력
 * - 건물명이 없으면 제목은 주소이고 부제 없음
 */
export default function BuildingTitle({ name, address }: BuildingTitleProps) {
	const style = buildingTitleStyles;

	return (
		<VStack data-area="building-title" {...style.root}>
			<Box data-area="building-title-row" {...style.row}>
				<BackButton style={style.backButton}>
					<Icon svg={<HeaderBackIcon />} {...style.backIcon} />
				</BackButton>
				<Box {...style.titleGroup}>
					<Text as="h1" {...style.title}>
						{name ?? address}
					</Text>
					{name !== null && (
						<Box {...style.addressCell}>
							<Text {...style.address}>{address}</Text>
						</Box>
					)}
				</Box>
			</Box>
		</VStack>
	);
}
