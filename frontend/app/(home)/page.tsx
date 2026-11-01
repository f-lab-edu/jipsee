import { toKeyword } from "@/pages/home/lib/toKeyword";
import HomePage from "@/pages/home/ui/HomePage";

export default async function Page({ searchParams }: PageProps<"/">) {
	const { keyword } = await searchParams;

	return <HomePage keyword={toKeyword(keyword)} />;
}
