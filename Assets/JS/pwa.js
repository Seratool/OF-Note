class Pwa
{
    #installPrompt = null;

    constructor(aside) {
        this.instBtn = JSE.q('.setting-block .install-btn', aside);

        window.addEventListener("beforeinstallprompt", async (ev) => {
            const relatedApps = await navigator.getInstalledRelatedApps();
            // Search for a specific installed platform-specific app
            const psApp = relatedApps.find((app) => app.id === "com.example.myapp");

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