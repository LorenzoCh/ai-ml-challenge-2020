"""
Add deep learning code below
"""
import ktrain
from ktrain import text

MODEL_NAME = 'xlnet-base-cased'


class XlnetModel:
    def __init__(self):
        self.predictor = ktrain.load_predictor('gsa_server/resources/xlnet_6epoch_3e-5')
        self.t = text.Transformer(MODEL_NAME, maxlen=500, class_names=[0, 1])

    def predict(self, text):
        result = self.predictor.predict(text, return_proba=True)
        return result

    def score(self, text):
        score_pair = self.predictor.predict(text, return_proba=True)
        confidence_score = [round(max(x)*100, 2) for x in score_pair]
        return confidence_score

    def retrain(self, returned_output):
        x_train = [x['clause'] for x in returned_output]
        y_train = [1 if x['prediction'] == 'Unacceptable' else 0 for x in returned_output]
        model = self.predictor.model
        trn = self.t.preprocess_train(x_train, y_train)
        learner = ktrain.get_learner(model, train_data=trn, batch_size=6)
        learner.fit_onecycle(3e-5, 6)
        self.predictor = ktrain.get_predictor(learner.model, preproc=self.t)
        self.predictor.save('gsa_server/resources/xlnet_6epoch_3e-5')

