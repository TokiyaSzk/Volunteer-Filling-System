import { app, BrowserWindow } from "electron";

app.on("ready", () => {
    const mainWinddow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            webSecurity:false,
        }
    })

    mainWinddow.loadURL("http://localhost:3000");
});