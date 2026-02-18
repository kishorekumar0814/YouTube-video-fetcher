from flask import Flask, render_template, request, jsonify
from yt_dlp import YoutubeDL

app = Flask(__name__)
app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/fetch", methods=["POST"])
def fetch_video():
    data = request.get_json()
    url = data.get("url")

    try:
        ydl_opts = {
            "quiet": True,
            "skip_download": True
        }

        with YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)

        return jsonify({
            "success": True,
            "data": {
                "title": info.get("title"),
                "channel": info.get("uploader"),
                "thumbnail": info.get("thumbnail"),
                "video_url": info.get("webpage_url")
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)
