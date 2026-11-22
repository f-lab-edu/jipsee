import { Box, Flex, Text, VStack } from "@seed-design/react";
import SearchForm from "@/features/searchBuildings/ui/SearchForm";
import { introBandStyles } from "@/pages/home/config/introBandStyles";
import { introHeadingStyles } from "@/pages/home/config/introHeadingStyles";
import { introLayoutStyles } from "@/pages/home/config/introLayoutStyles";
import IntroIllustrationDesktop from "@/pages/home/ui/IntroIllustrationDesktop";
import IntroIllustrationMobile from "@/pages/home/ui/IntroIllustrationMobile";
import { introCopy } from "@/shared/config/introCopy";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

/**
 * 홈 > 소개 영역
 *
 * - 표시 여부는 판단하지 않고 호출되면 항상 출력
 * - 제목 블록(h1과 설명)은 모바일과 데스크톱이 같은 요소를 쓰고 글자 크기만 반응형으로 바꿈
 * - 모바일은 제목 블록 오른쪽에 작은 일러스트, 데스크톱은 제목 오른쪽에 큰 일러스트 출력
 * - 검색창과 칩은 일러스트 아래까지 행 전체 폭 사용
 * - 검색창은 하나만 출력
 */
export default function IntroBand() {
	const style = introBandStyles;
	const heading = introHeadingStyles;
	const mobileStyle = introLayoutStyles.mobile;
	const desktopStyle = introLayoutStyles.desktop;

	return (
		<Box data-area="intro-band" {...style.root}>
			<ResponsiveLayout
				testId="intro-background"
				mobile={<Box {...mobileStyle.background} />}
				desktop={<Box {...desktopStyle.background} />}
			/>
			<VStack {...style.content}>
				<Flex data-area="intro-heading" {...heading.row}>
					<VStack {...heading.titleBlock}>
						<Text as="h1" {...heading.title}>
							{introCopy.titleFirstLine} <br />
							{introCopy.titleSecondLine}
						</Text>
						<Text as="p" {...heading.description}>
							{introCopy.description}
						</Text>
					</VStack>
					<Flex
						data-area="intro-illustration-mobile"
						{...heading.mobileIllustrationCell}
					>
						<IntroIllustrationMobile />
					</Flex>
					<Flex
						data-area="intro-illustration-desktop"
						{...heading.desktopIllustrationCell}
					>
						<IntroIllustrationDesktop />
					</Flex>
				</Flex>
				<VStack data-area="intro-search" {...style.formGroup}>
					<SearchForm defaultValue="" variant="intro" invalid={false} />
					<ResponsiveLayout
						testId="intro-chips"
						mobile={
							<Flex {...mobileStyle.chips}>
								{introCopy.chips.map((label) => (
									<Box key={label} {...mobileStyle.chip}>
										<Text {...mobileStyle.chipLabel}>{label}</Text>
									</Box>
								))}
							</Flex>
						}
						desktop={
							<Flex {...desktopStyle.chips}>
								{introCopy.chips.map((label) => (
									<Box key={label} {...desktopStyle.chip}>
										<Text {...desktopStyle.chipLabel}>{label}</Text>
									</Box>
								))}
							</Flex>
						}
					/>
				</VStack>
			</VStack>
		</Box>
	);
}
