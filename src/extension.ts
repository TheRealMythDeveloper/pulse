
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
    const openDashboard = vscode.commands.registerCommand(
        "pulse.openDashboard",
        () => {
            const panel = vscode.window.createWebviewPanel(
                "pulseDashboard",
                "Pulse",
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    localResourceRoots: [
                        vscode.Uri.joinPath(context.extensionUri, "media")
                    ]
                }
            );

            panel.webview.html = getDashboardHTML(panel.webview, context.extensionUri);
        }
    );

    context.subscriptions.push(openDashboard);
}

function getDashboardHTML(
    webview: vscode.Webview,
    extensionUri: vscode.Uri
) {
    const scriptUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "media", "dashboard.js")
    );

    const styleUri = webview.asWebviewUri(
        vscode.Uri.joinPath(extensionUri, "media", "dashboard.css")
    );

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="${styleUri}" rel="stylesheet">
    <title>Pulse</title>
</head>
<body>
    <div id="app">
        <header>
            <div class="logo">PULSE<span>.</span></div>
            <div class="status"><span class="status-dot"></span> TRACKING READY</div>
        </header>

        <main>
            <section class="welcome">
                <p class="eyebrow">YOUR DEVELOPMENT ACTIVITY</p>
                <h1>Make every<br>minute <span>count.</span></h1>
                <p class="subtitle">Your AI development journey, measured.</p>
            </section>

            <section class="stats">
                <div class="stat-card">
                    <p>TODAY'S ACTIVITY</p>
                    <h2 id="activityCount">0</h2>
                    <span>Recorded events</span>
                </div>
                <div class="stat-card">
                    <p>AI INTERACTIONS</p>
                    <h2 id="aiCount">0</h2>
                    <span>Detected interactions</span>
                </div>
            </section>

            <section class="activity">
                <div class="section-heading">
                    <h2>Activity feed</h2>
                    <span>LIVE</span>
                </div>
                <div id="activityFeed" class="feed">
                    <p class="empty">No activity recorded yet.</p>
                </div>
            </section>

            <button id="testEvent">+ Record test activity</button>
        </main>

        <footer> PULSE v0.1.0 · YOUR WORK, YOUR DATA </footer>
    </div>

    <script src="${scriptUri}"></script>
</body>
</html>`;
}

export function deactivate() {}
