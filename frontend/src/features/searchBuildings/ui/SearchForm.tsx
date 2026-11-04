import {
	Box,
	HStack,
	Icon,
	Text,
	TextFieldInput,
	TextFieldRoot,
} from "@seed-design/react";
import Form from "next/form";
import { searchFormStyles } from "@/features/searchBuildings/config/searchFormStyles";
import type { SearchFormVariant } from "@/features/searchBuildings/model/searchFormVariant";
import SearchIcon from "@/features/searchBuildings/ui/SearchIcon";
import { paths } from "@/shared/routes/paths";

interface SearchFormProps {
	defaultValue: string;
	variant: SearchFormVariant;
}

/**
 * 검색 > 검색 폼
 *
 * - 검색어 입력 하나만 출력
 * - 모바일은 필드 안 아이콘 버튼, 데스크톱은 필드 안 돋보기와 필드 밖 텍스트 버튼 출력
 * - 제출 시 검색 페이지로 keyword 쿼리 전달
 *
 * @param variant 검색창 모양. 모양별 스타일 값을 고름
 */
export default function SearchForm({ defaultValue, variant }: SearchFormProps) {
	const style = searchFormStyles[variant];

	return (
		<Form action={paths.search} role="search">
			<HStack {...style.row}>
				<Box {...style.fieldCell}>
					<TextFieldRoot
						name="keyword"
						defaultValue={defaultValue}
						{...style.field}
					>
						<Box {...style.leading}>
							<Icon svg={<SearchIcon />} {...style.leadingIcon} />
						</Box>
						<TextFieldInput
							placeholder="도로명 주소, 지번 주소, 건물명 등을 검색해주세요."
							aria-label="건물 검색"
							enterKeyHint="search"
							{...style.input}
						/>
						<Box asChild {...style.iconButton}>
							<button type="submit" aria-label="검색">
								<Icon svg={<SearchIcon />} {...style.iconButtonIcon} />
							</button>
						</Box>
					</TextFieldRoot>
				</Box>
				<Box asChild {...style.textButton}>
					<button type="submit">
						<Text {...style.textButtonLabel}>검색</Text>
					</button>
				</Box>
			</HStack>
		</Form>
	);
}
