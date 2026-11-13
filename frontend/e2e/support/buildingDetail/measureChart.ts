export type ChartTextLabel = {
	text: string;
	x: number;
	y: number;
	w: number;
	r: number;
	fs: string;
	lh: string;
	fw: string;
	color: string;
	ta: string;
};

type ChartShape = {
	tag: string;
	r: number;
	width: number;
	fill: string;
	stroke: string;
	sw: number;
	dash: string;
	cap: string;
	transform: string | null;
};

type MarkerInfo = {
	shapes: ChartShape[];
	outer: number;
	core: number;
	color: string;
};

type ChartLegendItem = {
	text: string;
	x: number;
	y: number;
	r: number;
	right: number;
	fs: string;
	lh: string;
	fw: string;
	color: string;
	marker:
		| ({
				x: number;
				w: number;
				h: number;
				cy: number;
				gapToText: number;
				textCy: number;
		  } & MarkerInfo)
		| null;
};

export type ChartMeasure = {
	domCount: number;
	scrollW: number;
	vw: number;
	visibleCount: number;
	found: boolean;
	role?: string | null;
	aria?: string | null;
	inDealHistory?: boolean;
	gridCols?: string;
	colGap?: string;
	box?: { w: number; h: number };
	ycol?: { x: number; w: number; h: number };
	xRow?: { y: number; h: number; mt: number };
	yLabels?: ChartTextLabel[];
	xLabels?: ChartTextLabel[];
	svg?: { h: number; w: number; ariaHidden: string | null } | null;
	points?: ({ cx: number; cy: number } & MarkerInfo)[];
	lines?: {
		y: number;
		x: number;
		w: number;
		dash: string;
		sw: string;
		stroke: string;
	}[];
	band?: {
		x: number;
		y: number;
		w: number;
		h: number;
		fill: string;
		edgeX: number;
		edgeStroke: string;
		edgeSw: string;
		edgeDash: string;
		label: {
			text: string;
			x: number;
			y: number;
			fs: string;
			lh: string;
			fw: string;
			color: string;
		};
	} | null;
	pill?: {
		text: string;
		x: number;
		y: number;
		w: number;
		h: number;
		cx: number;
		cy: number;
		bg: string;
		border: string;
		radius: string;
		pad: string;
		fs: string;
		lh: string;
		fw: string;
		color: string;
		textX: number;
		textY: number;
	} | null;
	legendDomCount?: number;
	legendVisibleCount?: number;
	h2Top?: number;
	h2Text?: string;
	sectionBottom?: number;
	gridTop?: number;
	boxTop?: number;
	xRowBottom?: number;
	legend?: {
		y: number;
		h: number;
		x: number;
		w: number;
		bottomToGrid: number;
		colGap: string;
		rowGap: string;
		wrap: string;
		items: ChartLegendItem[];
	};
	dateAfter?: { text: string; y: number } | null;
	firstAfter?: { text: string; dy: number } | null;
};

