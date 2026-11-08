import type { Session } from "@/entities/session/model/session";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import DesktopHeader from "@/widgets/header/ui/DesktopHeader";
import MobileBackHeader from "@/widgets/header/ui/MobileBackHeader";

interface BuildingHeaderProps {
	session: Nullable<Session>;
	title: string;
}

/**
 * 헤더 > 건물 상세 헤더
 *
 * - 모바일은 뒤로 가기와 제목, 데스크톱은 기존 헤더 출력
 *
 * @param title 모바일 헤더 제목
 */
export default function BuildingHeader({
	session,
	title,
}: BuildingHeaderProps) {
	return (
		<header>
			<ResponsiveLayout
				testId="header"
				mobile={<MobileBackHeader title={title} />}
				desktop={<DesktopHeader session={session} />}
			/>
		</header>
	);
}
