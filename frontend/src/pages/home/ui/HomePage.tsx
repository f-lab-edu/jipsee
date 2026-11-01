import type { Session } from "@/entities/session/model/session";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import SearchResult from "@/pages/home/ui/SearchResult";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import Header from "@/widgets/header/ui/Header";

interface HomePageProps {
	keyword: string;
	session: Nullable<Session>;
}

/** 홈페이지 */
export default function HomePage({ keyword, session }: HomePageProps) {
	return (
		<>
			<Header session={session} background="bg.layerDefault" />
			<main>
				<SearchForm key={keyword} defaultValue={keyword} />
				<SearchResult keyword={keyword} />
			</main>
		</>
	);
}
