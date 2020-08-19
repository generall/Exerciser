from flask import Flask, request, jsonify, send_from_directory
from exerciser import STATIC_PATH, DATA_PATH
import re
import os
from pathlib import Path

app = Flask(__name__, static_url_path=STATIC_PATH)
import sqlite3

from itertools import chain

import random

data_path = Path(DATA_PATH)
texts_db_path = os.environ.get("TEXT_DB", data_path / "simple_wiki.sqlite")

class Controller:

    def __init__(self):
        self.sql_file = texts_db_path

    def search(self, words, limit=10):
        conn = sqlite3.connect(str(self.sql_file))
        cur = conn.cursor()

        query = """
        select abstract from texts where abstract match ? and length(abstract) > 10 and length(abstract) < 150 ORDER BY random() limit ?;
        """
        cur.execute(query, (' '.join(words), limit))

        return cur.fetchall()

ctl = Controller()


@app.route("/generate")
def generate():

    query = request.args.get('q')
    limit = int(request.args.get('limit', 10))
    words = re.split(r'\W', query)

    result = {}
    for word in words:
        sents = list(map(lambda x: x[0], ctl.search([word], limit)))

        result[word] = sents

    words = list(result.keys())

    sents = list(chain(*list(result.values())))
    
    sents_with_words = []

    for sent in sents:
        regex = re.compile(r'\b({})\b'.format("|".join(words)), re.IGNORECASE)
        found_words = re.findall(regex, sent)
        sents_with_words.append({
            "text": re.split('(___)', re.sub(regex, '___', sent)),
            "words": found_words
        })

    random.shuffle(sents_with_words)

    return jsonify({
        'words': words,
        "sents": sents_with_words
    })


@app.route('/')
def index():
    return send_from_directory(STATIC_PATH, 'index.html')


@app.route('/<path:path>')
def static_file(path):
    if path == '':
        path = 'index.html'
    return send_from_directory(STATIC_PATH, path)
