import { Box, type BoxProps, Text, type TextProps } from "@seed-design/react";
import { statusActionCopy } from "@/shared/config/statusCopy";
import { paths } from "@/shared/routes/paths";

interface StatusHomeLinkProps {
	style: BoxProps;
	textStyle: TextProps;
}

/**
 * 공통 > 홈으로 가기 링크
 *
 * - 화면 전체를 새로 불러오도록 a 요소로 홈 이동
 *
 * @param style 호출한 쪽이 정하는 버튼 모양
 * @param textStyle 호출한 쪽이 정하는 글자 모양
 */
export default function StatusHomeLink({
	style,
	textStyle,
}: StatusHomeLinkProps) {
	return (
		<Box asChild {...style}>
			<a href={paths.home}>
				<Text {...textStyle}>{statusActionCopy.home}</Text>
			</a>
		</Box>
	);
}
