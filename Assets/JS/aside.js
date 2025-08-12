/**
 * aside (doc-chooser and menu panel) manager
 */
class Aside
{
    #btnAside = JSE.q('button.aside-menu');
    #btnMenu = JSE.q('button.burger-menu');
    #asideNav = JSE.q('nav.docs-navigation');
    #asideMenu = JSE.q('aside.setting');
    #btnPrint = JSE.q('button.print-btn', this.#asideMenu);
    #btnShare = JSE.q('button.share-btn', this.#asideMenu);

    initialise()
    {
        JSE.ev('click', () => {
            this.#btnAside.classList.toggle('open');
            this.#asideNav.classList.toggle('open');
        }, this.#btnAside);

        JSE.ev('click', () => {
            this.#btnMenu.classList.toggle('open');
            this.#asideMenu.classList.toggle('open');
        }, this.#btnMenu);

        JSE.ev('click', () => print(), this.#btnPrint);

        if (navigator.canShare) {
            this.#btnShare.classList.remove('hidden');
            JSE.ev('click', () => this.#pageShare(), this.#btnShare);
        }
    }

    #pageShare()
    {
        if (navigator.canShare) {
            navigator
                .share({title:document.title,url:window.location.href})
                .then(()=>console.log('Share was successful.'))
                .catch((error)=>console.log('Sharing failed',error));
        }
    }





}
