# 🎙️ Transformer-Based Speech Stress Detection Using Wav2Vec2

<div align="center">

# 🧠 AI-Powered Speech Stress Detection

### Detecting Stress from Human Speech using Transformer-Based Deep Learning

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-DeepLearning-red)
![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-yellow)
![Wav2Vec2](https://img.shields.io/badge/Wav2Vec2-SpeechAI-green)
![Accuracy](https://img.shields.io/badge/Accuracy-92.41%25-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 📌 Overview

Mental stress is one of the major factors affecting human health, productivity, and overall well-being. Traditional stress assessment methods often rely on questionnaires, interviews, and clinical observations, which can be subjective and time-consuming.

This project presents a **Transformer-Based Speech Stress Detection System** using **Wav2Vec2**, a state-of-the-art speech representation model developed by Facebook AI Research.

The system analyzes speech recordings and automatically classifies them into:

* 😟 **STRESSED**
* 😌 **UNSTRESSED**

By leveraging transformer architectures and speech signal processing, the model achieves highly accurate stress detection directly from raw audio recordings.

---

# 🎯 Objectives

* Develop an automated speech-based stress detection system.
* Preprocess and analyze speech recordings.
* Utilize Wav2Vec2 Transformer architecture for feature extraction.
* Classify speech samples into STRESSED and UNSTRESSED categories.
* Evaluate performance using standard machine learning metrics.
* Enable future deployment in healthcare and wellness applications.

---

# ✨ Features

✅ Transformer-based speech classification

✅ Wav2Vec2 feature extraction

✅ Audio preprocessing pipeline

✅ Data augmentation techniques

✅ High classification accuracy

✅ Frontend and backend integration

✅ Docker deployment support

✅ Real-time prediction ready

---

# 🏗️ System Architecture

```text
Speech Audio
      │
      ▼
Audio Preprocessing
      │
      ▼
Data Augmentation
      │
      ▼
Wav2Vec2 Processor
      │
      ▼
Transformer Encoder
      │
      ▼
Classification Layer
      │
      ▼
Stress Prediction
(STRESSED / UNSTRESSED)
```

---

# 🔄 Workflow

```text
Audio Collection
       ↓
Metadata Integration
       ↓
Audio Preprocessing
       ↓
Data Augmentation
       ↓
Feature Extraction
       ↓
Model Training
       ↓
Stress Classification
       ↓
Performance Evaluation
       ↓
Frontend Deployment
```

---

# 🛠️ Technologies Used

| Technology                | Purpose                   |
| ------------------------- | ------------------------- |
| Python                    | Programming Language      |
| PyTorch                   | Deep Learning Framework   |
| Hugging Face Transformers | Transformer Models        |
| Wav2Vec2                  | Speech Feature Extraction |
| Librosa                   | Audio Processing          |
| NumPy                     | Numerical Operations      |
| Pandas                    | Data Handling             |
| Scikit-Learn              | Evaluation Metrics        |
| Matplotlib                | Visualization             |
| Seaborn                   | Data Visualization        |
| Google Colab              | Model Training            |
| Docker                    | Containerization          |

---

# 📊 Dataset Information

The dataset consists of speech recordings and corresponding metadata.

## Metadata Fields

```text
FILE_NAME
LANGUAGE
AGE
LOCALITY
CONDITION
STRESS_LEVEL
GENDER
MARITAL_STATUS
OCCUPATION
SLEEP_HOURS
PHYSICAL_ACTIVITY
```

## Dataset Statistics

| Category                | Count |
| ----------------------- | ----- |
| Original Audio Samples  | 280   |
| Augmented Audio Samples | 1120  |
| Classes                 | 2     |

### Labels

```python
STRESSED = 1
UNSTRESSED = 0
```

---

# 🎵 Audio Preprocessing

All speech recordings undergo the following preprocessing steps:

* Audio loading using Librosa
* Resampling to 16 kHz
* Signal normalization
* Format standardization
* Preparation for Wav2Vec2 processing

---

# 🔥 Data Augmentation

To improve model robustness and reduce overfitting, multiple augmentation techniques were applied.

## Noise Injection

Random Gaussian noise added to audio samples.

## Time Shifting

Audio shifted along the time axis.

## Pitch Shifting

Pitch modified while preserving speech content.

### Dataset Expansion

```text
Original Samples   : 280
Augmented Samples  : 1120
```

This increased data diversity significantly and improved model generalization.

---

# 🧠 Model Architecture

## Base Model

```python
Wav2Vec2ForSequenceClassification
```

### Hyperparameters

| Parameter        | Value            |
| ---------------- | ---------------- |
| Number of Labels | 2                |
| Learning Rate    | 3e-6             |
| Epochs           | 12               |
| Batch Size       | 8                |
| Weight Decay     | 0.01             |
| Optimizer        | AdamW            |
| Loss Function    | CrossEntropyLoss |

---

# ⚙️ Training Strategy

```text
Train-Test Split : 80 : 20
Feature Encoder  : Frozen
Optimizer        : AdamW
Loss Function    : Cross Entropy
Epochs           : 12
```

---

# 📈 Results

## Final Performance

| Metric          | Score  |
| --------------- | ------ |
| Accuracy        | 92.41% |
| Precision       | 91.38% |
| Recall          | 93.81% |
| F1 Score        | 92.58% |
| Training Loss   | 0.3431 |
| Validation Loss | 0.2339 |

---

# 📉 Performance Comparison

## Before Data Augmentation

| Metric   | Score  |
| -------- | ------ |
| Accuracy | 85.71% |
| F1 Score | 85.96% |

## After Data Augmentation

| Metric   | Score  |
| -------- | ------ |
| Accuracy | 92.41% |
| F1 Score | 92.58% |

### Improvement

📈 Accuracy Improved by **6.70%**

📈 F1 Score Improved by **6.62%**

---

# 📊 Evaluation Metrics

### Accuracy

Measures overall prediction correctness.

```text
Accuracy = 92.41%
```

### Precision

Measures how many predicted stressed samples were actually stressed.

```text
Precision = 91.38%
```

### Recall

Measures how many actual stressed samples were correctly identified.

```text
Recall = 93.81%
```

### F1 Score

Harmonic mean of Precision and Recall.

```text
F1 Score = 92.58%
```

---

# 📂 Project Structure

```text
Speech-Stress-Detection/
│
├── backend/
│   └── Backend APIs and inference logic
│
├── frontend/
│   └── User Interface
│
├── final_model/
│   └── Fine-tuned Wav2Vec2 model files
│
├── Dockerfile
│
├── README.md
│
├── Stress_Detection_from_Speech_Using_Transformer.py
│   └──  Training code
│
└── stress_detection_from_speech_using_transformer.ipynb
    └── Training notebook
```

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/your-username/Speech-Stress-Detection.git
cd Speech-Stress-Detection
```

## Install Dependencies

```bash
pip install -r requirements.txt
```

## Run Backend

```bash
cd backend
python app.py
```

## Run Frontend

```bash
cd frontend
npm install
npm start
```

---

# 🐳 Docker Deployment

Build Docker Image:

```bash
docker build -t speech-stress-detector .
```

Run Container:

```bash
docker run -p 8000:8000 speech-stress-detector
```

---

# 💡 Applications

🏥 Mental Health Monitoring

🏢 Employee Wellness Programs

🎓 Educational Stress Analysis

📱 Mobile Health Applications

🎙️ Voice-Based AI Systems

🌐 Remote Psychological Assessment

---

# 🔮 Future Scope

* Larger real-world datasets
* Multilingual stress detection
* Mobile application deployment
* Cloud-based prediction APIs
* Real-time stress monitoring
* Stress severity scoring
* Advanced Transformer architectures

---

# 📚 References

1. Baevski, A., Zhou, Y., Mohamed, A., & Auli, M. (2020). *wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations.*

2. Hugging Face Transformers Documentation

3. PyTorch Documentation

4. Librosa Documentation

5. Scikit-Learn Documentation

---

# 👨‍💻 Author

## Shourya Kumar

**Transformer-Based Speech Stress Detection Using Wav2Vec2**

If you found this project useful, consider giving it a ⭐ on GitHub.

---

<div align="center">

### 🎙️ Speech AI • Deep Learning • Mental Health Technology

**Built with ❤️ using Wav2Vec2, PyTorch, and Transformers**

</div>
