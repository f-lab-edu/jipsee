import { Box } from "@seed-design/react";
import type { ReactNode } from "react";
import { nearbyDealsOptions } from "@/entities/building/config/nearbyDealsOptions";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { nearbyDealsFilterStyles } from "@/features/filterNearbyDeals/config/nearbyDealsFilterStyles";
import { nearbyFilterLabels } from "@/features/filterNearbyDeals/config/nearbyFilterLabels";
import NearbyDealsFilterGroup from "@/features/filterNearbyDeals/ui/NearbyDealsFilterGroup";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsFilterProps {
	layout: ResponsiveVariant;
	buildingId: number;
	condition: NearbyDealsCondition;
	children?: ReactNode;
}

/**
 * 주변 거래 필터 > 필터 상자
 *
 * - 반경, 기간, 유형 그룹 순서로 출력
 * - 그룹 뒤에 자식을 마지막 줄로 출력
 * - 그룹을 가로로 출력하고 넘치면 줄바꿈
 * - 데스크톱은 배경 상자 안에 출력
 *
 * @param children 필터 상자 안 마지막 줄에 출력할 내용
 */
export default function NearbyDealsFilter({
	layout,
	buildingId,
	condition,
	children,
}: NearbyDealsFilterProps) {
	const style = nearbyDealsFilterStyles[layout];
	const { groups, options: optionLabels } = nearbyFilterLabels;

	return (
		<Box data-area={`nearby-filter-${layout}`} {...style.container}>
			<NearbyDealsFilterGroup
				layout={layout}
				buildingId={buildingId}
				condition={condition}
				name="radius"
				label={groups.radius}
				options={nearbyDealsOptions.radii}
				optionLabels={optionLabels.radius}
			/>
			<NearbyDealsFilterGroup
				layout={layout}
				buildingId={buildingId}
				condition={condition}
				name="period"
				label={groups.period}
				options={nearbyDealsOptions.periods}
				optionLabels={optionLabels.period}
			/>
			<NearbyDealsFilterGroup
				layout={layout}
				buildingId={buildingId}
				condition={condition}
				name="type"
				label={groups.type}
				options={nearbyDealsOptions.types}
				optionLabels={optionLabels.type}
			/>
			{children}
		</Box>
	);
}
