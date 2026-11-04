import { noResultCopy } from "@/pages/search/config/noResultCopy";
import { noResultNoticeStyles } from "@/pages/search/config/noResultNoticeStyles";
import NoResultNoticeContent from "@/pages/search/ui/NoResultNoticeContent";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

/**
 * 검색 > 결과 없음 안내
 *
 * - 모바일은 본문 열의 남는 높이를 채우고 안쪽을 가운데 정렬, 제목은 두 줄로 출력
 * - 데스크톱은 흰 패널이 남는 높이를 채우고 안쪽을 가운데 정렬, 제목은 한 줄로 출력
 */
export default function NoResultNotice() {
	return (
		<ResponsiveLayout
			testId="no-result"
			fillsHeight
			mobile={
				<NoResultNoticeContent
					style={noResultNoticeStyles.mobile}
					title={
						<>
							{noResultCopy.titleFirstLine}
							<br />
							{noResultCopy.titleSecondLine}
						</>
					}
				/>
			}
			desktop={
				<NoResultNoticeContent
					style={noResultNoticeStyles.desktop}
					title={`${noResultCopy.titleFirstLine} ${noResultCopy.titleSecondLine}`}
				/>
			}
		/>
	);
}
