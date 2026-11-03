import { VStack } from "@seed-design/react";
import type { BuildingSearchResult } from "@/entities/building/model/buildingSearchResult";
import BuildingSummaryItem from "@/entities/building/ui/BuildingSummaryItem";

interface SearchResultProps {
	result: BuildingSearchResult;
}

/**
 * 홈 > 검색 결과
 *
 * - 결과가 found가 아니면 출력하지 않음
 * - 결과가 found이면 건물 목록 출력
 */
export default function SearchResult({ result }: SearchResultProps) {
	if (result.kind !== "found") {
		return null;
	}

	return (
		<VStack as="ul" m={0} p={0}>
			{result.buildings.map((building) => (
				<VStack as="li" key={building.id}>
					<BuildingSummaryItem building={building} />
				</VStack>
			))}
		</VStack>
	);
}
