
import * as vscode from "vscode";

interface PulseEvent {
    id: string;
    type: string;
    description: string;
    timestamp: string;
}

const STORAGE_KEY = "pulse.activity";

export function activate(context: vscode.ExtensionContext) {
    let dashboard: vscode.WebviewPanel | undefined;
        // Track the files opened in VS Code. (maybe vsdev?)
    const fileOpened = vscode.workspace.onDidOpenTextDocument(document => {
        if (document.uri.scheme !== "file") return;

        recordActivity(context, "supporting", "Opened a file", dashboard);
    });

    // Tracking in saves
    const fileSaved = vscode.workspace.onDidSaveTextDocument(document => {
        if (document.uri.scheme !== "file") return;

        recordActivity(context, "supporting", "Saved a file", dashboard);
    });

    // Track all edits
    const fileEdited = vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.uri.scheme !== "file") return;
        if (event.contentChanges.length === 0) return;

        recordActivity(context, "supporting", "Edited a file", dashboard);
    });

    context.subscriptions.push(fileOpened, fileSaved, fileEdited);
    const openDashboard = vscode.commands.registerCommand(
        "pulse.openDashboard",
        () => {
            dashboard = vscode.window.createWebviewPanel(
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

            dashboard.webview.html = getDashboardHTML(
                dashboard.webview,
                context.extensionUri
            );

            dashboard.webview.onDidReceiveMessage(async message => {
                if (message.type === "ready") {
                    const events = context.globalState.get<PulseEvent[]>(
                        STORAGE_KEY,
                        []
                    );

                    dashboard.webview.postMessage({
                        type: "activity-updated",
                        events
                    });
                }

                if (message.type === "record-test-event") {
                    const events = context.globalState.get<PulseEvent[]>(
                        STORAGE_KEY,
                        []
                    );

                    const newEvent: PulseEvent = {
                        id: Date.now().toString(),
                        type: "supporting",
                        description: "Test development activity",
                        timestamp: new Date().toISOString()
                    };

                    const updatedEvents = [
                        newEvent,
                        ...events
                    ].slice(0, 500);

                    await context.globalState.update(
                        STORAGE_KEY,
                        updatedEvents
                    );

                    dashboard.webview.postMessage({
                        type: "activity-updated",
                        events: updatedEvents
                    });
                }
            });
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
                    <p class="empty">Loading activity...</p>
                </div>
            </section>

            <button id="testEvent">+ Record test activity</button>
        </main>

        <footer>PULSE v0.1.0 · YOUR WORK, YOUR DATA</footer>
    </div>

    <script src="${scriptUri}"></script>
</body>
</html>`;
}
function recordActivity(
    context: vscode.ExtensionContext,
    type: string,
    description: string, 
    dashboard?: vscode.WebviewPanel
) {
    const events = context.globalState.get<PulseEvent[]>(
        STORAGE_KEY,
        []
    );

    const newEvent: PulseEvent = {
        id: Date.now().toString(),
        type,
        description,
        timestamp: new Date().toISOString()
    };

    const updatedEvents = [newEvent, ...events].slice(0, 500);

    context.globalState.update(STORAGE_KEY, updatedEvents).then(() => {
        dashboard?.webview.postMessage({
            type: "activity-updated",
            events: updatedEvents
        });
    });
}
export function deactivate() {}
