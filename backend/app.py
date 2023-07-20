from flask import Flask, request
from flask_restful import Resource, Api
from flask import jsonify
from flask_cors import CORS, cross_origin

from firebase import firebase

import requests

import random
import math
import csv

db_url = 'https://pulmocoach-a3593-default-rtdb.asia-southeast1.firebasedatabase.app/'#TODO
fdb = firebase.FirebaseApplication(db_url, None)

labels = {}

with open('label.csv', newline='') as csvfile:

    rows = csv.reader(csvfile)

    for row in rows:
        if row[0] == 'File Name':
            continue
        labels[row[0]] = {'gender' : row[2], 'abnormality' :False, 'symptom' : {}}

with open('image_labels_test.csv', newline='') as csvfile:

    #rows = csv.reader(csvfile)
    rows = list(csv.reader(csvfile, delimiter=','))

    for row in rows:
        if row[0] == 'image_id':
            continue

        abnormality = False
        
        if row[-1] == '1':
            abnormality = False
        else:
            #print(row[-1])
            abnormality = True

        labels[row[0]]['abnormality'] = abnormality

        for i in range(1, len(row)-1):
            if row[i] == '1':
                labels[row[0]]['symptom'][rows[0][i]] = True
            else:
                labels[row[0]]['symptom'][rows[0][i]] = False

len_labels = len(labels)

normalLabels = {}
abnormalLabels = {}
for k, v in labels.items():
    if v['abnormality'] == False:
        normalLabels[k] = v
    else:
        abnormalLabels[k] = v

app = Flask(__name__)
CORS(app)
api = Api(app)

class Item(Resource):

    def get(self, num):
        label = dict(random.sample(labels.items(), num))
        data = {}
        for v in label:
            data[v] = (fdb.get('/label', v))
        return jsonify(data)

class ItemsList(Resource):

    def get(self):
        users = fdb.get('/label/', None)
        return jsonify(users)
    
class Result(Resource):

    def get(self, uid):
        history = fdb.get('/result/', uid)
        print(history)
        if history is None:
            return {"error": "Data not found."}, 404
        return jsonify(history)

    def post(self, uid):
        data = request.get_json()
        
        Data = fdb.get('/result', uid)
        print(data)
        if Data == None:
            fdb.put('/result', uid, [data])
        else:
            Data += [data]
            fdb.put('/result', uid, Data)

class custom(Resource):

    def post(self):
        request_data = request.get_json()

        symptom = request_data['symptom']
        numQuestion = int(request_data['questionNum'])
        abnormalityRate = int(request_data['abnormalityRate'])
    
        abnormalQuestion = {}
        normalQuestion = {}
        data = {}
        
        for k, v in abnormalLabels.items():
            
            if request_data['gender'] == 'both':
                if v['symptom'][symptom] == True:
                    abnormalQuestion = {k: v}
            elif request_data['gender'] == 'Female':
                if v['gender'] == 'F' and v['symptom'][symptom] == True:
                    abnormalQuestion = {k: v}
            elif request_data['gender'] == 'Male':
                if v['gender'] == 'M' and v['symptom'][symptom] == True:
                    abnormalQuestion = {k: v}

        abnormalQuesNum = min(math.floor(numQuestion * (abnormalityRate * 0.01)), len(abnormalQuestion))
        normalQuesNum = min(numQuestion - math.floor(numQuestion * (abnormalityRate * 0.01)), len(normalLabels))

        if len(abnormalQuestion) > 0:
            abnormalQuestion = dict(random.sample(abnormalQuestion.items(), (abnormalQuesNum)))
        
        normalQuestion = dict(random.sample(normalLabels.items(), (normalQuesNum)))
        label = dict(abnormalQuestion, **normalQuestion)

        for v in label:
            data[v] = (fdb.get('/label', v))

        return jsonify(data)


api.add_resource(Item, '/item/<int:num>')
api.add_resource(ItemsList, '/items')
api.add_resource(Result, '/result/<string:uid>')
api.add_resource(custom, '/custom')

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
