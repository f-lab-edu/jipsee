import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import SearchResult from "@/pages/home/ui/SearchResult";

interface HomePageProps {
	keyword: string;
}

/** 검색 폼과 검색 결과를 함께 표시함 */
export default function HomePage({ keyword }: HomePageProps) {
	return (
		<main>
			<SearchForm key={keyword} defaultValue={keyword} />
			<SearchResult keyword={keyword} />
		</main>
	);
}
