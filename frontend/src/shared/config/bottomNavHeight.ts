const tabHeight = 56;
const borderWidth = 1;
const footerHeight = 44;

/** 하단 내비게이션 > 탭 높이 */
export const bottomNavTabHeight = `${tabHeight}px`;

/** 하단 내비게이션 > 하단 바가 붙을 아래 간격. 탭 높이에 위 테두리와 아래 안전 영역을 더함 */
export const bottomNavOffset = `calc(${tabHeight + borderWidth}px + env(safe-area-inset-bottom))`;

/** 모바일 푸터 > 높이 */
export const footerMobileHeight = `${footerHeight}px`;

/** 모바일 하단 바(챗봇 패널, 챗봇 축소 바, 질문하기 바)가 붙을 아래 간격. 내비게이션 간격에 푸터 높이를 더함 */
export const bottomBarOffset = `calc(${bottomNavOffset} + ${footerMobileHeight})`;
