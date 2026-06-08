import {
	App,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
	TFile,
} from "obsidian";

interface ObsidLinkSettings {
	action: "copy" | "open";
	showRibbonIcon: boolean;
}

const DEFAULT_SETTINGS: ObsidLinkSettings = {
	action: "copy",
	showRibbonIcon: true,
};

export default class ObsidLinkPlugin extends Plugin {
	settings: ObsidLinkSettings;
	ribbonIconEl: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new ObsidLinkSettingTab(this.app, this));

		this.addCommand({
			id: "copy-link",
			name: "Copy obsid.net link for current note",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file) return false;
				if (!checking) {
					void this.handleLink(file, "copy");
				}
				return true;
			},
		});

		this.addCommand({
			id: "open-link",
			name: "Open current note via obsid.net",
			checkCallback: (checking: boolean) => {
				const file = this.app.workspace.getActiveFile();
				if (!file) return false;
				if (!checking) {
					void this.handleLink(file, "open");
				}
				return true;
			},
		});

		this.updateRibbonIcon();
	}

	onunload() {
		// Obsidian handles ribbon icon cleanup
	}

	updateRibbonIcon() {
		if (this.ribbonIconEl) {
			this.ribbonIconEl.remove();
			this.ribbonIconEl = null;
		}

		if (this.settings.showRibbonIcon) {
			this.ribbonIconEl = this.addRibbonIcon(
				"link",
				"Copy obsid.net link",
				() => {
					const file = this.app.workspace.getActiveFile();
					if (!file) {
						new Notice("No active note open.");
						return;
					}
					void this.handleLink(file, this.settings.action);
				}
			);
		}
	}

	buildObsidUrl(file: TFile): string {
		const vault = encodeURIComponent(this.app.vault.getName());
		// Strip .md extension to match Obsidian's own deep-link convention
		const filePath = file.path.replace(/\.md$/, "");
		const encodedFile = encodeURIComponent(filePath);
		return `https://obsid.net/?vault=${vault}&file=${encodedFile}`;
	}

	async handleLink(file: TFile, action: "copy" | "open") {
		const url = this.buildObsidUrl(file);

		if (action === "copy") {
			await navigator.clipboard.writeText(url);
			new Notice("obsid.net link copied to clipboard!");
		} else {
			window.open(url, "_blank");
			new Notice("Opening note via obsid.net…");
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class ObsidLinkSettingTab extends PluginSettingTab {
	plugin: ObsidLinkPlugin;

	constructor(app: App, plugin: ObsidLinkPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Ribbon button action")
			.setDesc("What the ribbon icon does when clicked.")
			.addDropdown((drop) =>
				drop
					.addOption("copy", "Copy link to clipboard")
					.addOption("open", "Open note via obsid.net")
					.setValue(this.plugin.settings.action)
					.onChange(async (value: string) => {
						this.plugin.settings.action = value as "copy" | "open";
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Show ribbon icon")
			.setDesc("Display the obsid.net link icon in the left sidebar.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.showRibbonIcon)
					.onChange(async (value) => {
						this.plugin.settings.showRibbonIcon = value;
						await this.plugin.saveSettings();
						this.plugin.updateRibbonIcon();
					})
			);
	}
}
