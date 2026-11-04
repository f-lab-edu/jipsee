import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import DesktopHeader from "@/widgets/header/ui/DesktopHeader";
import MobileSearchHeader from "@/widgets/header/ui/MobileSearchHeader";

interface SearchHeaderProps {
	session: Nullable<Session>;
	keyword: string;
}

/**
 * 헤더 > 검색 헤더
 *
 * - 모바일은 뒤로 가기와 검색창, 데스크톱은 기존 헤더 출력
 *
 * @param keyword 모바일 검색창의 초기 검색어
 */
export default function SearchHeader({ session, keyword }: SearchHeaderProps) {
	return (
		<header>
			<ResponsiveLayout
				testId="header"
				mobile={<MobileSearchHeader keyword={keyword} />}
				desktop={<DesktopHeader session={session} />}
			/>
		</header>
	);
}
