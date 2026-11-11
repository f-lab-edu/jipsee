import { VStack } from "@seed-design/react";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";
import DataSourceCard from "@/entities/dataSource/ui/DataSourceCard";
import { dataSourcesStyles } from "@/pages/policy/config/dataSourcesStyles";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DataSourcesCardsProps {
	layout: ResponsiveVariant;
	items: readonly DataSourceCardItem[];
}

/** 데이터 출처 > 출처 카드 목록 */
export default function DataSourcesCards({
	layout,
	items,
}: DataSourcesCardsProps) {
	return (
		<VStack {...dataSourcesStyles.cardList}>
			{items.map((item, index) => (
				<DataSourceCard
					key={item.source}
					layout={layout}
					order={index + 1}
					item={item}
				/>
			))}
		</VStack>
	);
}
