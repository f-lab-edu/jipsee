import { Box, Text } from "@seed-design/react";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { nearbyDealsFilterStyles } from "@/features/filterNearbyDeals/config/nearbyDealsFilterStyles";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";
import NearbyDealsFilterChip from "@/features/filterNearbyDeals/ui/NearbyDealsFilterChip";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsFilterGroupProps<Name extends keyof NearbyDealsCondition> {
	layout: ResponsiveVariant;
	buildingId: number;
	condition: NearbyDealsCondition;
	name: Name;
	label: string;
	options: readonly NearbyDealsCondition[Name][];
	chipLabels: Record<NearbyDealsCondition[Name], string>;
}

/**
 * 주변 거래 필터 > 그룹
 *
 * - 라벨과 선택지 칩을 한 줄로 출력
 * - 라벨과 칩 묶음을 `role="group"`으로 두고 라벨 이름을 연결
 * - 현재 조건과 같은 값의 칩을 선택한 상태로 출력
 *
 * @param name 이 그룹이 바꾸는 조건 항목
 */
export default function NearbyDealsFilterGroup<
	Name extends keyof NearbyDealsCondition,
>({
	layout,
	buildingId,
	condition,
	name,
	label,
	options,
	chipLabels,
}: NearbyDealsFilterGroupProps<Name>) {
	const style = nearbyDealsFilterStyles[layout];
	const labelId = `nearby-filter-${name}-${layout}`;

	return (
		<Box
			role="group"
			aria-labelledby={labelId}
			data-area={labelId}
			{...style.group}
		>
			<Box {...style.labelCell}>
				<Text id={labelId} {...style.groupLabel}>
					{label}
				</Text>
			</Box>
			<Box {...style.chips}>
				{options.map((option) => (
					<NearbyDealsFilterChip
						key={option}
						layout={layout}
						href={toNearbyFilterHref(buildingId, condition, {
							[name]: option,
						})}
						label={chipLabels[option]}
						selected={condition[name] === option}
					/>
				))}
			</Box>
		</Box>
	);
}
