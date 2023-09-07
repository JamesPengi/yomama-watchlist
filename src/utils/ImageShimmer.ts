const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#172132" offset="20%" />
      <stop stop-color="#172135" offset="50%" />
      <stop stop-color="#172132" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#172132" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="2s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) => {
  return typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);
};

export { shimmer, toBase64 };
