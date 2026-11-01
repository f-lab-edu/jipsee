import SearchForm from "@/features/searchBuildings/ui/SearchForm";

interface HomePageProps {
	keyword: string;
}

export default function HomePage({ keyword }: HomePageProps) {
	return (
		<main>
			<SearchForm key={keyword} defaultValue={keyword} />
		</main>
	);
}
