from flask import Flask
import json
import os
import zipfile

app = Flask("Sentiment Analyzer")

sia = None
lexicon = {}

try:
    from nltk.sentiment import SentimentIntensityAnalyzer
    sia = SentimentIntensityAnalyzer()
except Exception:
    sia = None

if sia is None:
    current_dir = os.path.dirname(os.path.abspath(__file__))
    zip_path = os.path.join(current_dir, "sentiment", "vader_lexicon.zip")
    if os.path.exists(zip_path):
        with zipfile.ZipFile(zip_path) as z:
            with z.open("vader_lexicon/vader_lexicon.txt") as f:
                for line in f.read().decode("utf-8").splitlines():
                    if line.strip():
                        parts = line.split("\t")
                        if len(parts) >= 2:
                            lexicon[parts[0]] = float(parts[1])


@app.get('/')
def home():
    return (
        "Welcome to the Sentiment Analyzer. "
        "Use /analyze/text to get the sentiment"
    )


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    if sia is not None:
        scores = sia.polarity_scores(input_txt)
        pos = float(scores['pos'])
        neg = float(scores['neg'])
        neu = float(scores['neu'])
        res = "positive"
        if neg > pos and neg > neu:
            res = "negative"
        elif neu > neg and neu > pos:
            res = "neutral"
    else:
        words = input_txt.lower().split()
        total = sum(lexicon.get(w, 0.0) for w in words)
        if total > 0.05:
            res = "positive"
        elif total < -0.05:
            res = "negative"
        else:
            res = "neutral"

    res_json = json.dumps({"sentiment": res})
    print(res_json)
    return res_json


if __name__ == "__main__":
    app.run(debug=True, port=5050)
