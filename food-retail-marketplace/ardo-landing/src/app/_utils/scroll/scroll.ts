export const smoothScroll = (id: string) => {
    const target = document.getElementById(id);
    const start = document.documentElement.scrollTop;
    const finish = (target?.offsetTop || 0) - 58;
    const change = finish - start;
    const startDate = +new Date();
    const duration = 50;

    function easeInOutQuad(t: any, b: any, c: any, d: any) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    function animateScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
        const currentDate = +new Date();
        const currentTime = currentDate - startDate;
        const val = parseInt(easeInOutQuad(currentTime, start, change, duration));
        document.documentElement.scrollTop = val;
        if (currentTime < duration) {
            requestAnimationFrame(animateScroll);
        } else {
            document.documentElement.scrollTop = finish;
        }
    }

    animateScroll();
}
