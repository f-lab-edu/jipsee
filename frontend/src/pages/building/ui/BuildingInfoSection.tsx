import { Text, VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import DongInfoCard from "@/entities/building/ui/DongInfoCard";
import { buildingInfoCopy } from "@/pages/building/config/buildingInfoCopy";
import { buildingInfoSectionStyles } from "@/pages/building/config/buildingInfoSectionStyles";
import ExternalLinks from "@/pages/building/ui/ExternalLinks";
import { formatYearMonth } from "@/shared/lib/dates/formatYearMonth";
import type { YearMonth } from "@/shared/lib/dates/yearMonth";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface BuildingInfoSectionProps {
	layout: ResponsiveVariant;
	detail: BuildingDetail;
	registerBaseMonth: YearMonth;
}

/**
 * 건물 상세 > 건물 정보 영역
 *
 * - 제목, 동 카드, 건축물대장 기준 월, 외부 링크 순서로 출력
 * - 모바일은 건물명이 있을 때만 제목 아래에 주소 출력
 * - 데스크톱은 주소 없이 테두리가 있는 카드로 출력
 *
 * @param layout 섹션 모양과 `id` 접미사를 정함
 */
export default function BuildingInfoSection({
	layout,
	detail,
	registerBaseMonth,
}: BuildingInfoSectionProps) {
	const style = buildingInfoSectionStyles[layout];
	const titleId = `building-info-title-${layout}`;

	return (
		<VStack
			as="section"
			aria-labelledby={titleId}
			data-area={`building-info-${layout}`}
			{...style.section}
		>
			<VStack {...style.heading}>
				<Text as="h2" id={titleId} {...style.title}>
					{buildingInfoCopy.title}
				</Text>
				{layout === "mobile" && detail.name !== null && (
					<Text {...style.address}>{detail.address}</Text>
				)}
			</VStack>
			{detail.dongs.map((dong, index) => (
				<DongInfoCard
					// biome-ignore lint/suspicious/noArrayIndexKey: 동 이름이 없거나 겹칠 수 있어 순서를 키로 씀
					key={index}
					dong={dong}
					layout={layout}
					area={`dong-info-card-${layout}-${index + 1}`}
				/>
			))}
			<Text {...style.baseMonth}>
				{`${buildingInfoCopy.baseMonthPrefix} ${formatYearMonth(registerBaseMonth)} ${buildingInfoCopy.baseMonthSuffix}`}
			</Text>
			<ExternalLinks layout={layout} />
		</VStack>
	);
}
