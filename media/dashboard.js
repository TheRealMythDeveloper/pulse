
const activityFeed = document.getElementById("activityFeed");
const activityCount = document.getElementById("activityCount");
const aiCount = document.getElementById("aiCount");
const testEvent = document.getElementById("testEvent");

let events = [];

function recordActivity(type, description) {
    const event = {
        type,
        description,
        timestamp: new Date()
    };

    events.unshift(event);
//online activity but local
    activityCount.textContent = events.length;
    aiCount.textContent = events.filter(
        item => item.type === "ai"
    ).length;

    activityFeed.innerHTML = "";

    events.forEach(item => {
        const entry = document.createElement("div");
        entry.className = "event";

        const title = document.createElement("strong");
        title.textContent = item.description;

        const time = document.createElement("small");
        time.textContent =
            `${item.type.toUpperCase()} · ${item.timestamp.toLocaleTimeString()}`;

        entry.append(title, time);
        activityFeed.appendChild(entry);
    });
}

testEvent.addEventListener("click", () => {
    recordActivity("supporting", "Test development activity");
});
