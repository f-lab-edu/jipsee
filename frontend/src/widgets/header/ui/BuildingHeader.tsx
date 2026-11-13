import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface BuildingHeaderProps {
	session: Nullable<Session>;
	currentPath: string;
}

/**
 * 헤더 > 건물 상세 헤더
 *
 * - 모바일은 로고 왼쪽에 뒤로 가기 버튼 출력
 */
export default function BuildingHeader({
	session,
	currentPath,
}: BuildingHeaderProps) {
	return (
		<Header
			session={session}
			currentPath={currentPath}
			mobileBack={<HeaderBackButton />}
		/>
	);
}
