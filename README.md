# Microsoft-Compatible Link — Obsidian Plugin

Copy or open a shareable [obsid.net](https://obsid.net) link for any note with one click.

[obsid.net](https://obsid.net) wraps Obsidian's `obsidian://` deep-link scheme in a standard `https://` URL so links stay clickable in chat apps, emails, and anywhere that strips custom URI schemes.

---

## Features

- **Copy obsid.net link** — copies a shareable URL straight to your clipboard
- **Open via obsid.net** — opens the current note through the obsid.net redirect (useful for testing shared links)
- **Command Palette** — both actions available via `Ctrl/Cmd + P`
- **Ribbon icon** — one-click access from the sidebar (toggleable)
- **Settings** — choose what the ribbon icon does (copy vs. open)

## How it works

Given a vault named `MyVault` and a note at `Projects/Ideas.md`, the plugin generates:

```
https://obsid.net/?vault=MyVault&file=Projects%2FIdeas
```

Opening that URL in any browser redirects to:

```
obsidian://open?vault=MyVault&file=Projects%2FIdeas
```

…which opens the note directly in Obsidian. All conversion happens in the browser; [no data is sent to any server](https://obsid.net/#faq).

---

## Installation

### From the Obsidian Community Plugins browser (recommended)

1. Open **Settings → Community plugins → Browse**
2. Search for **obsid.net Link**
3. Click **Install**, then **Enable**

### Manual installation

1. Download `main.js` and `manifest.json` from the [latest release](../../releases/latest)
2. Create a folder `.obsidian/plugins/obsid-link/` inside your vault
3. Copy the two files into that folder
4. Reload Obsidian and enable the plugin under **Settings → Community plugins**

---

## Usage

| Action | How to trigger |
|--------|---------------|
| Copy obsid.net link | Command Palette → *Copy obsid.net link for current note* |
| Open via obsid.net | Command Palette → *Open current note via obsid.net* |
| Ribbon icon | Click the 🔗 icon in the left sidebar |

The ribbon icon action (copy vs. open) is configurable under **Settings → obsid.net Link**.

---

## Development

```bash
# Clone into your vault's plugins folder for live testing
git clone https://github.com/yourusername/obsidian-obsid-link \
  /path/to/vault/.obsidian/plugins/obsid-link

cd /path/to/vault/.obsidian/plugins/obsid-link
npm install
npm run dev       # watch mode — recompiles on save
```

Reload Obsidian after each build (or use the **Hot Reload** community plugin).

### Releasing a new version

1. Update `minAppVersion` in `manifest.json` if the minimum Obsidian version changed
2. Run `npm version patch` (or `minor` / `major`) — this bumps `manifest.json`, `package.json`, and `versions.json` automatically
3. Commit and push, then push the tag:
   ```bash
   git push && git push --tags
   ```
4. GitHub Actions builds the plugin and creates a release with the required assets attached

---

## Contributing

Pull requests and issues are welcome. Please open an issue before starting significant work so we can discuss the approach.

---

## Credits

This plugin is a thin Obsidian wrapper around **[obsid.net](https://obsid.net)**, built and maintained by [Joost de Valk](https://github.com/jdevalk) (founder of Yoast). All the actual link-conversion and redirect logic is his work — the source is at [github.com/jdevalk/obsid.net](https://github.com/jdevalk/obsid.net).

This plugin simply brings that service into Obsidian as a native command and ribbon button. If you find obsid.net useful, consider starring his repository.

---

## License

[MIT](LICENSE)
