import { Box, Icon, Text } from "@seed-design/react";
import { loadMoreCopy } from "@/features/loadMoreBuildings/config/loadMoreCopy";
import type { LoadMoreStyle } from "@/features/loadMoreBuildings/config/loadMoreStyles";
import LoadMoreChevronIcon from "@/features/loadMoreBuildings/ui/LoadMoreChevronIcon";
import LoadMoreSpinnerIcon from "@/features/loadMoreBuildings/ui/LoadMoreSpinnerIcon";

interface LoadMoreButtonProps {
	style: LoadMoreStyle;
	isLoading: boolean;
	onClick: () => void;
}

/**
 * 더 보기 > 버튼
 *
 * - 평소에는 더 보기 글자와 아래 화살표 출력
 * - 불러오는 중에는 비활성화하고 aria-busy를 켜 회전 아이콘과 불러오는 중 글자 출력
 */
export default function LoadMoreButton({
	style,
	isLoading,
	onClick,
}: LoadMoreButtonProps) {
	if (isLoading) {
		return (
			<Box asChild {...style.button}>
				<button type="button" disabled aria-busy="true">
					<Box {...style.loadingIconBox}>
						<Icon svg={<LoadMoreSpinnerIcon />} {...style.loadingIcon} />
					</Box>
					<Text {...style.buttonText}>{loadMoreCopy.loading}</Text>
				</button>
			</Box>
		);
	}

	return (
		<Box asChild {...style.button}>
			<button type="button" onClick={onClick}>
				<Text {...style.buttonText}>{loadMoreCopy.more}</Text>
				<Icon svg={<LoadMoreChevronIcon />} {...style.buttonIcon} />
			</button>
		</Box>
	);
}
