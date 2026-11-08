import { Box } from "@seed-design/react";
import { sectionDividerStyles } from "@/pages/building/config/sectionDividerStyles";

interface SectionDividerProps {
	area: string;
}

/**
 * 건물 상세 > 모바일 영역 구분 띠
 */
export default function SectionDivider({ area }: SectionDividerProps) {
	return <Box data-area={area} {...sectionDividerStyles.divider} />;
}
