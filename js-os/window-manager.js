import { h } from 'https://esm.sh/preact';
import htm from 'https://esm.sh/htm';

const html = htm.bind(h);

export default function WindowManager({ title, children, onClose }) {
    return html`
        <div class="window">
            <div class="window-header">
                <span>${title}</span>
                <button onClick=${onClose}>X</button>
            </div>
            <div class="window-content">
                ${children}
            </div>
        </div>
    `;
}
