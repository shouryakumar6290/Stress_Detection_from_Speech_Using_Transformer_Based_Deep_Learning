# 🎙️ Stress Detection from Speech Using Transformer-Based Deep Learning

<div align="center">

# 🧠 AI-Powered Speech Stress Detection

### Detecting Human Stress Levels from Speech Using Transformer-Based Deep Learning

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![PyTorch](https://img.shields.io/badge/PyTorch-DeepLearning-red)
![Transformers](https://img.shields.io/badge/HuggingFace-Transformers-yellow)
![Wav2Vec2](https://img.shields.io/badge/Wav2Vec2-SpeechAI-green)
![Accuracy](https://img.shields.io/badge/Accuracy-78.57%25-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

### 🎙️ Speech AI • Deep Learning • Mental Health Technology

**Built with ❤️ using Wav2Vec2, PyTorch, and Transformers**

</div>

---

# 📌 Overview

Stress is a significant factor affecting human health and well-being. Prolonged stress may lead to various physical and psychological disorders.

Speech signals contain acoustic characteristics that change under stressful conditions. Therefore, automatic stress detection from speech has gained considerable attention in recent years.

This project presents a **Transformer-Based Speech Stress Detection System** using **Wav2Vec2**, a state-of-the-art speech representation model developed by Facebook AI Research.

The system analyzes speech recordings and automatically classifies them into:

* 😟 **STRESSED**
* 😌 **UNSTRESSED**

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

✅ Transformer-Based Speech Classification

✅ Transfer Learning with Wav2Vec2

✅ Audio Preprocessing Pipeline

✅ Data Augmentation Techniques

✅ Automatic Stress Prediction

✅ Performance Evaluation

✅ Visualization of Training Performance

✅ Real-Time Prediction Ready

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
Speech Dataset
       ↓
Audio Loading
       ↓
Preprocessing
       ↓
Train-Test Split
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

The dataset consists of speech recordings labeled into two categories:

### Labels

```python
STRESSED = 1
UNSTRESSED = 0
```

### Train-Test Split

```text
Training Set : 80%
Testing Set  : 20%
```

Stratified sampling was used to maintain equal class distribution.

---

# 🎵 Audio Preprocessing

All speech recordings undergo the following preprocessing steps:

* Audio loading using Librosa
* Resampling to 16 kHz
* Label mapping to numerical values
* File path creation
* Removal of invalid or inaccessible files

---

# 🔥 Data Augmentation

To improve model generalization and increase the number of training samples, several augmentation techniques were applied only to the training dataset.

## Gaussian Noise Addition

Small random noise was added to the signal to increase robustness.

## Time Shifting

The waveform was shifted slightly in time.

## Pitch Shifting

The pitch of the speech signal was altered without affecting duration.

### Important

Testing data remained completely unchanged to avoid data leakage and ensure unbiased evaluation.

---

# 🧠 Feature Extraction

Feature extraction was performed using the pre-trained Wav2Vec2 processor.

### Base Model

```python
facebook/wav2vec2-base
```

### Sampling Frequency

```text
16 kHz
```

---

# 🏗️ Deep Learning Architecture

The project employed:

```python
Wav2Vec2ForSequenceClassification
```

Transfer learning was utilized by freezing the feature encoder to reduce computational complexity.

---

# ⚙️ Training Parameters

| Parameter            | Value      |
| -------------------- | ---------- |
| Learning Rate        | 1 × 10⁻⁶   |
| Batch Size           | 8          |
| Epochs               | 15         |
| Weight Decay         | 0.01       |
| Optimizer            | AdamW      |
| Evaluation Strategy  | Epoch-wise |
| Best Model Selection | Enabled    |

---

# 📈 Performance Metrics

The model was evaluated using:

* Accuracy
* Precision
* Recall
* F1 Score
* Validation Loss
* Confusion Matrix

---

# 📊 Results

## Final Performance

| Metric          | Score  |
| --------------- | ------ |
| Validation Loss | 0.4901 |
| Accuracy        | 78.57% |
| Precision       | 73.53% |
| Recall          | 89.29% |
| F1 Score        | 80.65% |

---

# 📉 Visualization

### 📈 Training Loss Curve

Illustrates the convergence behavior of the model during training.

### 🔲 Confusion Matrix

Visualizes correct and incorrect classifications.

### 📊 Performance Bar Graph

Comparison among Accuracy, Precision, Recall, and F1 Score.

---

# 📂 Project Structure

```text
Stress-Detection-From-Speech/
│
├── 📁 backend/
│   └── Backend APIs and inference logic
│
├── 📁 final_model/
│   └── Fine-tuned Wav2Vec2 model files
│
├── 📁 frontend/
│   └── User Interface and frontend components
│
├── 📄 Dockerfile
│   └── Docker configuration for deployment
│
├── 📄 README.md
│   └── Project documentation
│
├── 📄 local_server.js
│   └── Local server implementation
│
├── 📄 package.json
│   └── Node.js project configuration
│
├── 📄 package-lock.json
│   └── Dependency lock file
│
└── 📄 stress_detection_from_speech_using_transformer.py
    └── Transformer-based stress detection model
```

---

# ✅ Advantages

* Transformer-Based Deep Learning Architecture
* Transfer Learning with Wav2Vec2
* Minimal Handcrafted Feature Engineering
* Robustness through Data Augmentation
* Automatic Stress Detection from Speech
* Efficient Speech Representation Learning

---

# ⚠️ Limitations

* Performance depends on dataset quality and size.
* Computationally intensive compared to traditional machine learning methods.
* Real-world noisy environments may affect accuracy.

---

# 🔮 Future Scope

* Increasing dataset size.
* Fine-tuning more layers of Wav2Vec2.
* Applying additional augmentation techniques.
* Using larger Transformer models.
* Developing a web application for real-time stress detection.
* Deploying the model on mobile devices.
* Incorporating multilingual speech datasets.

---

# 💡 Applications

🏥 Mental Health Monitoring

🏢 Employee Wellness Programs

🎓 Educational Stress Analysis

📱 Mobile Health Applications

🎙️ Voice-Based AI Systems

🌐 Remote Psychological Assessment

---

# 🏁 Conclusion

This project successfully implemented a speech-based stress detection system using the Transformer-based Wav2Vec2 architecture.

Transfer learning and audio augmentation techniques enabled effective learning from speech signals.

### Final Achievements

| Metric    | Value  |
| --------- | ------ |
| Accuracy  | 78.57% |
| Precision | 73.53% |
| Recall    | 89.29% |
| F1 Score  | 80.65% |

The obtained results demonstrate that Transformer-based models can serve as a promising approach for automatic stress detection and can be further extended for real-time healthcare and mental well-being applications.

---

# 📚 References

1. Baevski, A., Zhou, H., Mohamed, A., and Auli, M. (2020).
   *wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations.*

2. Paszke, A. et al. (2019).
   *PyTorch: An Imperative Style, High-Performance Deep Learning Library.*

3. Wolf, T. et al. (2020).
   *Transformers: State-of-the-Art Natural Language Processing.*

4. McFee, B. et al. (2015).
   *Librosa: Audio and Music Signal Analysis in Python.*

5. Pedregosa, F. et al. (2011).
   *Scikit-learn: Machine Learning in Python.*

---

# 👨‍💻 Author

## Shourya Kumar

### Stress Detection from Speech Using Transformer-Based Deep Learning

⭐ If you found this project useful, consider giving it a star on GitHub.

---

<div align="center">

## 🌟 Thank You For Visiting 🌟

### 🎙️ Speech AI • Deep Learning • Healthcare Technology

</div>
