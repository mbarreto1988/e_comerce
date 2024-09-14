function showLoader() {
    const loader = document.getElementById('loader');
    const body = document.querySelector('body');
    loader.innerHTML = `
        <svg height="108px" width="108px" viewBox="0 0 128 128" class="loader">
            <defs>
                <clipPath id="loader-eyes">
                    <circle transform="rotate(-40,64,64) translate(0,-56)" r="8" cy="64" cx="64" class="loader__eye1"></circle>
                    <circle transform="rotate(40,64,64) translate(0,-56)" r="8" cy="64" cx="64" class="loader__eye2"></circle>
                </clipPath>
                <linearGradient y2="1" x2="0" y1="0" x1="0" id="loader-grad">
                    <stop stop-color="#000" offset="0%"></stop>
                    <stop stop-color="#fff" offset="100%"></stop>
                </linearGradient>
                <mask id="loader-mask">
                    <rect fill="url(#loader-grad)" height="128" width="128" y="0" x="0"></rect>
                </mask>
            </defs>
            <g stroke-dasharray="175.93 351.86" stroke-width="12" stroke-linecap="round">
                <g>
                    <rect clip-path="url(#loader-eyes)" height="64" width="128" fill="hsl(193,90%,50%)"></rect>
                    <g stroke="hsl(193,90%,50%)" fill="none">
                        <circle transform="rotate(180,64,64)" r="56" cy="64" cx="64" class="loader__mouth1"></circle>
                        <circle transform="rotate(0,64,64)" r="56" cy="64" cx="64" class="loader__mouth2"></circle>
                    </g>
                </g>
                <g mask="url(#loader-mask)">
                    <rect clip-path="url(#loader-eyes)" height="64" width="128" fill="hsl(223,90%,50%)"></rect>
                    <g stroke="hsl(223,90%,50%)" fill="none">
                        <circle transform="rotate(180,64,64)" r="56" cy="64" cx="64" class="loader__mouth1"></circle>
                        <circle transform="rotate(0,64,64)" r="56" cy="64" cx="64" class="loader__mouth2"></circle>
                    </g>
                </g>
            </g>
        </svg>
    `;
    loader.style.display = 'block';
    loader.style.position = 'fixed';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.zIndex = '9999';
    loader.style.backgroundColor = 'rgba(44, 53, 236, 0.8)';
    loader.style.padding = '20px';
    loader.style.borderRadius = '10px';
    body.classList.add('body-blur');
}


function hideLoader() {
    const loader = document.getElementById('loader');
    const body = document.querySelector('body');
    loader.style.display = 'none';
    body.classList.remove('body-blur');
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = e.target.closest('a').href;
            if (href && href !== "#") {
                showLoader();
                setTimeout(() => {
                    window.location.href = href;
                    hideLoader();
                }, 3000);
            }
        });
    });
});