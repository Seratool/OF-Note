class Pwa
{
    #installPrompt = null;

    constructor(aside) {
        this.instBtn = JSE.q('.bottom-part .install-btn', aside);

        window.addEventListener("beforeinstallprompt", (ev) => {
            // ev.preventDefault();
            this.#installPrompt = ev;
            this.instBtn.classList.remove('hidden');
        });

        this.instBtn.addEventListener("click", async () => {
            if (this.#installPrompt) {
                await this.#installPrompt.prompt();
                this.disableInAppInstallPrompt();
            }
        });
    }

    disableInAppInstallPrompt() {
        this.#installPrompt = null;
        this.instBtn.classList.add('hidden');
    }
}