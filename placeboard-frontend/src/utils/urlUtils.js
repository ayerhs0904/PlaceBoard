export const isValidUrl = (urlStr) => {
    try {
        new URL(urlStr);
        return true;
    } catch (err) {
        return false;
    }
};

export const normalizeUrl = (urlStr) => {
    if (!urlStr) return urlStr;
    const trimmed = urlStr.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
        return `https://${trimmed}`;
    }
    return trimmed;
};
