import type { T } from "./makeT";

type LongNameRect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
};

export type C11LongName =
	| { found: false }
	| {
			found: true;
			before: string;
			after: string;
			name: LongNameRect;
			lh: string;
			to: string;
			ov: string;
			sw: number;
			cw: number;
			pageSw: number;
			pageCw: number;
			limit: LongNameRect;
			neighbor: LongNameRect;
			row?: LongNameRect;
			chipText?: LongNameRect | null;
			cells?: number;
	  };

/** 첫 행의 건물명 글자를 긴 이름으로 바꾼 뒤 한 줄, 말줄임, 옆 칸 침범, 가로 스크롤을 잼 */
export function c11MeasureLongName(
	t: T,
	layout: "mobile" | "desktop",
	longName: string,
): Promise<C11LongName> {
	return t.page.evaluate(
		({ layout, longName }): C11LongName => {
			const text = (node: Node | null | undefined) =>
				(node?.textContent ?? "").trim();
			const vis = (e: Element | null | undefined) =>
				!!e &&
				e.getClientRects().length > 0 &&
				getComputedStyle(e).visibility !== "hidden";
			const R = (e: Element) => {
				const r = e.getBoundingClientRect();
				return {
					x: r.x,
					y: r.y,
					w: r.width,
					h: r.height,
					r: r.right,
					b: r.bottom,
				};
			};
			const h2 = [...document.querySelectorAll("h2")].find(
				(h) => vis(h) && text(h) === "주변 전월세 거래",
			);
			const section = h2?.closest("section");
			if (!section) return { found: false };
			const row =
				layout === "mobile"
					? [...section.querySelectorAll("ul > li")].filter(vis)[0]
					: [...section.querySelectorAll('[role="table"] [role="row"]')].filter(
							(e) => vis(e) && !e.querySelector('[role="columnheader"]'),
						)[0];
			if (!row) return { found: false };
			const texts: Node[] = [];
			const wk = document.createTreeWalker(row, NodeFilter.SHOW_TEXT);
			while (wk.nextNode()) {
				const n = wk.currentNode;
				if (text(n) && vis(n.parentElement)) texts.push(n);
			}
			const nameEl = texts[0]?.parentElement;
			if (!nameEl) return { found: false };
			const before = nameEl.textContent ?? "";
			nameEl.textContent = longName;
			const c = getComputedStyle(nameEl);
			const base = {
				found: true as const,
				before,
				after: nameEl.textContent ?? "",
				name: R(nameEl),
				lh: c.lineHeight,
				to: c.textOverflow,
				ov: c.overflowX,
				sw: nameEl.scrollWidth,
				cw: nameEl.clientWidth,
				pageSw: document.documentElement.scrollWidth,
				pageCw: document.documentElement.clientWidth,
			};
			if (layout === "mobile") {
				const amountBox = texts[texts.length - 1]?.parentElement?.parentElement;
				const limitEl = nameEl.parentElement;
				if (!amountBox || !limitEl) return { found: false };
				return {
					...base,
					limit: R(limitEl),
					neighbor: R(amountBox),
					row: R(row),
				};
			}
			const cells = [...row.querySelectorAll('[role="cell"]')];
			const [limitEl, neighborEl] = cells;
			if (!limitEl || !neighborEl) return { found: false };
			const chipNode = texts.find((n) =>
				["신규", "갱신"].includes(text(n)),
			)?.parentElement;
			return {
				...base,
				limit: R(limitEl),
				neighbor: R(neighborEl),
				chipText: chipNode ? R(chipNode) : null,
				cells: cells.length,
			};
		},
		{ layout, longName },
	);
}
