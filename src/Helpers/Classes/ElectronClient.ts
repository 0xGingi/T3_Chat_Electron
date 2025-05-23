//Imports
import { app, BrowserWindow } from "electron";

//Setup the Main Class
export class ElectronClient {
	//
	//Setup the Public Properties
	requestedURL: string;
	mainWindow: Electron.BrowserWindow | null;
	app: Electron.App;

	//Setup the Constructor
	constructor(Requested_URL: string) {
		//
		//Update the Public Properties
		this.requestedURL = Requested_URL;
		this.mainWindow = null;
		this.app = app;

		//Set up Wayland support for Linux
		if (process.platform === 'linux') {
			if (!process.env.ELECTRON_OZONE_PLATFORM_HINT) {
				process.env.ELECTRON_OZONE_PLATFORM_HINT = 'auto';
			}
		}

		//Listen for Events on the Electron Client
		this.app.on("window-all-closed", this.appClosedHandler.bind(this));
		this.app.on("ready", this.readyHandler.bind(this));
	}

	//Handles the event of app fully closed
	private appClosedHandler() {
		//
		//Check if the Platform is Invalid and quit the App
		if (process.platform !== "darwin") this.app.quit();
	}

	//Handles the event when the Window is Closed
	private windowClosedHandler() {
		//
		//Clear the Main Window
		this.mainWindow = null;
	}

	//Handles the Event when the App is Ready
	private readyHandler() {
		//
		//Setup window options with Linux/Wayland optimizations
		const windowOptions: Electron.BrowserWindowConstructorOptions = {
			width: 1280,
			height: 720,
			webPreferences: {
				nodeIntegration: false,
				contextIsolation: true,
				webSecurity: true
			},
			show: false,
			icon: process.platform === 'linux' ? 'icons/icon.png' : undefined
		};

		//Setup the New Main Window
		this.mainWindow = new BrowserWindow(windowOptions);

		//Remove the Default Menu Bar
		this.mainWindow.removeMenu();

		//Show window when ready to prevent visual flash
		this.mainWindow.once('ready-to-show', () => {
			this.mainWindow?.show();
		});

		//Load the Requested URL on the Main Window
		this.mainWindow.loadURL(this.requestedURL);

		//Listen for Window Closed Events
		this.mainWindow.on("closed", this.windowClosedHandler.bind(this));
	}
}
