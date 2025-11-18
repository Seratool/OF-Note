class Pwa
{
    #installPrompt = null;

    constructor(aside) {
        const appId = JSE.q('body').dataset.id;

        this.instBtn = JSE.q('.setting-block .install-btn', aside);

        window.addEventListener("beforeinstallprompt", async (ev) => {
            const relatedApps = await navigator.getInstalledRelatedApps(),
                psApp = relatedApps.find((app) => app.id === appId);

            if (psApp) {
                ev.preventDefault();
            } else {
                // ev.preventDefault();
                this.#installPrompt = ev;
                this.instBtn.classList.remove('hidden');
            }
        });

        this.instBtn.addEventListener("click", async () => {
            if (this.#installPrompt) {
                await this.#installPrompt.prompt();
                this.disableInAppInstallPrompt();
            }
        });
        window.addEventListener("appinstalled", () => {
            this.disableInAppInstallPrompt();
        });
    }

    disableInAppInstallPrompt() {
        this.#installPrompt = null;
        this.instBtn.classList.add('hidden');
    }
}