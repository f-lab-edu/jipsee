import { Box, Icon, Text } from "@seed-design/react";
import { areaFixedRowStyles } from "@/pages/building/config/areaFixedRowStyles";
import { nearbyDealsCopy } from "@/pages/building/config/nearbyDealsCopy";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";
import LockIcon from "@/shared/ui/LockIcon";

interface AreaFixedRowProps {
	layout: ResponsiveVariant;
}

/**
 * 건물 상세 > 주변 거래 면적 고정 줄
 *
 * - 라벨 "면적" 옆에 잠금 아이콘과 고정 안내 문구 출력
 * - 모바일은 필터 라벨과 같은 폭의 라벨 칸, 데스크톱은 폭을 정하지 않음
 *
 * @param layout 라벨 칸 폭을 정함
 */
export default function AreaFixedRow({ layout }: AreaFixedRowProps) {
	const style = areaFixedRowStyles[layout];

	return (
		<Box {...style.row}>
			<Box {...style.labelCell}>
				<Text {...style.label}>{nearbyDealsCopy.areaLabel}</Text>
			</Box>
			<Box {...style.content}>
				<Icon svg={<LockIcon />} {...style.icon} />
				<Text {...style.text}>{nearbyDealsCopy.areaFixed}</Text>
			</Box>
		</Box>
	);
}
