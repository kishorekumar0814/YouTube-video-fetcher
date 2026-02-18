async function fetchVideo() {
    const url = document.getElementById("youtubeUrl").value;
    const result = document.getElementById("result");
    const error = document.getElementById("error");
    const btn = document.getElementById("fetchBtn");
    const text = btn.querySelector(".btn-text");
    const spinner = btn.querySelector(".spinner");

    error.innerText = "";
    result.classList.add("hidden");

    if (!url) {
        error.innerText = "Please enter a YouTube URL";
        return;
    }

    // Show loading
    btn.disabled = true;
    text.innerText = "Fetching...";
    spinner.classList.remove("hidden");

    try {
        const res = await fetch("/fetch", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        });

        const data = await res.json();

        if (!data.success) {
            error.innerText = "Unable to fetch video details";
        } else {
            document.getElementById("title").innerText = data.data.title;
            document.getElementById("channel").innerText =
                "Channel: " + data.data.channel;
            document.getElementById("thumbnail").src = data.data.thumbnail;
            document.getElementById("videoLink").href = data.data.video_url;

            result.classList.remove("hidden");
        }

    } catch {
        error.innerText = "Server error!";
    }

    // Reset button
    btn.disabled = false;
    text.innerText = "Fetch Video";
    spinner.classList.add("hidden");
}


/* 🌗 Theme Toggle */
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("themeBtn");

    body.classList.toggle("light");

    if (body.classList.contains("light")) {
        localStorage.setItem("theme", "light");
        btn.innerText = "☀️";
    } else {
        localStorage.setItem("theme", "dark");
        btn.innerText = "🌙";
    }
}

/* Load saved theme */
window.onload = () => {
    const saved = localStorage.getItem("theme");
    const btn = document.getElementById("themeBtn");

    if (saved === "light") {
        document.body.classList.add("light");
        btn.innerText = "☀️";
    }
};


let deferredPrompt;

window.addEventListener("beforeinstallprompt", e => {
    e.preventDefault();
    deferredPrompt = e;

    const installBtn = document.createElement("button");
    installBtn.innerText = "Install App";
    installBtn.className = "fetch-btn";
    document.querySelector(".container").appendChild(installBtn);

    installBtn.addEventListener("click", () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
            installBtn.remove();
            deferredPrompt = null;
        });
    });
});
