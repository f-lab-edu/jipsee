import SearchForm from "@/features/searchBuildings/ui/SearchForm";

interface HomePageProps {
	keyword: string;
}

/** 검색 폼과 검색 결과를 함께 표시함 */
export default function HomePage({ keyword }: HomePageProps) {
	return (
		<main>
			<SearchForm key={keyword} defaultValue={keyword} />
		</main>
	);
}
