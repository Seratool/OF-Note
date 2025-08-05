/**
 * aside (doc-chooser and menu panel) manager
 */
class Aside
{
    #btnAside = JSE.q("button.aside-menu");
    #btnMenu = JSE.q("button.burger-menu");
    #asideNav = JSE.q("nav.docs-navigation");
    #asideMenu = JSE.q("aside.setting");

    constructor()
    {
        JSE.ev("click", () => {
            this.#btnAside.classList.toggle("open");
            this.#asideNav.classList.toggle("open");
        }, this.#btnAside);
        JSE.ev("click", () => {
            this.#btnMenu.classList.toggle("open");
            this.#asideMenu.classList.toggle("open");
        }, this.#btnMenu);
    }
}
