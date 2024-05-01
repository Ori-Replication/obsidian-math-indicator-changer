import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Platform } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default'
}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;

	async onload() {
		console.log('loading plugin')
		await this.loadSettings();

		// // This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon('dollar-sign', 'Sample Plugin', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			let activeLeaf = this.app.workspace.getActiveFile();
			if (activeLeaf) {
				const vault = this.app.vault;
				try {
					// 使用 await 等待 Promise 解决
					let content = await vault.cachedRead(activeLeaf);
					// 现在 content 是一个 string，可以进行操作
					content = this.replaceAllParenthesesBrackets(content);
					// 接下来，你可能需要将修改后的内容写回文件或进行其他操作
					try {
						await vault.modify(activeLeaf, content);
					}
					catch (error) {
						new Notice('Math Indicator: Error updating file: ' + error);
					}
				} catch (error) {
					new Notice('Math Indicator: Error reading file: ' + error);
				}
			}
		});
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// // This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'change-math-indicator',
			name: 'Change math indicator',
			editorCallback: (editor: Editor) => {
				const selectedText = editor.getSelection();
				if (selectedText.length === 0) {
					new Notice('Math Indicator: No text selected, changing the whole file');
					const selectedText = editor.getValue();
					editor.setValue(this.replaceAllParenthesesBrackets(selectedText));
					return;
				}
				editor.replaceSelection(this.replaceAllParenthesesBrackets(selectedText));
				return;
			}
		});
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// // Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });


		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	replaceLeftParentheses(text: string): string {
		return text.replace(/\\\([ \t]*/g, '$');
	}

	replaceRightParentheses(text: string): string {
		return text.replace(/[ \t]*\\\)/g, '$')
	}

	replaceLeftBrackets(text: string): string {
		return text.replace(/\\\[[ \t]*/g, '$$$$');
	}

	replaceRightBrackets(text: string): string {
		return text.replace(/[ \t]*\\\]/g, '$$$$')
	}

	replaceAllParenthesesBrackets(text: string): string {
		let newText = this.replaceLeftParentheses(text);
		newText = this.replaceRightParentheses(newText);
		newText = this.replaceLeftBrackets(newText);
		newText = this.replaceRightBrackets(newText);
		return newText;
	}



	onunload() {
		console.log('unloading plugin')
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;

	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Setting #1')
			.setDesc('It\'s a secret')
			.addText(text => text
				.setPlaceholder('Enter your secret')
				.setValue(this.plugin.settings.mySetting)
				.onChange(async (value) => {
					this.plugin.settings.mySetting = value;
					await this.plugin.saveSettings();
				}));
	}
}
