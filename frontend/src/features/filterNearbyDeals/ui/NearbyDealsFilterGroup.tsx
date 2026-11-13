"use client";

import IconChevronDownFill from "@karrotmarket/react-monochrome-icon/IconChevronDownFill";
import {
	Box,
	SelectContent,
	SelectItem,
	SelectItemBody,
	SelectItemLabel,
	SelectPositioner,
	SelectRoot,
	SelectScrollArea,
	SelectSuffixIcon,
	SelectTrigger,
	SelectValue,
	Text,
} from "@seed-design/react";
import { useRouter } from "next/navigation";
import type { NearbyDealsCondition } from "@/entities/building/model/nearbyDealsCondition";
import { nearbyDealsFilterStyles } from "@/features/filterNearbyDeals/config/nearbyDealsFilterStyles";
import { toNearbyFilterHref } from "@/features/filterNearbyDeals/lib/toNearbyFilterHref";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface NearbyDealsFilterGroupProps<Name extends keyof NearbyDealsCondition> {
	layout: ResponsiveVariant;
	buildingId: number;
	condition: NearbyDealsCondition;
	name: Name;
	label: string;
	options: readonly NearbyDealsCondition[Name][];
	optionLabels: Record<NearbyDealsCondition[Name], string>;
}

/**
 * 주변 거래 필터 > 그룹
 *
 * - 라벨과 선택 상자를 한 줄로 출력
 * - 라벨과 선택 상자를 `role="group"`으로 두고 라벨 이름을 연결
 * - 선택 상자는 현재 조건 값을 보여 주고, 누르면 선택지 목록을 출력
 * - 다른 값을 고르면 스크롤 위치를 유지한 채 쿼리가 바뀐 주소로 이동
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
	optionLabels,
}: NearbyDealsFilterGroupProps<Name>) {
	const router = useRouter();
	const style = nearbyDealsFilterStyles[layout];
	const labelId = `nearby-filter-${name}-${layout}`;

	const handleValueChange = ([value]: string[]) => {
		const option = options.find((candidate) => String(candidate) === value);

		if (option === undefined) {
			return;
		}

		router.push(toNearbyFilterHref(buildingId, condition, { [name]: option }), {
			scroll: false,
		});
	};

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
			<Box {...style.select}>
				<SelectRoot
					value={[String(condition[name])]}
					onValueChange={handleValueChange}
				>
					<SelectTrigger size="responsive" aria-labelledby={labelId}>
						<SelectValue />
						<SelectSuffixIcon svg={<IconChevronDownFill />} />
					</SelectTrigger>
					<SelectPositioner>
						<SelectContent>
							<SelectScrollArea>
								{options.map((option) => (
									<SelectItem
										key={option}
										value={String(option)}
										label={optionLabels[option]}
									>
										<SelectItemBody>
											<SelectItemLabel />
										</SelectItemBody>
									</SelectItem>
								))}
							</SelectScrollArea>
						</SelectContent>
					</SelectPositioner>
				</SelectRoot>
			</Box>
		</Box>
	);
}
