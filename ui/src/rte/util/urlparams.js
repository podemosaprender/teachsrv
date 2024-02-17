export function paramsFromURL() {
	return new URLSearchParams(location.search || location.hash)
}
