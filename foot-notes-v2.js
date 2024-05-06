function generateHash() {
	return Math.random().toString(36).substring(2, 10);
}

function createAndAppend(elementType, parent, attributes = {}) {
	const element = document.createElement(elementType);
	for (const [key, value] of Object.entries(attributes)) {
		if (key === "textContent") {
			element.textContent = value;
		} else {
			element.setAttribute(key, value);
		}
	}
	parent.appendChild(element);
	return element;
}

function addFootnotes(sectionElement) {
	const hash = sectionElement.id || generateHash();
	let footnoteList = sectionElement.querySelector("ol[data-footnote='list']");
	if (!footnoteList) {
		footnoteList = createAndAppend("ol", sectionElement, {
			"data-footnote": "list",
		});
	}
	// 既存のリストまたは新しく作成したリストに対して属性を設定
	footnoteList.setAttribute("aria-label", "注釈");
	footnoteList.id = `footnote-list-${hash}`;

	const footnoteRefs = sectionElement.querySelectorAll(
		"sup[data-footnote='ref']",
	);
	for (const ref of footnoteRefs) {
		const index = Array.from(footnoteRefs).indexOf(ref);
		const footnoteId = `footnote-ref-${hash}-${index + 1}`;
		const link = createAndAppend("a", ref.parentNode, {
			// 修正: null を ref.parentNode に変更
			id: footnoteId,
			href: `#footnote-item-${hash}-${index + 1}`,
			"aria-describedby": `footnote-list-${hash}`,
		});
		ref.parentNode.replaceChild(link, ref);
		link.appendChild(ref);
	}

	const footnoteItems = sectionElement.querySelectorAll(
		"ol[data-footnote='list'] li",
	);
	for (const item of footnoteItems) {
		const index = Array.from(footnoteItems).indexOf(item);
		createAndAppend("a", item, {
			href: `#footnote-ref-${hash}-${index + 1}`,
			"aria-label": "コンテンツへ戻る",
			textContent: "↩",
		});
		item.id = `footnote-item-${hash}-${index + 1}`;
	}
}

const sections = document.querySelectorAll(
	"section:has([data-footnote]), article:has([data-footnote])",
);
for (const sectionElement of sections) {
	addFootnotes(sectionElement);
}
