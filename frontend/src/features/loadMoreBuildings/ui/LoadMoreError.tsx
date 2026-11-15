import { Box, Flex, Icon, Text } from "@seed-design/react";
import { loadMoreCopy } from "@/features/loadMoreBuildings/config/loadMoreCopy";
import type { LoadMoreStyle } from "@/features/loadMoreBuildings/model/loadMoreStyle";
import LoadMoreErrorIcon from "@/features/loadMoreBuildings/ui/LoadMoreErrorIcon";

interface LoadMoreErrorProps {
	style: LoadMoreStyle;
	onRetry: () => void;
}

/**
 * 더 보기 > 오류 띠
 *
 * - role이 alert인 띠에 아이콘과 오류 문구, 다시 시도 버튼 출력
 *
 * @param onRetry 다시 시도를 누르면 호출
 */
export default function LoadMoreError({ style, onRetry }: LoadMoreErrorProps) {
	return (
		<Flex role="alert" data-area="search-more-error" {...style.error}>
			<Flex {...style.errorRow}>
				<Icon svg={<LoadMoreErrorIcon />} {...style.errorIcon} />
				<Text {...style.errorText}>{loadMoreCopy.error}</Text>
			</Flex>
			<Box asChild {...style.retryButton}>
				<button type="button" onClick={onRetry}>
					<Text {...style.retryText}>{loadMoreCopy.retry}</Text>
				</button>
			</Box>
		</Flex>
	);
}
