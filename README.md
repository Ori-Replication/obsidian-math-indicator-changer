# Obsidian Plugin: Math Indicator Changer
## Introduction
This is a simple plugin that can change the $\LaTeX$ style indicator `\( \)` and `\[ \]` to markdown style `$ $` and `$$ $$`. 

It can make the math equations generated by AI display correctly in Obsidian.

## Installation 
Download the latest Release from the release page
unzip the file under `~/.obsidian/plugins/`

## Usage
### Way 1
Open the file that needs to be modified, and press `Ctrl+P` to open the command panel.

Type `Math Indicator Changer` and press `Enter` to execute the command. Then all the patterns of `\( \)` and `\[ \]` will be changed to `$ $` and `$$ $$`.

If you only want to change part of the file, you can select the section that want to change first, then use the command.

A more convenient way is that you can set a Hotkey for this command, you can search for `Change math indicator` in the Hotkeys page.

### Way 2
Click the Dollar icon on the toolbar, it will change the file currently you are focusing on.

## Warnings
Since the plugin is based on regular expressions, it may cause some unexpected results. It will change all `\(`, `\)`, `\[`, `\]` to `$`, `$`, `$$`, `$$` in the file.

## TODOs
~~1. 现在使用全局替换后光标会自动移动到文章最上方, 需要修改代码使得光标不会自动移动~~
~~2. 使用按钮进行替换,如果用户没有手动对文件进行保存,文件会发生丢失,可能需要插件自动保存一下~~

All Fixed!