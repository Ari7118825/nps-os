// A simple wrapper for localStorage to act as a File System
export const FS = {
    read: (path) => JSON.parse(localStorage.getItem(`root${path}`)) || "File not found",
    write: (path, content) => localStorage.setItem(`root${path}`, JSON.stringify(content)),
    list: (dir) => {
        // Logic to filter keys starting with dir
        return Object.keys(localStorage).filter(k => k.startsWith(`root${dir}`));
    }
};
