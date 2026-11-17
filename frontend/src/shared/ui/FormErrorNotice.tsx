"use client";

import IconExclamationmarkCircleLine from "@karrotmarket/react-monochrome-icon/IconExclamationmarkCircleLine";
import { Box, HStack, Icon, Text } from "@seed-design/react";
import { useEffect } from "react";
import { errorNoticeStyles } from "@/shared/config/errorNoticeStyles";
import { formErrorCopy } from "@/shared/config/formErrorCopy";
import type { FormErrorCode } from "@/shared/model/formErrorCode";

interface FormErrorNoticeProps {
	code: FormErrorCode;
}

/**
 * 공통 > 폼 전송 실패 안내
 *
 * - 실패 코드에 맞는 문구를 role="alert" 띠로 출력
 * - 화면이 뜨면 주소에서 error 쿼리를 지워 새로고침해도 띠가 다시 나오지 않도록 정리
 */
export default function FormErrorNotice({ code }: FormErrorNoticeProps) {
	const style = errorNoticeStyles;

	useEffect(() => {
		const url = new URL(window.location.href);
		url.searchParams.delete("error");
		window.history.replaceState(window.history.state, "", url);
	}, []);

	return (
		<HStack role="alert" data-area="form-error-banner" {...style.box}>
			<Box {...style.iconCell}>
				<Icon svg={<IconExclamationmarkCircleLine />} {...style.icon} />
			</Box>
			<Text as="p" {...style.text}>
				{formErrorCopy[code]}
			</Text>
		</HStack>
	);
}
