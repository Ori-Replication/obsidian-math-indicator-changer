import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, Platform, TFile ,TextFileView} from 'obsidian';
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
		const ribbonIconEl = this.addRibbonIcon('dollar-sign', 'Change Math Indicator', async (evt: MouseEvent) => {
			// Called when the user clicks the icon.
			let activeLeaf = this.app.workspace.getActiveFile();
			if (activeLeaf) {
				const vault = this.app.vault;
				try {

					// 使用 await 等待 Promise 解决
					let fileView: TextFileView | null = this.app.workspace.getActiveViewOfType(TextFileView);
					if (!fileView) {
						new Notice('Math Indicator: No active file view');
						return;
					}
					fileView.save()
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

		ribbonIconEl.addClass('my-plugin-ribbon-class');


		this.addCommand({
			id: 'change-math-indicator',
			name: 'Change math indicator',
			editorCallback: (editor: Editor) => {
				const cursorPos = editor.getCursor();
				const scrollInfo = editor.getScrollInfo();
				const savedScrollTop = scrollInfo.top;

				const selectedText = editor.getSelection();
				let newContent: string;
				if (selectedText.length === 0) {
					new Notice('Math Indicator: No text selected, changing the whole file');
					newContent = this.replaceAllParenthesesBrackets(editor.getValue());
					editor.setValue(newContent);
				} else {
					newContent = this.replaceAllParenthesesBrackets(selectedText);
					editor.replaceSelection(newContent);
				}
				setTimeout(() => {
					// 恢复光标和滚动位置
					editor.setCursor(cursorPos);
					editor.scrollTo(null, savedScrollTop);
				}, 100);
			}
		});



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

