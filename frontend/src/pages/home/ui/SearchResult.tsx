import { VStack } from "@seed-design/react";
import { searchBuildings } from "@/entities/building/api/searchBuildings";
import BuildingSummaryItem from "@/entities/building/ui/BuildingSummaryItem";

interface SearchResultProps {
	keyword: string;
}

/** 검색어로 찾은 건물 목록을 표시하고, 검색어가 비었거나 결과가 없으면 아무것도 표시하지 않음 */
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
