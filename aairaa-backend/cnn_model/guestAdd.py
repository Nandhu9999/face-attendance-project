from faceRecogInit import read_img, DFOLDER
import face_recognition
import pickle
import json
import sys
import os

IMAGE_PATH = sys.argv[1]
IMAGE_NAME = sys.argv[2]

if __name__ == "__main__":
	MODEL_PATH = 'GUEST_MODEL.pickle'
	try:
		MODEL = pickle.loads(open(DFOLDER + MODEL_PATH, "rb").read())
		img = read_img(IMAGE_PATH)
		img_enc = face_recognition.face_encodings(img)
		
		MODEL["encodings"].append(img_enc[0])
		MODEL["identities"].append(IMAGE_NAME)

		f = open(DFOLDER + MODEL_PATH, "wb")
		f.write(pickle.dumps(MODEL))
		f.close()
		print(json.dumps({"status": "success"}))
	except:
		os.remove(IMAGE_PATH)
		print(json.dumps({"status": "error", "reason":"face not found"}))