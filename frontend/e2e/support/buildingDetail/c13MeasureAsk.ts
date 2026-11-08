export type AskRect = {
	x: number;
	y: number;
	w: number;
	h: number;
	r: number;
	b: number;
};

export type AskMeasure = {
	vw: number;
	vh: number;
	scrollW: number;
	scrollH: number;
	sy: number;
	dupIds: string[];
	sectionsInDom: number;
	hiddenSections: number;
	visibleLinks: number;
	myInfoVisible: number;
	aside?: AskRect;
	asideScroll?: { sh: number; ch: number; oy: string; st: number };
	footer?: AskRect;
	lastFooterLink?: AskRect & { text: string };
	info?: AskRect;
	dealHist?: AskRect;
	visibleCount?: number;
	sec?: AskRect & {
		inAside: boolean;
		firstInAside: boolean;
		pos: string;
		bottomCss: string;
		bg: string;
		bw: string;
		bc: string;
		radius: string;
		pad: string;
		shadow: string;
		gap: string;
		dir: string;
		label: string | null;
	};
	btn?: AskRect & {
		tag: string;
		href: string | null;
		target: string | null;
		bg: string;
		radius: string;
		color: string;
		gap: string;
		ai: string;
		jc: string;
		text: string;
		tr: AskRect;
		fs: string;
		fw: string;
		tcolor: string;
	};
	btnIcon?: AskRect & {
		color: string;
		d: string;
		ariaHidden: string | null;
	};
	guide?:
		| (AskRect & {
				jc: string;
				ai: string;
				gap: string;
				text: string;
				tr: AskRect;
				fs: string;
				lh: string;
				fw: string;
				color: string;
				icon: AskRect & { color: string; d: string; ariaHidden: string | null };
		  })
		| null;
	guideCount?: number;
};

