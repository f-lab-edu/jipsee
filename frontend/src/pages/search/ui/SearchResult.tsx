import { VStack } from "@seed-design/react";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import BuildingSummaryItem from "@/entities/building/ui/BuildingSummaryItem";
import { searchResultStyles } from "@/pages/search/config/searchResultStyles";
import BuildingTable from "@/pages/search/ui/BuildingTable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

interface SearchResultProps {
	result: BuildingSearchResult;
}

/**
 * 검색 > 검색 결과
 *
 * - 결과가 found가 아니면 출력하지 않음
 * - 결과가 found이면 모바일은 건물 목록, 데스크톱은 건물 표 출력
 */
export default function SearchResult({ result }: SearchResultProps) {
	if (result.kind !== "found") {
		return null;
	}

	return (
		<ResponsiveLayout
			testId="search-result"
			mobile={
				<VStack as="ul" {...searchResultStyles.list}>
					{result.buildings.map((building) => (
						<VStack as="li" key={building.id}>
							<BuildingSummaryItem building={building} />
						</VStack>
					))}
				</VStack>
			}
			desktop={<BuildingTable buildings={result.buildings} />}
		/>
	);
}
