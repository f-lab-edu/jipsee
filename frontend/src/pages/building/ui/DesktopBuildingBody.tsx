import { VStack } from "@seed-design/react";
import type { BuildingDetail } from "@/entities/building/model/buildingDetail";
import { desktopBuildingBodyStyles } from "@/pages/building/config/desktopBuildingBodyStyles";
import BuildingTitleRow from "@/pages/building/ui/BuildingTitleRow";
import ContentContainer from "@/shared/ui/ContentContainer";

interface DesktopBuildingBodyProps {
	detail: BuildingDetail;
}

/**
 * 건물 상세 > 데스크톱 본문
 *
 * - 콘텐츠 컨테이너 안에 제목 줄 출력
 */
export default function DesktopBuildingBody({
	detail,
}: DesktopBuildingBodyProps) {
	const style = desktopBuildingBodyStyles;

	return (
		<ContentContainer>
			<VStack {...style.container}>
				<BuildingTitleRow name={detail.name} address={detail.address} />
			</VStack>
		</ContentContainer>
	);
}
