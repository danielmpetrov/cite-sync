# Cite Sync

![GitHub](https://img.shields.io/github/license/danielmpetrov/cite-sync)
![Feedback](https://img.shields.io/badge/Feedback-Welcome-green)

> *Copyright 2019 Daniel Petrov*

## Features
This Microsoft Word add-in analyses a word document that is using the author-year method of citation in order to find any discrepencies between the in-text citations and references.
- Automatic detection of missing references.
- Automatic detection of references that were never cited.

## Prerequisites
- Microsoft Word 2016 or newer

## Installation
- Cite Sync is under development and not yet published in [AppSource](https://appsource.microsoft.com/)

## Local development
1. Make sure you have Nodejs installed
2. Clone this repository locally.
    ```bash
    git clone https://github.com/danielmpetrov/cite-sync.git
    ```
3. Run the following shell commands
    ```bash
    cd cite-sync
    npm run start
    ```
    This will start a local dev-server on port 3000, and open Microsoft Word with Cite Sync preloaded.

This project was scaffolded using the [Yeoman generator for Office Add-ins](https://github.com/OfficeDev/generator-office) to generate the [Office-Addin-TaskPane](https://github.com/OfficeDev/Office-Addin-TaskPane) template. Go through their README to learn more.
