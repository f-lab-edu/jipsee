export type Rect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
};

type H1Info = {
	text: string;
	rect: Rect;
	fs: string;
	fw: string;
	lh: string;
	color: string;
	inHeader: boolean;
	inMain: boolean;
};

export type BuildingMeasure = {
	vw: number;
	vh: number;
	scrollW: number;
	scrollH: number;
	title: string;
	bodyText: string;
	tint: string;
	bodyBg: string;
	dupIds: string[];
	mainCount: number;
	headerCount: number;
	footerCount: number;
	logoVisible: number;
	loginVisible: number;
	myInfoVisible: number;
	h1s: H1Info[];
	backs: { rect: Rect; bg: string; radius: string; tabIndex: number }[];
	header?: Rect;
	headerText?: string;
	headerBorder?: { b: number; w: number; color: string } | null;
	footer?: Rect;
	main?: Rect;
	column?: Rect;
	columnBorders?: string[];
	columnShadow?: string;
	bgHeader?: string;
	bgMain?: string;
	bgCard?: string;
	bgFooter?: string;
	bgOutside?: string | null;
	wrapAlign?: string;
	wrapText?: string;
	h1TextRight?: number;
	baselineH1?: number;
	addr?: {
		text: string;
		rect: Rect;
		fs: string;
		fw: string;
		lh: string;
		color: string;
		textLeft: number;
	};
	baselineAddr?: number;
};

/** 건물 상세 화면의 헤더, 제목, 컬럼, 배경을 측정함. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function measure(): BuildingMeasure {
	const text = (node: Node | null | undefined) =>
		(node?.textContent ?? "").trim();
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const visAll = (sel: string) =>
		[...document.querySelectorAll<HTMLElement>(sel)].filter(vis);
	const R = (e: Element): Rect => {
		const r = e.getBoundingClientRect();
		return { x: r.x, y: r.y, w: r.width, h: r.height, r: r.right, b: r.bottom };
	};
	const effBg = (e: Element) => {
		for (let n: Element | null = e; n; n = n.parentElement) {
			const c = getComputedStyle(n).backgroundColor;
			if (c !== "rgba(0, 0, 0, 0)" && c !== "transparent") return c;
		}
		return "transparent";
	};
	const bgAt = (x: number, y: number) => {
		const e = document.elementFromPoint(x, y);
		return e ? effBg(e) : "n/a";
	};
	const baselineOf = (el: Element) => {
		const s = document.createElement("span");
		s.style.cssText =
			"display:inline-block;width:0;height:0;vertical-align:baseline";
		el.appendChild(s);
		const b = s.getBoundingClientRect().bottom;
		s.remove();
		return b;
	};
	const textRect = (el: Element) => {
		const rg = document.createRange();
		rg.selectNodeContents(el);
		return rg.getBoundingClientRect();
	};

	const doc = document.documentElement;
	const probe = document.createElement("div");
	probe.style.background = "var(--jipsee-color-bg-brand-tint)";
	document.body.appendChild(probe);
	const tint = getComputedStyle(probe).backgroundColor;
	probe.remove();
	const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);

	const header = visAll("header")[0];
	const main = document.querySelector("main");
	const footer = visAll("footer")[0];

	const out: BuildingMeasure = {
		vw: doc.clientWidth,
		vh: window.innerHeight,
		scrollW: doc.scrollWidth,
		scrollH: doc.scrollHeight,
		title: document.title,
		bodyText: document.body.innerText,
		tint,
		bodyBg: getComputedStyle(document.body).backgroundColor,
		dupIds: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
		mainCount: document.querySelectorAll("main").length,
		headerCount: visAll("header").length,
		footerCount: visAll("footer").length,
		logoVisible: visAll('a[aria-label="집씨 홈"]').length,
		loginVisible: visAll("a, button").filter(
			(e) => !!header?.contains(e) && text(e) === "로그인",
		).length,
		myInfoVisible: visAll("a, button").filter(
			(e) => !!header?.contains(e) && text(e) === "내 정보",
		).length,
		h1s: visAll("h1").map((h) => {
			const c = getComputedStyle(h);
			return {
				text: text(h),
				rect: R(h),
				fs: c.fontSize,
				fw: c.fontWeight,
				lh: c.lineHeight,
				color: c.color,
				inHeader: !!header && header.contains(h),
				inMain: !!main && main.contains(h),
			};
		}),
		backs: visAll('button[aria-label="뒤로 가기"]').map((b) => {
			const c = getComputedStyle(b);
			return {
				rect: R(b),
				bg: c.backgroundColor,
				radius: c.borderRadius,
				tabIndex: (b as HTMLButtonElement).tabIndex,
			};
		}),
	};

	if (header) {
		out.header = R(header);
		out.headerText = header.innerText.trim();
		let best: { b: number; w: number; color: string } | null = null;
		for (const e of [header, ...header.querySelectorAll("*")]) {
			const c = getComputedStyle(e);
			if (parseFloat(c.borderBottomWidth) > 0 && vis(e)) {
				const b = e.getBoundingClientRect().bottom;
				if (!best || b > best.b) {
					best = {
						b,
						w: parseFloat(c.borderBottomWidth),
						color: c.borderBottomColor,
					};
				}
			}
		}
		out.headerBorder = best;
	}
	if (footer) out.footer = R(footer);
	if (main) out.main = R(main);

	let col: Element | null = main ? main.parentElement : null;
	while (
		col &&
		!(header && footer && col.contains(header) && col.contains(footer))
	) {
		col = col.parentElement;
	}
	if (col) {
		const c = getComputedStyle(col);
		out.column = R(col);
		out.columnBorders = [
			c.borderTopWidth,
			c.borderRightWidth,
			c.borderBottomWidth,
			c.borderLeftWidth,
		];
		out.columnShadow = c.boxShadow;
	}

	if (col && out.column && out.header && out.main && header && main && footer) {
		const xr = out.column.x + out.column.w - 8;
		out.bgHeader = bgAt(xr, out.header.y + out.header.h / 2);
		out.bgMain = bgAt(xr, out.main.y + 10);
		// 1279 이하에서 main은 카드라 오른쪽 여백의 bgMain과 다름
		out.bgCard = effBg(main);
		// 본문이 뷰포트보다 길면 푸터가 화면 밖이라 elementFromPoint가 null이므로 요소에서 직접 읽음
		out.bgFooter = effBg(footer);
		out.bgOutside = out.column.x > 12 ? bgAt(5, out.main.y + 10) : null;
	}

	// 데스크톱 제목 줄: 본문(main) 안 h1과 같은 부모 안의 주소
	const dh1 = visAll("main h1")[0];
	if (dh1?.parentElement) {
		const wrap = dh1.parentElement;
		let addr: Element | undefined = [...wrap.children].find(
			(e) => e !== dh1 && vis(e) && text(e),
		);
		// 주소를 감싼 요소가 있으면 글자를 가진 가장 안쪽 요소를 측정함
		while (addr && addr.children.length === 1) addr = addr.children[0];
		out.wrapAlign = getComputedStyle(wrap).alignItems;
		out.wrapText = wrap.innerText.trim();
		out.h1TextRight = textRect(dh1).right;
		out.baselineH1 = baselineOf(dh1);
		if (addr) {
			const c = getComputedStyle(addr);
			out.addr = {
				text: text(addr),
				rect: R(addr),
				fs: c.fontSize,
				fw: c.fontWeight,
				lh: c.lineHeight,
				color: c.color,
				textLeft: textRect(addr).left,
			};
			out.baselineAddr = baselineOf(addr);
		}
	}
	return out;
}
