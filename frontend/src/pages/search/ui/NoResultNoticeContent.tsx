import { Box, Icon, Text } from "@seed-design/react";
import type { ReactNode } from "react";
import { noResultCopy } from "@/pages/search/config/noResultCopy";
import type { NoResultNoticeStyle } from "@/pages/search/model/noResultNoticeStyle";
import NoResultIcon from "@/pages/search/ui/NoResultIcon";

interface NoResultNoticeContentProps {
	style: NoResultNoticeStyle;
	title: ReactNode;
}

/**
 * 검색 > 결과 없음 안내 내용
 *
 * - 원 안의 아이콘, 제목, 설명 순서로 출력
 *
 * @param style 모바일 또는 데스크톱 레이아웃의 스타일
 * @param title 레이아웃에 맞게 줄바꿈을 정한 제목
 */
export default function NoResultNoticeContent({
	style,
	title,
}: NoResultNoticeContentProps) {
	return (
		<Box {...style.root}>
			<Box {...style.circle}>
				<Icon svg={<NoResultIcon />} {...style.icon} />
			</Box>
			<Box {...style.textBlock}>
				<Text as="p" {...style.title}>
					{title}
				</Text>
				<Text as="p" {...style.description}>
					{noResultCopy.description}
				</Text>
			</Box>
		</Box>
	);
}
