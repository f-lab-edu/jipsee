import { HStack, Text, VStack } from "@seed-design/react";
import { dataSourceCardCopy } from "@/entities/dataSource/config/dataSourceCardCopy";
import { dataSourceCardStyles } from "@/entities/dataSource/config/dataSourceCardStyles";
import { toUpdateLine } from "@/entities/dataSource/lib/toUpdateLine";
import type { DataSourceCardItem } from "@/entities/dataSource/model/dataSourceCardItem";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface DataSourceCardProps {
	layout: ResponsiveVariant;
	order: number;
	item: DataSourceCardItem;
}

/**
 * 데이터 출처 > 출처 카드
 *
 * - 데이터명, 제공 기관, 갱신 주기와 기준 월, 원본 링크 출력
 * - 원본 링크는 새 탭에서 열림
 *
 * @param order 1부터 시작하는 카드 순번. `data-area`에 씀
 */
export default function DataSourceCard({
	layout,
	order,
	item,
}: DataSourceCardProps) {
	const style = dataSourceCardStyles;

	return (
		<VStack data-area={`data-source-card-${layout}-${order}`} {...style.card}>
			<Text as="h2" {...style.name}>
				{item.name}
			</Text>
			<Text as="p" {...style.provider}>
				{item.provider}
			</Text>
			<HStack {...style.footer}>
				<Text as="p" {...style.updateLine}>
					{toUpdateLine(item.updateCycle, item.baseMonth)}
				</Text>
				<a href={item.originalUrl} target="_blank" rel="noopener noreferrer">
					<Text {...style.originalLink}>{dataSourceCardCopy.original}</Text>
				</a>
			</HStack>
		</VStack>
	);
}
