from flask import Flask, request, jsonify
from transformers import pipeline
import fitz  # PyMuPDF
import math

app = Flask(__name__)

classifier = pipeline("text-classification", model="distilbert-base-uncased", tokenizer="distilbert-base-uncased", framework="pt", max_length=512)

temas = [
    "Politica","Deportes","Religion","Otros"
]
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

def classify_text_segments(text, max_segment_length=512):
    num_segments = math.ceil(len(text) / max_segment_length)
    segment_results = []

    for i in range(num_segments):
        start_idx = i * max_segment_length
        end_idx = min((i + 1) * max_segment_length, len(text))
        segment_text = text[start_idx:end_idx]
        segment_results.append(classifier(segment_text))

    merged_results = []
    for results in segment_results:
        for result in results:
            merged_results.append(result)

    return merged_results

def get_normalized_topics_from_pdf(pdf_path):
    text = extract_text_from_pdf(pdf_path)
    results = classify_text_segments(text)
    
    topic_percentages = {}
    total_score = sum(result['score'] for result in results)
    for i, tema in enumerate(temas):
        if i < len(results):
            score = results[i]['score']
            if score != 0.0:
                percentage = round((score / total_score) * 100, 2)
                topic_percentages[tema] = percentage
    
    return topic_percentages

@app.route('/procesar_pdf', methods=['POST'])
def procesar_pdf():
    try:
        if 'pdf_file' not in request.files:
            return jsonify({'error': 'No se ha proporcionado un archivo PDF'}), 400
        
        pdf_file = request.files['pdf_file']
        pdf_path = 'temp.pdf'
        pdf_file.save(pdf_path)
        
        print('Archivo PDF recibido correctamente:', pdf_path)  # Registro de la recepción del archivo
        
        topic_percentages = get_normalized_topics_from_pdf(pdf_path)
        print('Porcentajes de temas calculados:', topic_percentages)  # Registro de los porcentajes calculados
        
        return jsonify(topic_percentages)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/procesar_texto', methods=['POST'])
def procesar_texto():
    try:
        if 'texto' not in request.json:
            return jsonify({'error': 'No se ha proporcionado el texto'}), 400
        
        texto_recibido = request.json['texto']
        print('Texto recibido:', texto_recibido)  
        topic_percentages = get_normalized_topics_from_pdf(texto_recibido)
        return jsonify({'texto_procesado',topic_percentages})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
