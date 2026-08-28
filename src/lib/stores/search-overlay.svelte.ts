class SearchOverlayState {
	open = $state(false);
	scroller = $state<HTMLElement | null>(null);

	registerScroller = (el: HTMLElement | null) => {
		this.scroller = el;
	};

	openSearch = () => {
		this.open = true;
	};

	closeSearch = () => {
		this.open = false;
	};

	toggleSearch = () => {
		this.open = !this.open;
	};
}

export const searchOverlay = new SearchOverlayState();
