"use client";

import "@seed-design/css/all.css";
import "./theme.css";
import { Box, Icon, Text, VStack } from "@seed-design/react";
import { statusAreas } from "@/shared/config/statusAreas";
import { statusActionCopy, statusCopy } from "@/shared/config/statusCopy";
import { statusStyles } from "@/shared/config/statusStyles";
import StatusHomeLink from "@/shared/ui/StatusHomeLink";
import StatusIcon from "@/shared/ui/StatusIcon";

interface GlobalErrorProps {
	reset: () => void;
}

/**
 * 오류 > 전역 경계
 *
 * - 루트 레이아웃이 실패했을 때 헤더 없이 일반 오류 내용만 출력
 * - 루트 레이아웃을 대신하므로 html과 body를 직접 출력
 * - 라우터 컨텍스트 밖에서 그려지므로 다시 시도는 router 없이 reset만 호출
 */
export default function GlobalError({ reset }: GlobalErrorProps) {
	const style = statusStyles.mobile;

	return (
		<html lang="ko" data-seed data-seed-color-mode="system">
			<body>
				<VStack minHeight="100dvh" justifyContent="center" px="x6">
					<VStack as="section" data-area={statusAreas.error} {...style.root}>
						<Box {...style.circle}>
							<Icon svg={<StatusIcon kind="error" />} {...style.icon} />
						</Box>
						<Text as="h1" {...style.title}>
							{statusCopy.error.titleLines.join(" ")}
						</Text>
						<VStack {...style.actions}>
							<Box asChild {...style.primaryButton}>
								<button type="button" onClick={reset}>
									<Text {...style.primaryText}>{statusActionCopy.retry}</Text>
								</button>
							</Box>
							<StatusHomeLink
								style={style.secondaryButton}
								textStyle={style.secondaryText}
							/>
						</VStack>
					</VStack>
				</VStack>
			</body>
		</html>
	);
}
