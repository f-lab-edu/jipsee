import IconMagnifyingglassLine from "@karrotmarket/react-monochrome-icon/IconMagnifyingglassLine";
import {
	ActionButton,
	Box,
	HStack,
	Icon,
	TextFieldInput,
	TextFieldRoot,
} from "@seed-design/react";
import Form from "next/form";
import { paths } from "@/shared/routes/paths";

interface SearchFormProps {
	defaultValue: string;
}

/** 검색어 입력창과 검색 버튼을 표시하고, 제출하면 홈으로 keyword 쿼리를 보냄 */
export default function SearchForm({ defaultValue }: SearchFormProps) {
	return (
		<Box px="spacingX.globalGutter">
			<Form action={paths.home}>
				<HStack gap="x2" align="center">
					<Box flexGrow={1}>
						<TextFieldRoot name="keyword" defaultValue={defaultValue}>
							<TextFieldInput
								placeholder="도로명 주소, 지번 주소, 건물명 등을 검색해주세요."
								aria-label="건물 검색"
								enterKeyHint="search"
							/>
						</TextFieldRoot>
					</Box>
					<ActionButton
						type="submit"
						layout="iconOnly"
						size="large"
						variant="neutralWeak"
						aria-label="검색"
					>
						<Icon svg={<IconMagnifyingglassLine />} />
					</ActionButton>
				</HStack>
			</Form>
		</Box>
	);
}
