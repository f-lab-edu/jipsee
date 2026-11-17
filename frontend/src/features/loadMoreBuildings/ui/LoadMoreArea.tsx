import { Flex } from "@seed-design/react";
import { loadMoreStyles } from "@/features/loadMoreBuildings/config/loadMoreStyles";
import type { LoadMoreStatus } from "@/features/loadMoreBuildings/model/loadMoreStatus";
import LoadMoreButton from "@/features/loadMoreBuildings/ui/LoadMoreButton";
import LoadMoreError from "@/features/loadMoreBuildings/ui/LoadMoreError";
import type { ResponsiveVariant } from "@/shared/model/responsiveVariant";

interface LoadMoreAreaProps {
	variant: ResponsiveVariant;
	hasNext: boolean;
	status: LoadMoreStatus;
	onLoadMore: () => void;
}

/**
 * 더 보기 > 영역
 *
 * - 다음 페이지가 없으면 출력하지 않음
 * - 오류이면 오류 띠를, 그 밖에는 더 보기 버튼을 출력하고 불러오는 중이면 비활성화
 *
 * @param variant 모바일은 가로 꽉 찬 버튼, 데스크톱은 가운데 정렬 버튼
 * @param onLoadMore 더 보기 버튼이나 다시 시도를 누르면 호출
 */
export default function LoadMoreArea({
	variant,
	hasNext,
	status,
	onLoadMore,
}: LoadMoreAreaProps) {
	const style = loadMoreStyles[variant];

	if (!hasNext) {
		return null;
	}

	if (status === "error") {
		return (
			<Flex data-area="search-more-area" {...style.area}>
				<LoadMoreError style={style} onRetry={onLoadMore} />
			</Flex>
		);
	}

	return (
		<Flex data-area="search-more-area" {...style.area}>
			<LoadMoreButton
				style={style}
				isLoading={status === "loading"}
				onClick={onLoadMore}
			/>
		</Flex>
	);
}
