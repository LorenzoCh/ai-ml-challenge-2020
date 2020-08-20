from gsa_server import app, model
from flask import make_response, request
from .preprocessing.termExtraction import textExtract
import numpy as np


@app.route('/analysis', methods=['POST'])
def dl_analysis():
    """
    Add NLP model below
    :return: response object:
    [
        {
            result:"acceptable" or "problematic",
            text: "...",
            score: 0.5421
        },
    ...
    ]
    """
    clauses = textExtract(request)
    prediction = model.predict(clauses)
    result = []
    for text, res in zip(clauses, prediction):
        label = 'problematic' if np.argmax(res) else 'acceptable'
        score = round(max(res)*100, 2)
        result.append(
            {
                "result": label,
                "text": text,
                "score": str(score)
            })
    resultJSON = {"results": result}

    return make_response(resultJSON, 200)


@app.route('/retrain', methods=['POST'])
def model_retain():
    data = request.json['data']
    model.retrain(data)

    return make_response('retrain succeed!', 200)


@app.route('/query', methods=['POST'])
def database_query():
    """
    Add database method below
    :return: response object
    """
    return make_response('OK', 200)
