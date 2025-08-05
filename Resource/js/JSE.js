/**
 * JSE - Java Script Extension library
 */
class JSE
{
    /**
     * document.querySelector('#id').
     *
     * @param {string} el
     * @param {HTMLElement} pr
     * @returns {HTMLAnchorElement | HTMLElement | HTMLAreaElement | HTMLAudioElement | HTMLBaseElement | HTMLQuoteElement | HTMLBodyElement | HTMLBRElement | HTMLButtonElement | HTMLCanvasElement | HTMLTableCaptionElement | HTMLTableColElement | HTMLDataElement | HTMLDataListElement | HTMLModElement | HTMLDetailsElement | HTMLDialogElement | HTMLDivElement | HTMLDListElement | HTMLEmbedElement | HTMLFieldSetElement | HTMLFormElement | HTMLHeadingElement | HTMLHeadElement | HTMLHRElement | HTMLHtmlElement | HTMLIFrameElement | HTMLImageElement | HTMLInputElement | HTMLLabelElement | HTMLLegendElement | HTMLLIElement | HTMLLinkElement | HTMLMapElement | HTMLMenuElement | HTMLMetaElement | HTMLMeterElement | HTMLObjectElement | HTMLOListElement | HTMLOptGroupElement | HTMLOptionElement | HTMLOutputElement | HTMLParagraphElement | HTMLPictureElement | HTMLPreElement | HTMLProgressElement | HTMLScriptElement | HTMLSelectElement | HTMLSlotElement | HTMLSourceElement | HTMLSpanElement | HTMLStyleElement | HTMLTableElement | HTMLTableSectionElement | HTMLTableCellElement | HTMLTemplateElement | HTMLTextAreaElement | HTMLTimeElement | HTMLTitleElement | HTMLTableRowElement | HTMLTrackElement | HTMLUListElement | HTMLVideoElement}
     */
    static q(el, pr = document) {
        return pr ? pr.querySelector(el) : null;
    }

    /**
     * document.querySelectorAll('.class').
     *
     * @param {string} el
     * @param {HTMLElement} pr
     * @returns {NodeListOf<HTMLElementTagNameMap[keyof HTMLElementTagNameMap]>}
     */
    static qs(el, pr = document) {
        return pr ? pr.querySelectorAll(el) : null;
    }

    /**
     * button.addEventListener('click', (e) => {return e;}).
     *
     * @param {string} ev
     * @param {function} fn
     * @param {HTMLElement} pr
     */
    static ev(ev, fn, pr = document) {
        JSE.filter(ev.split(" "))
            .forEach(e => pr.addEventListener(e, fn));
    }

    /**
     * on DOM 'load' after 'ready'.
     *
     * @param {function} cb
     */
    static load(cb) {
        document.readyState !== "complete" ? window.addEventListener("load", cb) : cb();
    }

    /**
     * convert string to HTMLElement
     *
     * @param {string} node
     * @returns {NodeListOf<ChildNode>}
     */
    static ston(node) {
        const el = document.createElement("div");
        el.innerHTML = node.trim();

        return el.childNodes;
    }

    /**
     * filter all empty values from array.
     * @param {array} ar
     * @returns {array}
     */
    static filter(ar) {
        return ar.filter((i)=> {
            return (i === null || i === undefined)
                ? false
                : ((typeof i === "object" && Object.keys(i).length < 1) ? false : !!i);
        });
    }

    /**
     * on DOM 'ready' before 'load'.
     *
     * @param {function} cb
     */
    static ready(cb) {
        document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", cb) : cb();
    }
}
