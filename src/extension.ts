
const vscode = acquireVsCodeApi();

const activityFeed = document.getElementById("activityFeed");
const activityCount = document.getElementById("activityCount");
const aiCount = document.getElementById("aiCount");
const testEvent = document.getElementById("testEvent");

function displayEvents(events) {
    activityCount.textContent = events.length;

    aiCount.textContent = events.filter(
        event => event.type === "ai"
    ).length;

    activityFeed.replaceChildren();

    if (events.length === 0) {
        const empty = document.createElement("p");
        empty.className = "empty";
        empty.textContent = "No activity recorded yet.";
        activityFeed.appendChild(empty);
        return;
    }

    events.forEach(event => {
        const entry = document.createElement("div");
        entry.className = "event";

        const title = document.createElement("strong");
        title.textContent = event.description;

        const time = document.createElement("small");
        time.textContent =
            `${event.type.toUpperCase()} · ${
                new Date(event.timestamp).toLocaleTimeString()
            }`;

        entry.append(title, time);
        activityFeed.appendChild(entry);
    });
}

testEvent.addEventListener("click", () => {
    vscode.postMessage({
        type: "record-test-event"
    });
});

window.addEventListener("message", event => {
    if (event.data.type === "activity-updated") {
        displayEvents(event.data.events);
    }
});

vscode.postMessage({
    type: "ready"
});
