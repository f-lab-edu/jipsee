import IconExclamationmarkCircleLine from "@karrotmarket/react-monochrome-icon/IconExclamationmarkCircleLine";
import { Box, FieldErrorMessage, HStack, Icon, Text } from "@seed-design/react";
import { searchFormCopy } from "@/features/searchBuildings/config/searchFormCopy";
import { searchFormErrorStyles } from "@/features/searchBuildings/config/searchFormErrorStyles";

/**
 * 검색 > 검색어 오류 줄
 *
 * - FieldRoot 안에서만 사용
 * - 경고 아이콘 뒤에 오류 문구 출력
 * - 모바일은 13/18, 데스크톱은 14/20 글자로 문구만 나눠 출력
 */
export default function SearchFormErrorMessage() {
	const style = searchFormErrorStyles;

	return (
		<FieldErrorMessage>
			<HStack {...style.line}>
				<Icon svg={<IconExclamationmarkCircleLine />} {...style.icon} />
				<Box {...style.mobileCell}>
					<Text {...style.mobileText}>{searchFormCopy.queryTooShort}</Text>
				</Box>
				<Box {...style.desktopCell}>
					<Text {...style.desktopText}>{searchFormCopy.queryTooShort}</Text>
				</Box>
			</HStack>
		</FieldErrorMessage>
	);
}
