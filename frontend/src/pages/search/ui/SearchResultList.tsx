"use client";

import { Box, VisuallyHidden, VStack } from "@seed-design/react";
import { useEffect, useRef } from "react";
import type { BuildingSummary } from "@/entities/building/model/buildingSummary";
import BuildingSummaryItem from "@/entities/building/ui/BuildingSummaryItem";
import { toLoadMoreAnnouncement } from "@/features/loadMoreBuildings/lib/toLoadMoreAnnouncement";
import { useLoadMoreBuildings } from "@/features/loadMoreBuildings/model/useLoadMoreBuildings";
import LoadMoreArea from "@/features/loadMoreBuildings/ui/LoadMoreArea";
import { searchResultStyles } from "@/pages/search/config/searchResultStyles";
import BuildingTable from "@/pages/search/ui/BuildingTable";
import { paths } from "@/shared/routes/paths";
import ResponsiveLayout from "@/shared/ui/ResponsiveLayout";

interface SearchResultListProps {
	keyword: string;
	buildings: BuildingSummary[];
	hasNext: boolean;
}

/**
 * 검색 > 검색 결과 목록
 *
 * - 서버가 그린 처음 20건에 더 보기로 받은 건물을 이어 붙임
 * - 모바일은 건물 목록, 데스크톱은 건물 표 아래에 더 보기 영역 출력
 * - 새 건물이 붙으면 보이는 쪽의 첫 새 건물 링크로 포커스를 옮기고 스크린 리더에 건수 알림
 *
 * @param buildings 서버가 그린 처음 건물 목록
 * @param hasNext 처음 목록 뒤에 다음 페이지가 있는지 여부
 */
export default function SearchResultList({
	keyword,
	buildings: initialBuildings,
	hasNext: initialHasNext,
}: SearchResultListProps) {
	const { buildings, hasNext, status, added, loadMore } = useLoadMoreBuildings({
		keyword,
		initialBuildings,
		initialHasNext,
	});
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (added === null) {
			return;
		}

		const links = containerRef.current?.querySelectorAll<HTMLAnchorElement>(
			`a[href="${paths.building(added.firstId)}"]`,
		);
		const visibleLink = Array.from(links ?? []).find(
			(link) => link.offsetParent !== null,
		);

		visibleLink?.focus();
	}, [added]);

	return (
		<Box ref={containerRef}>
			<ResponsiveLayout
				testId="search-result"
				mobile={
					<>
						<VStack as="ul" {...searchResultStyles.list}>
							{buildings.map((building) => (
								<VStack as="li" key={building.id}>
									<BuildingSummaryItem building={building} />
								</VStack>
							))}
						</VStack>
						<LoadMoreArea
							variant="mobile"
							hasNext={hasNext}
							status={status}
							onLoadMore={loadMore}
						/>
					</>
				}
				desktop={
					<BuildingTable buildings={buildings}>
						<LoadMoreArea
							variant="desktop"
							hasNext={hasNext}
							status={status}
							onLoadMore={loadMore}
						/>
					</BuildingTable>
				}
			/>
			<VisuallyHidden asChild>
				<div
					role="status"
					aria-live="polite"
					data-area="search-more-announcement"
				>
					{added !== null && (
						<span key={added.sequence}>
							{toLoadMoreAnnouncement(added.count)}
						</span>
					)}
				</div>
			</VisuallyHidden>
		</Box>
	);
}