/** 보이는 점 그래프를 측정함. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음. 좌표는 그래프 상자(role=img) 왼쪽 위 기준임 */
export function measureChart(): ChartMeasure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const R = (e: Element) => {
		const r = e.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom };
	};
	const TR = (e: Element) => {
		const rg = document.createRange();
		rg.selectNodeContents(e);
		const r = rg.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height };
	};
	const sel = '[role="img"][aria-label^="거래 금액"]';
	const boxes = [...document.querySelectorAll(sel)];
	const box = boxes.find(vis);
	const out: ChartMeasure = {
		domCount: boxes.length,
		scrollW: document.documentElement.scrollWidth,
		vw: document.documentElement.clientWidth,
		visibleCount: boxes.filter(vis).length,
		found: !!box,
	};
	const vstack = box?.parentElement;
	const grid = vstack?.parentElement;
	if (!box || !vstack || !grid) return out;
	const yCol = grid.children[0];
	const xRow = vstack.children[1];
	const br = R(box);
	const txt = (e: Element) => {
		const c = getComputedStyle(e);
		return {
			fs: c.fontSize,
			lh: c.lineHeight,
			fw: c.fontWeight,
			color: c.color,
			ta: c.textAlign,
		};
	};
	const labels = (root: Element) => {
		const list: ChartTextLabel[] = [];
		const wk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		while (wk.nextNode()) {
			const t = text(wk.currentNode);
			const e = wk.currentNode.parentElement;
			if (!t || !e) continue;
			const r = TR(e);
			list.push({
				text: t,
				x: r.x - br.x,
				y: r.y - br.y,
				w: r.w,
				r: r.x + r.w - br.x,
				...txt(e),
			});
		}
		return list;
	};
	const gc = getComputedStyle(grid);
	out.role = box.getAttribute("role");
	out.aria = box.getAttribute("aria-label");
	out.inDealHistory = !!box.closest(
		'section[aria-labelledby^="deal-history-title"]',
	);
	out.gridCols = gc.gridTemplateColumns;
	out.colGap = gc.columnGap;
	out.box = { w: br.w, h: br.h };
	out.ycol = { x: R(yCol).x - br.x, w: R(yCol).w, h: R(yCol).h };
	out.xRow = { y: R(xRow).y - br.y, h: R(xRow).h, mt: R(xRow).y - br.b };
	out.yLabels = labels(yCol);
	out.xLabels = labels(xRow);
	const svg = box.querySelector(":scope > svg");
	out.svg = svg
		? { h: R(svg).h, w: R(svg).w, ariaHidden: svg.getAttribute("aria-hidden") }
		: null;
	// 마커는 그래프 svg의 자식 svg임. 안의 도형(circle, rect)과 currentColor를 모음. outer는 테두리를 포함한 바깥 지름(마름모는 한 변), core는 안쪽 채운 점의 지름
	const markerInfo = (svgEl: Element): MarkerInfo => {
		const shapes = [...svgEl.querySelectorAll("circle, rect")].map((e) => {
			const c = getComputedStyle(e);
			return {
				tag: e.tagName,
				r: Number(e.getAttribute("r")),
				width: Number(e.getAttribute("width")),
				fill: c.fill,
				stroke: c.stroke,
				sw: c.stroke === "none" ? 0 : parseFloat(c.strokeWidth),
				dash: c.strokeDasharray,
				cap: c.strokeLinecap,
				transform: e.getAttribute("transform"),
			};
		});
		let outer = 0;
		for (const s of shapes) {
			outer = Math.max(
				outer,
				s.tag === "circle" ? (s.r + s.sw / 2) * 2 : s.width + s.sw,
			);
		}
		const filled = shapes.filter(
			(s) => s.tag === "circle" && s.fill !== "none",
		);
		const core =
			shapes.length > 1 ? Math.min(...filled.map((s) => s.r)) * 2 : outer;
		return { shapes, outer, core, color: getComputedStyle(svgEl).color };
	};
	const chartSvg = box.querySelector(":scope > svg");
	if (!chartSvg) return out;
	const csr = R(chartSvg);
	out.points = [...chartSvg.children]
		.filter((e) => e.tagName.toLowerCase() === "svg")
		.map((e) => ({
			cx: csr.x - br.x + (parseFloat(e.getAttribute("x") ?? "") / 100) * csr.w,
			cy: csr.y - br.y + (parseFloat(e.getAttribute("y") ?? "") / 100) * csr.h,
			...markerInfo(e),
		}));
	out.lines = [...chartSvg.querySelectorAll(":scope > line")].map((e) => {
		const r = R(e);
		const c = getComputedStyle(e);
		return {
			y: r.y - br.y,
			x: r.x - br.x,
			w: r.w,
			dash: c.strokeDasharray,
			sw: c.strokeWidth,
			stroke: c.stroke,
		};
	});
	// 이전 건물 영역: 그래프 상자 직계 div 중 rect를 가진 것. 알약: 안내 문구 p
	const bandEl = [...box.children].find(
		(e) => e.tagName === "DIV" && e.querySelector("rect"),
	);
	out.band = null;
	if (bandEl) {
		const rr = R(bandEl);
		const rc = bandEl.querySelector("rect");
		const ln = bandEl.querySelector("line");
		const lab = [...bandEl.querySelectorAll("p, span")].find((e) => text(e));
		if (rc && ln && lab) {
			const lc = getComputedStyle(ln);
			const lt = TR(lab);
			const ls = getComputedStyle(lab);
			out.band = {
				x: rr.x - br.x,
				y: rr.y - br.y,
				w: rr.w,
				h: rr.h,
				fill: getComputedStyle(rc).fill,
				edgeX: R(ln).x - br.x + R(ln).w / 2,
				edgeStroke: lc.stroke,
				edgeSw: lc.strokeWidth,
				edgeDash: lc.strokeDasharray,
				label: {
					text: text(lab),
					x: lt.x - rr.x,
					y: lt.y - rr.y,
					fs: ls.fontSize,
					lh: ls.lineHeight,
					fw: ls.fontWeight,
					color: ls.color,
				},
			};
		}
	}
	const pillText = [...box.querySelectorAll("p")].find(
		(e) => text(e) === "현재 건물 거래가 없어요",
	);
	out.pill = null;
	if (pillText?.parentElement) {
		const pb = pillText.parentElement;
		const pr = R(pb);
		const pc = getComputedStyle(pb);
		const tc = getComputedStyle(pillText);
		const pt = TR(pillText);
		out.pill = {
			text: text(pillText),
			x: pr.x - br.x,
			y: pr.y - br.y,
			w: pr.w,
			h: pr.h,
			cx: pr.x + pr.w / 2 - br.x,
			cy: pr.y + pr.h / 2 - br.y,
			bg: pc.backgroundColor,
			border: `${pc.borderTopWidth} ${pc.borderTopStyle} ${pc.borderTopColor}`,
			radius: pc.borderTopLeftRadius,
			pad: pc.padding,
			fs: tc.fontSize,
			lh: tc.lineHeight,
			fw: tc.fontWeight,
			color: tc.color,
			textX: pt.x - pr.x,
			textY: pt.y - pr.y,
		};
	}
	// 범례: 그래프 격자 바로 위 형제. 항목마다 글자와 마커
	const noteText = "월세는 목록에서 확인해요";
	const noteEls = [...document.querySelectorAll("*")].filter(
		(e) => e.children.length === 0 && text(e) === noteText,
	);
	out.legendDomCount = noteEls.length;
	out.legendVisibleCount = noteEls.filter(vis).length;
	const legend = grid.previousElementSibling;
	const sec = box.closest("section");
	const h2 = sec?.querySelector("h2");
	if (!legend || !sec || !h2) return out;
	const lr = R(legend);
	const lcs = getComputedStyle(legend);
	out.h2Top = R(h2).y;
	out.h2Text = text(h2);
	out.sectionBottom = R(sec).b;
	out.gridTop = R(grid).y;
	out.boxTop = br.y;
	out.xRowBottom = R(xRow).b;
	const legendOut: NonNullable<ChartMeasure["legend"]> = {
		y: lr.y,
		h: lr.h,
		x: lr.x,
		w: lr.w,
		bottomToGrid: R(grid).y - lr.b,
		colGap: lcs.columnGap,
		rowGap: lcs.rowGap,
		wrap: lcs.flexWrap,
		items: [],
	};
	out.legend = legendOut;
	for (const c of legend.children) {
		const tEl = (() => {
			const wk2 = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
			while (wk2.nextNode()) {
				if (text(wk2.currentNode)) return wk2.currentNode.parentElement;
			}
			return null;
		})();
		if (!tEl) continue;
		const tr = TR(tEl);
		const tcs = getComputedStyle(tEl);
		const item: ChartLegendItem = {
			text: text(c),
			x: tr.x - lr.x,
			y: tr.y - lr.y,
			r: tr.x + tr.w - lr.x,
			right: tr.x + tr.w,
			fs: tcs.fontSize,
			lh: tcs.lineHeight,
			fw: tcs.fontWeight,
			color: tcs.color,
			marker: null,
		};
		const mk = c.querySelector("svg");
		if (mk) {
			const mr = R(mk);
			item.marker = {
				x: mr.x - lr.x,
				w: mr.w,
				h: mr.h,
				cy: mr.y + mr.h / 2 - lr.y,
				gapToText: tr.x - mr.r,
				textCy: tr.y + tr.h / 2 - lr.y,
				...markerInfo(mk),
			};
		}
		legendOut.items.push(item);
	}
	// 그래프 아래 처음 나오는 날짜나 "이전 건물 거래" 글자까지의 거리
	const xb = R(xRow).b;
	const findAfter = () => {
		const wk = document.createTreeWalker(sec, NodeFilter.SHOW_TEXT);
		while (wk.nextNode()) {
			const t = text(wk.currentNode);
			const e = wk.currentNode.parentElement;
			if (!e || !vis(e) || R(e).y < xb - 0.5) continue;
			if (/^\d{4}\.\d{2}$/.test(t) || t === "이전 건물 거래") {
				return { text: t, y: TR(e).y };
			}
		}
		return null;
	};
	const after = findAfter();
	out.dateAfter = after;
	out.firstAfter = after ? { text: after.text, dy: after.y - xb } : null;
	return out;
}
