import { h } from 'https://esm.sh/preact';
import { useState } from 'https://esm.sh/preact/hooks';
import htm from 'https://esm.sh/htm';
import { ConsoleManager } from '../../../js-os/console-manager.js';

const html = htm.bind(h);

export default function Console() {
    const [history, setHistory] = useState(['JS-OS Terminal v1.0', 'Type "help" for commands']);
    
    const handleInput = (e) => {
        if (e.key === 'Enter') {
            const result = ConsoleManager.execute(e.target.value);
            setHistory([...history, `> ${e.target.value}`, result]);
            e.target.value = '';
        }
    };

    return html`
        <div class="console-wrapper" style="background: #000; color: #0f0; height: 100%; padding: 10px; font-family: monospace;">
            <div class="output">${history.map(line => html`<div>${line}</div>`)}</div>
            <input onKeyDown=${handleInput} autoFocus style="background:transparent; border:none; color:#0f0; outline:none; width:100%;" />
        </div>
    `;
}
