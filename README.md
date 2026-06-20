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

---

### 🎙️ Speech AI • Deep Learning • Mental Health Technology

**Built with ❤️ using Wav2Vec2, PyTorch, and Transformers**

</div>

---

# 📌 Introduction

Stress is one of the major factors affecting human health and well-being. Prolonged stress can lead to various physical and psychological disorders.

Human speech contains acoustic patterns that change under stressful conditions. This project leverages **Transformer-Based Deep Learning** to automatically detect stress from speech recordings.

The proposed system utilizes **Wav2Vec2**, a state-of-the-art speech representation model developed by Facebook AI Research, to classify speech samples into:

* 😟 **STRESSED**
* 😌 **UNSTRESSED**

---

# 🎯 Objectives

* Develop an intelligent speech-based stress detection system.
* Perform preprocessing and analysis of speech recordings.
* Utilize Transformer-based Wav2Vec2 architecture.
* Classify speech into stressed and unstressed categories.
* Evaluate model performance using standard metrics.
* Enable future real-time healthcare applications.

---

# ✨ Features

✅ Transformer-Based Speech Classification

✅ Transfer Learning using Wav2Vec2

✅ Audio Preprocessing Pipeline

✅ Data Augmentation Techniques

✅ High Recall Performance

✅ Automatic Stress Prediction

✅ Performance Visualization

✅ Real-Time Deployment Ready

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

---

# 📊 Dataset Description

The dataset consists of speech recordings labeled into two classes:

### 😟 STRESSED

### 😌 UNSTRESSED

### Label Encoding

```python
STRESSED = 1
UNSTRESSED = 0
```

---

# 🎵 Audio Preprocessing

The following preprocessing steps were performed:

* 🎧 Loading audio files using Librosa
* 🔄 Resampling signals to 16 kHz
* 🔢 Mapping labels into numerical form
* 📁 Creating audio file paths
* 🗑️ Removing invalid or inaccessible files

### Sampling Frequency

```text
16000 Hz
```

---

# 🔀 Train-Test Split

The dataset was divided into:

```text
Training Set : 80%
Testing Set  : 20%
```

Stratified sampling was used to maintain balanced class distributions.

---

# 🔥 Data Augmentation

To improve model generalization and increase data diversity, augmentation techniques were applied only to the training dataset.

## 🎙️ Original Audio

The original speech signal was retained.

## 🌊 Gaussian Noise Addition

Small random noise was added to improve robustness.

## ⏩ Time Shifting

Audio signals were shifted slightly along the time axis.

## 🎼 Pitch Shifting

Pitch was altered without changing speech duration.

### ⚠️ Important

Testing data remained completely unchanged to avoid data leakage and ensure unbiased evaluation.

---

# 🧠 Feature Extraction

Feature extraction was performed using the pre-trained Wav2Vec2 processor.

### Base Model

```python
facebook/wav2vec2-base
```

### Sampling Rate

```text
16 kHz
```

---

# 🏗️ Deep Learning Architecture

The project employed:

```python
Wav2Vec2ForSequenceClassification
```

Transfer learning was utilized by freezing the feature encoder to reduce computational complexity and improve learning efficiency.

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

# 📉 Model Interpretation

### 📈 Accuracy

```text
78.57%
```

Indicates effective classification of stress levels.

### 🎯 Precision

```text
73.53%
```

Shows that most predicted stressed samples were correctly identified.

### 🔍 Recall

```text
89.29%
```

Demonstrates strong ability to detect stressed speech samples.

### ⚖️ F1 Score

```text
80.65%
```

Provides a balanced measure between precision and recall.

---

# 📊 Visualizations

During experimentation, several visualizations were generated:

## 📉 Training Loss Curve

Illustrates convergence behavior during training.

## 🔲 Confusion Matrix

Visualizes correct and incorrect predictions.

## 📊 Performance Comparison Graph

Compares:

* Accuracy
* Precision
* Recall
* F1 Score

---

# ✅ Advantages

* Transformer-Based Architecture
* Transfer Learning using Wav2Vec2
* Minimal Feature Engineering
* Robustness Through Data Augmentation
* Automatic Speech-Based Stress Detection
* Efficient Representation Learning

---

# ⚠️ Limitations

* Performance depends on dataset quality and size.
* Computationally intensive compared to traditional methods.
* Noisy environments may affect accuracy.
* Limited dataset size restricts generalization.

---

# 🔮 Future Scope

Future enhancements may include:

* 📈 Increasing dataset size
* 🔧 Fine-tuning additional layers
* 🎙️ Advanced augmentation techniques
* 🧠 Larger Transformer architectures
* 🌐 Real-time web application deployment
* 📱 Mobile application development
* 🌎 Multilingual speech support

---

# 📂 Project Structure

```text
Stress-Detection-From-Speech/
│
├── dataset/
│
├── final_model/
│   └── Fine-tuned Wav2Vec2 model
│
├── plots/
│   ├── Training Loss Curve
│   ├── Confusion Matrix
│   └── Performance Graphs
│
├── notebooks/
│
├── README.md
│
└── Stress_Detection_from_Speech_Using_Transformer.py
```

---

# 💡 Applications

🏥 Mental Health Monitoring

🏢 Employee Wellness Programs

🎓 Educational Stress Analysis

📱 Smart Healthcare Applications

🎙️ Voice-Based AI Systems

🌐 Remote Psychological Assessment

---

# 🏁 Conclusion

This project successfully implemented a **Speech-Based Stress Detection System** using the **Transformer-based Wav2Vec2 architecture**.

Through transfer learning and audio augmentation techniques, the model effectively learned stress-related acoustic characteristics from speech recordings.

### 📈 Final Achievements

| Metric    | Value  |
| --------- | ------ |
| Accuracy  | 78.57% |
| Precision | 73.53% |
| Recall    | 89.29% |
| F1 Score  | 80.65% |

The obtained results demonstrate that Transformer-based models offer a promising approach for automatic stress detection and can be extended toward real-time healthcare and mental well-being applications.

---

# 📚 References

1. **Baevski, A., Zhou, H., Mohamed, A., & Auli, M. (2020)**
   *wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations.*

2. **Paszke, A. et al. (2019)**
   *PyTorch: An Imperative Style, High-Performance Deep Learning Library.*

3. **Wolf, T. et al. (2020)**
   *Transformers: State-of-the-Art Natural Language Processing.*

4. **McFee, B. et al. (2015)**
   *Librosa: Audio and Music Signal Analysis in Python.*

5. **Pedregosa, F. et al. (2011)**
   *Scikit-learn: Machine Learning in Python.*

---

# 👨‍💻 Author

## Shourya Kumar

### 🎙️ Stress Detection from Speech Using Transformer-Based Deep Learning

⭐ If you found this project useful, consider giving it a **Star** on GitHub.

---

<div align="center">

## 🌟 Thank You For Visiting 🌟

### Speech AI • Deep Learning • Healthcare Technology

</div>
