from flask import Flask, request, render_template
import numpy as np
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model

app = Flask(__name__)

def load_image(img_path, target_size=(224, 224)):
    img = image.load_img(img_path, target_size=target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.
    return img_array

def predict_eye_disease(model, img_array):
    predictions = model.predict(img_array)
    class_names = ['Cataracts', 'DiabeticRetinopathy', 'Glaucoma', 'Hypertension', 'Normal', 'Retinoblastoma']
    predicted_class_index = np.argmax(predictions)
    predicted_class_name = class_names[predicted_class_index]
    predicted_score = predictions[0][predicted_class_index]
    return predicted_class_name, predicted_score

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/process_image', methods=['POST'])
def process_image():
    try:
        model = load_model('eye_disease_detector.h5')
        img = request.files['image']
        img_path = './uploaded_image.jpg'
        img.save(img_path)
        print("Uploaded image saved at:", img_path)
        img_array = load_image(img_path)
        print("Loaded image array shape:", img_array.shape)
        predicted_class, predicted_score = predict_eye_disease(model, img_array)
        result = f"Prediction: {predicted_class} ({predicted_score:.2f})"
        return result
    except Exception as e:
        return str(e)

if __name__ == '__main__':
    app.run(debug=True)
