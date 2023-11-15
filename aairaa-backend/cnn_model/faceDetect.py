from faceRecogInit import read_img, DFOLDER
import face_recognition
import pickle
import json
import sys
import os

if __name__ == "__main__":
	
	UNKNOWN_IMAGE = sys.argv[1]
	MODEL = pickle.loads(open(DFOLDER + 'MODEL.pickle', "rb").read())
	
	img = read_img(UNKNOWN_IMAGE)
	os.remove(UNKNOWN_IMAGE)
	img_enc = face_recognition.face_encodings(img)
	
	if len(img_enc):
		RESULTS = face_recognition.compare_faces(MODEL["encodings"], img_enc[0])

		if True not in RESULTS:
			print(json.dumps({"found": False, "results":RESULTS, "identities":MODEL["identities"]}))
		else:
			idx = RESULTS.index(True)
			PREDICTIONS = face_recognition.face_distance(MODEL["encodings"], img_enc[0])
			print(json.dumps({"found": True, "identity":MODEL["identities"][idx]}))
	else:

		print(json.dumps({"found": False, "reason": "no face"}))