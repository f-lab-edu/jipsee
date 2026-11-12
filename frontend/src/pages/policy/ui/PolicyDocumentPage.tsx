import { Box, Text, VStack } from "@seed-design/react";
import type { Session } from "@/entities/session/model/session";
import { policyCopy } from "@/pages/policy/config/policyCopy";
import { policyScreenStyles } from "@/pages/policy/config/policyStyles";
import type { PolicyDocument } from "@/pages/policy/model/policyDocument";
import PolicyClauses from "@/pages/policy/ui/PolicyClauses";
import PolicyDraftNotice from "@/pages/policy/ui/PolicyDraftNotice";
import PolicyEffectiveDate from "@/pages/policy/ui/PolicyEffectiveDate";
import PolicyToc from "@/pages/policy/ui/PolicyToc";
import { colors } from "@/shared/config/colors";
import type { Nullable } from "@/shared/lib/utilityTypes/nullable";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";
import Header from "@/widgets/header/ui/Header";
import HeaderBackButton from "@/widgets/header/ui/HeaderBackButton";

interface PolicyDocumentPageProps {
	session: Nullable<Session>;
	currentPath: string;
	policyDocument: PolicyDocument;
}

/**
 * 정책 > 문서 화면
 *
 * - 뒤로 가기가 있는 로고 헤더 출력
 * - 모바일은 하늘빛 배경 위 카드(main) 본문 첫 줄에 제목, 임시 초안 안내, 시행일 줄, 목차, 조항 목록 출력
 * - 데스크톱은 하늘빛 배경 위 폭 720 열에 제목, 임시 초안 안내, 시행일 줄과 목차와 조항을 담은 카드 출력
 *
 * @param currentPath 로그인 링크가 돌아올 현재 정책 경로
 * @param policyDocument 제목, 시행일, 조항 목록을 가진 문서 데이터
 */
export default function PolicyDocumentPage({
	session,
	currentPath,
	policyDocument,
}: PolicyDocumentPageProps) {
	const style = policyScreenStyles;

	return (
		<>
			<Header
				session={session}
				currentPath={currentPath}
				mobileBackground={colors.pageBackground}
				mobileBack={<HeaderBackButton />}
			/>
			<VStack as="main" data-area="main" {...style.main}>
				<ResponsiveLayout
					testId="policy-body"
					fillsHeight
					mobile={
						<VStack {...style.mobileBody}>
							<Box data-area="policy-title-mobile">
								<Text as="h1" {...style.mobileTitle}>
									{policyDocument.title}
								</Text>
							</Box>
							<PolicyDraftNotice
								area="policy"
								layout="mobile"
								text={policyCopy.draftNotice}
							/>
							<PolicyEffectiveDate
								layout="mobile"
								effectiveDate={policyDocument.effectiveDate}
							/>
							<PolicyToc layout="mobile" clauses={policyDocument.clauses} />
							<PolicyClauses layout="mobile" policyDocument={policyDocument} />
						</VStack>
					}
					desktop={
						<VStack {...style.desktopBody}>
							<VStack data-area="policy-column" {...style.desktopColumn}>
								<Text as="h1" {...style.desktopTitle}>
									{policyDocument.title}
								</Text>
								<PolicyDraftNotice
									area="policy"
									layout="desktop"
									text={policyCopy.draftNotice}
								/>
								<VStack {...style.desktopCard}>
									<PolicyEffectiveDate
										layout="desktop"
										effectiveDate={policyDocument.effectiveDate}
									/>
									<PolicyToc
										layout="desktop"
										clauses={policyDocument.clauses}
									/>
									<PolicyClauses
										layout="desktop"
										policyDocument={policyDocument}
									/>
								</VStack>
							</VStack>
						</VStack>
					}
				/>
			</VStack>
		</>
	);
}