/** 질문하기 영역 측정. 보이는 영역(모바일 바 또는 데스크톱 카드)과 주변 요소를 모음. 페이지 안에서 실행하므로 외부 변수를 쓰지 않음 */
export function c13MeasureAsk(): AskMeasure {
	const vis = (e: Element | null | undefined) =>
		!!e &&
		e.getClientRects().length > 0 &&
		getComputedStyle(e).visibility !== "hidden";
	const toRect = (r: DOMRect): AskRect => ({
		x: r.x,
		y: r.y,
		w: r.width,
		h: r.height,
		r: r.right,
		b: r.bottom,
	});
	const R = (e: Element) => toRect(e.getBoundingClientRect());
	const TR = (n: Node) => {
		const g = document.createRange();
		g.selectNodeContents(n);
		return toRect(g.getBoundingClientRect());
	};
	const firstText = (root: Element) => {
		const wk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
		while (wk.nextNode()) {
			if ((wk.currentNode.textContent ?? "").trim()) return wk.currentNode;
		}
		return null;
	};
	const text = (n: Node | null | undefined) => (n?.textContent ?? "").trim();
	const shapeOf = (svg: Element) => [
		...svg.querySelectorAll("path,rect,circle"),
	];
	const out: AskMeasure = {
		vw: document.documentElement.clientWidth,
		vh: window.innerHeight,
		scrollW: document.documentElement.scrollWidth,
		scrollH: document.documentElement.scrollHeight,
		sy: window.scrollY,
		dupIds: [],
		sectionsInDom: 0,
		hiddenSections: 0,
		visibleLinks: 0,
		myInfoVisible: 0,
	};
	const ids = [...document.querySelectorAll("[id]")].map((e) => e.id);
	out.dupIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
	const all = [...document.querySelectorAll('section[aria-label="질문하기"]')];
	out.sectionsInDom = all.length;
	out.hiddenSections = all.filter((s) => !vis(s)).length;
	out.visibleLinks = [...document.querySelectorAll("a")].filter(
		(a) => vis(a) && text(a) === "이 건물에 대해 질문하기",
	).length;
	out.myInfoVisible = [...document.querySelectorAll("a, button")].filter(
		(e) => vis(e) && text(e) === "내 정보",
	).length;
	const aside = [...document.querySelectorAll("aside")].find(vis);
	if (aside) {
		out.aside = R(aside);
		const ac = getComputedStyle(aside);
		out.asideScroll = {
			sh: aside.scrollHeight,
			ch: aside.clientHeight,
			oy: ac.overflowY,
			st: aside.scrollTop,
		};
	}
	const footer = [...document.querySelectorAll("footer")].find(vis);
	if (footer) {
		out.footer = R(footer);
		const links = [...footer.querySelectorAll("a")].filter(vis);
		const last = links[links.length - 1];
		if (last) out.lastFooterLink = { text: text(last), ...R(last) };
	}
	const info = [...document.querySelectorAll("section")]
		.filter(vis)
		.find((s) => text(s.querySelector("h2")) === "건물 정보");
	if (info) out.info = R(info);
	const dh = [...document.querySelectorAll("h2")].find(
		(e) => vis(e) && (e.textContent ?? "").includes("거래 이력"),
	);
	const dhSection = dh?.closest("section");
	if (dhSection) out.dealHist = R(dhSection);
	const shown = all.filter(vis);
	out.visibleCount = shown.length;
	const sec = shown[0];
	if (!sec) return out;
	const cs = getComputedStyle(sec);
	out.sec = {
		...R(sec),
		inAside: !!sec.closest("aside"),
		firstInAside:
			!!aside &&
			!!aside.firstElementChild &&
			aside.firstElementChild.firstElementChild === sec,
		pos: cs.position,
		bottomCss: cs.bottom,
		bg: cs.backgroundColor,
		bw: [
			cs.borderTopWidth,
			cs.borderRightWidth,
			cs.borderBottomWidth,
			cs.borderLeftWidth,
		].join(" "),
		bc: cs.borderTopColor,
		radius: cs.borderTopLeftRadius,
		pad: [
			cs.paddingTop,
			cs.paddingRight,
			cs.paddingBottom,
			cs.paddingLeft,
		].join(" "),
		shadow: cs.boxShadow,
		gap: cs.rowGap,
		dir: cs.flexDirection,
		label: sec.getAttribute("aria-label"),
	};
	const btn = [...sec.querySelectorAll("a, button")].find((e) =>
		(e.textContent ?? "").includes("질문하기"),
	);
	if (btn) {
		const bs = getComputedStyle(btn);
		const tn = firstText(btn);
		if (tn) {
			const tp = getComputedStyle(tn.parentElement as Element);
			out.btn = {
				tag: btn.tagName,
				href: btn.getAttribute("href"),
				target: btn.getAttribute("target"),
				...R(btn),
				bg: bs.backgroundColor,
				radius: bs.borderTopLeftRadius,
				color: bs.color,
				gap: bs.columnGap,
				ai: bs.alignItems,
				jc: bs.justifyContent,
				text: text(tn),
				tr: TR(tn),
				fs: tp.fontSize,
				fw: tp.fontWeight,
				tcolor: tp.color,
			};
		}
		const svg = btn.querySelector("svg");
		if (svg) {
			out.btnIcon = {
				...R(svg),
				color: getComputedStyle(svg).color,
				d: shapeOf(svg)
					.map((e) => e.getAttribute("d") || "")
					.join("|"),
				ariaHidden: svg.getAttribute("aria-hidden"),
			};
		}
	}
	const gp = [...sec.querySelectorAll("div, p")].find(
		(e) =>
			!(btn?.contains(e) ?? false) &&
			e.querySelector("svg") &&
			/누르면/.test(e.textContent ?? ""),
	);
	out.guide = null;
	if (gp) {
		const g = getComputedStyle(gp);
		const gt = firstText(gp);
		const gs = gp.querySelector("svg");
		if (gt && gs) {
			const gtp = getComputedStyle(gt.parentElement as Element);
			out.guide = {
				...R(gp),
				jc: g.justifyContent,
				ai: g.alignItems,
				gap: g.columnGap,
				text: text(gt),
				tr: TR(gt),
				fs: gtp.fontSize,
				lh: gtp.lineHeight,
				fw: gtp.fontWeight,
				color: gtp.color,
				icon: {
					...R(gs),
					color: getComputedStyle(gs).color,
					d: shapeOf(gs)
						.map((e) => e.getAttribute("d") || e.getAttribute("width") || "")
						.join("|"),
					ariaHidden: gs.getAttribute("aria-hidden"),
				},
			};
		}
	}
	out.guideCount = [...sec.querySelectorAll("*")].filter(
		(e) => e.children.length === 0 && /누르면 로그인/.test(e.textContent ?? ""),
	).length;
	return out;
}
