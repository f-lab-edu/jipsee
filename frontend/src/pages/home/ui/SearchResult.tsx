import { VStack } from "@seed-design/react";
import { searchBuildings } from "@/entities/building/api/searchBuildings";
import BuildingSummaryItem from "@/entities/building/ui/BuildingSummaryItem";

interface SearchResultProps {
	keyword: string;
}

/**
 * 홈 > 검색 결과
 *
 * - 검색어가 비었거나 결과가 없으면 출력하지 않음
 * - 결과가 있으면 건물 목록 출력
 */
export default async function SearchResult({ keyword }: SearchResultProps) {
	if (keyword === "") {
		return null;
	}

	const result = await searchBuildings(keyword);

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
