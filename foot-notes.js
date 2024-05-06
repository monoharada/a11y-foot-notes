class Footnote extends HTMLElement {
	static index = 1;
	static currentSection = "";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() {
		this.initializeIds();
		this.createReferenceLink();
		this.ensureFooterExists();
		this.addDescriptionToFooter();
		Footnote.index++;
	}

	initializeIds() {
		const section = this.closest("section,article");
		if (!section.id) {
			section.id = `section-${Math.random().toString(36).substr(2, 9)}`;
		}
		this.sectionId = section.id;

		// 新しいセクションの場合、インデックスをリセット
		if (Footnote.currentSection !== this.sectionId) {
			Footnote.index = 1;
			Footnote.currentSection = this.sectionId;
		}

		this.refId = `footnotes-ref-${this.sectionId}-${Footnote.index}`;
		this.descriptionId = `footnotes-description-${this.sectionId}-${Footnote.index}`;
	}

	createReferenceLink() {
		const refLink = document.createElement("a");
		refLink.setAttribute("id", this.refId);
		refLink.setAttribute("href", `#${this.descriptionId}`);
		refLink.setAttribute(
			"aria-describedby",
			`footnote-label-${this.sectionId}`,
		);
		refLink.setAttribute("part", "footnote");
		refLink.innerHTML = `${this.textContent}<sup>※${Footnote.index}</sup>`;
		this.parentNode.insertBefore(refLink, this.nextSibling);
	}

	ensureFooterExists() {
		const section = this.closest("section,article");
		let footer = section.querySelector("footer");
		if (!footer) {
			footer = document.createElement("footer");
			const heading = section.querySelector("h1, h2, h3, h4, h5, h6");
			const footerHeadingLevel = heading
				? Number.parseInt(heading.tagName[1]) + 1
				: 2;
			const footerHeadingTag =
				footerHeadingLevel > 6 ? "h6" : `h${footerHeadingLevel}`;
			const label = document.createElement(footerHeadingTag);
			label.setAttribute("class", "visually-hidden");
			label.setAttribute("id", `footnote-label-${this.sectionId}`);
			label.textContent = "注釈";
			footer.appendChild(label);
			section.appendChild(footer);
		}
		this.footer = footer;
	}

	addDescriptionToFooter() {
		let ol = this.footer.querySelector("ol");
		if (!ol) {
			ol = document.createElement("ol");
			this.footer.appendChild(ol);
		}

		const descriptionItem = document.createElement("li");
		descriptionItem.setAttribute("id", this.descriptionId);
		descriptionItem.textContent = this.getAttribute("description");

		const backLink = document.createElement("a");
		backLink.setAttribute("href", `#${this.refId}`);
		backLink.setAttribute("aria-label", "コンテンツに戻る");
		backLink.textContent = "↩";
		descriptionItem.appendChild(backLink);

		ol.appendChild(descriptionItem);
	}
}

customElements.define("foot-note", Footnote);
