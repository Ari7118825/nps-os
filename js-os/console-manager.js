import { FS } from './fs.js';

export const ConsoleManager = {
    execute: (input) => {
        const [cmd, ...args] = input.trim().split(' ');
        
        switch (cmd) {
            case 'ls':
                return FS.list(args[0] || '/').join('  ');
            case 'mkdir':
                FS.write(`${args[0]}/.keep`, "");
                return `Directory ${args[0]} created.`;
            case 'help':
                return "Available commands: ls, mkdir, help, clear, echo";
            case 'echo':
                return args.join(' ');
            default:
                return `Command not found: ${cmd}`;
        }
    }
};
