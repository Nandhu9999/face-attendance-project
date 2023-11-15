import face_recognition
import pickle
import cv2
import os

DFOLDER = os.getcwd() + "/cnn_model/"

def read_img(path):
	img = cv2.imread(path)
	(h,w) = img.shape[:2]
	width = 256
	ratio = width / float(w)
	height = int(h * ratio)
	return cv2.resize(img, (width,height))

if __name__ == "__main__":
	print()

	KNOWN_ENCODINGS = []
	KNOWN_IDENTIIES = []
	KNOWN_DIR = "face-images"
	
	for file in os.listdir(DFOLDER + KNOWN_DIR):
		img = read_img(DFOLDER + KNOWN_DIR + "/" + file)
		print(file, end="")
		img_enc = face_recognition.face_encodings(img)
		if len(img_enc) == 0:
			print(" face not found")
			continue
		KNOWN_ENCODINGS.append(img_enc[0])
		KNOWN_IDENTIIES.append(file.rsplit('.', 1)[0])
		print()
	
	MODEL = {"encodings": KNOWN_ENCODINGS, "identities": KNOWN_IDENTIIES}
	f = open(DFOLDER + 'MODEL.pickle', "wb")
	f.write(pickle.dumps(MODEL))
	f.close()
	
	KNOWN_ENCODINGS = []
	KNOWN_IDENTIIES = []
	KNOWN_DIR = "guest-images"
	
	for file in os.listdir(DFOLDER + KNOWN_DIR):
		img = read_img(DFOLDER + KNOWN_DIR + "/" + file)
		img_enc = face_recognition.face_encodings(img)
		if len(img_enc) == 0:
			print(file,"face not found")
			continue
		print(file, "[👍]")
		KNOWN_ENCODINGS.append(img_enc[0])
		KNOWN_IDENTIIES.append(file.rsplit('.', 1)[0])
		print()

	GUEST_MODEL = {"encodings": KNOWN_ENCODINGS, "identities": KNOWN_IDENTIIES}
	f = open(DFOLDER + 'GUEST_MODEL.pickle', "wb")
	f.write(pickle.dumps(GUEST_MODEL))
	f.close()
	
